/**
 * Controlador de Tickets de Suporte.
 *
 * Responsável por:
 * - Criação, listagem, atualização e eliminação (soft) de tickets.
 * - Reclamação (claim) de tickets por gestores, com criação automática de sala de chat.
 * - Controlo de acesso baseado em papéis (RBAC): Admin, Gestor e Cliente.
 * - Listagem com paginação, filtragem e pesquisa.
 * - Carregamento de mensagens associadas a um ticket.
 *
 * Modelo RBAC:
 * - Admin (role_id=1): acesso total a todos os tickets.
 * - Gestor (role_id=2 ou com permissão UPDATE_TICKET): vê tickets não reclamados ou reclamados por si.
 * - Cliente (role_id=3 ou sem permissões de gestão): vê apenas os tickets que abriu.
 *
 * Fluxo principal:
 * Frontend -> API (este controlador) -> Base de Dados (Ticket, Chat, Message) -> Resposta JSON -> Atualização da interface.
 */
const { Ticket, Chat, ChatUser, Message, User, Company } = require('../models');
const { Op } = require('sequelize');
const auditLogService = require('../services/auditLogService');

/**
 * Determina os papéis do utilizador de forma robusta.
 * Suporta permissões em formato Array, Array de Objetos e String (compatibilidade com diferentes payloads JWT).
 */
const getUserRoles = (user) => {
    const roleId = Number(user.role_id);
    const isAdmin = roleId === 1;
    const isExplicitClient = roleId === 3; 

    // Leitura à prova de bala das permissões (suporta Arrays, Arrays de Objetos e Strings)
    let hasManagePerms = false;
    if (user.permissions) {
        if (Array.isArray(user.permissions)) {
            hasManagePerms = user.permissions.some(p => p === 'UPDATE_TICKET' || p.name === 'UPDATE_TICKET');
        } else if (typeof user.permissions === 'string') {
            hasManagePerms = user.permissions.includes('UPDATE_TICKET');
        }
    }

    const isManager = !isExplicitClient && (roleId === 2 || (!isAdmin && hasManagePerms));
    const isClient = isExplicitClient || (!isAdmin && !isManager);
    return { isAdmin, isManager, isClient };
};

/**
 * Verifica se um utilizador tem acesso a um ticket específico.
 * Regra universal: o criador do ticket tem sempre acesso. As restantes regras dependem do papel.
 */
const checkTicketAccess = (user, ticket) => {
    const { isAdmin, isManager, isClient } = getUserRoles(user);

    // Regra universal: o criador do ticket tem sempre acesso ao mesmo.
    if (ticket.opened_by_user_id === user.id) {
        return true;
    }

    // Clientes apenas veem os seus próprios tickets (já verificado acima).
    if (isClient) {
        return false;
    }
    
    // Gestores acedem a tickets não reclamados ou reclamados por si próprios.
    if (isManager) {
        if (ticket.assigned_to_user_id !== null && ticket.assigned_to_user_id !== user.id) {
            return false;
        }
        return true;
    }

    // Admins têm acesso irrestrito.
    if (isAdmin) {
        return true;
    }
    
    return false;
};

const ticketController = {
    // Cria um novo ticket de suporte. Impede duplicados se o utilizador já tiver um ticket ativo.
    async create(req, res) {
        try {
            const opened_by_user_id = req.user.id; 
            const { category, priority, subject, description } = req.body;
            
            const { isClient } = getUserRoles(req.user);
            const isStaff = !isClient;

            // Consulta a BD para obter dados atualizados, evitando informação obsoleta do JWT.
            const dbUser = await User.findByPk(opened_by_user_id);
            
            if (!dbUser) {
                return res.status(401).json({ error: 'User not found. Please log in again.' });
            }

            let company_id;
            if (!isStaff) {
                // Cliente: usa obrigatoriamente a empresa associada ao seu perfil.
                company_id = dbUser.company_id;

                // Fallback: verifica se é proprietário (client_owner_id) de alguma empresa.
                if (!company_id) {
                    const ownedCompany = await Company.findOne({ where: { client_owner_id: dbUser.id } });
                    if (ownedCompany) {
                        company_id = ownedCompany.id;
                    }
                }
            } else {
                // Admin/Gestor: pode especificar a empresa no corpo do pedido.
                company_id = req.body.company_id || dbUser.company_id;
            }

            if (!company_id) {
                return res.status(400).json({ error: 'A tua conta ainda não está associada a nenhuma Empresa. Por favor, contacta a administração.' });
            }

            // Impede a criação de tickets duplicados enquanto existir um ticket ativo (Open, In Progress ou Resolved).
            const activeTicket = await Ticket.findOne({
                where: {
                    opened_by_user_id,
                    status: {
                        [Op.in]: ['Open', 'In Progress', 'Resolved']
                    }
                }
            });
            
            if (activeTicket) {
                return res.status(400).json({ 
                    error: 'You already have an active support ticket. Please wait for it to be resolved before opening a new one.' 
                });
            }

            const newTicket = await Ticket.create({
                company_id,
                opened_by_user_id,
                category,
                subject,
                description,
            });

            // Regista a criação do ticket no log de auditoria.
            await auditLogService.logEvent({
                user_id: opened_by_user_id,
                action: 'TICKET_CREATE',
                entity_type: 'Ticket',
                entity_id: newTicket.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Ticket opened successfully!', ticket: newTicket });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company does not exist.' });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for category.' });
            }
            console.error('Create Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista tickets com controlo de acesso RBAC. Suporta paginação, filtragem e pesquisa.
    async findAll(req, res) {
        try {
            const { isAdmin, isManager, isClient } = getUserRoles(req.user);
            const { page, limit = 10, search, status, priority, category, company_id, startDate, endDate } = req.query;

            let whereClause = {};
            
            // Clientes veem apenas os seus tickets.
            if (isClient) {
                whereClause.opened_by_user_id = req.user.id;
            } else if (isManager) {
                // Gestores veem os seus próprios tickets, os não reclamados e os que reclamaram.
                whereClause[Op.or] = [
                    { opened_by_user_id: req.user.id },
                    { assigned_to_user_id: null },
                    { assigned_to_user_id: req.user.id }
                ];
            }

            // Compatibilidade com código legado: sem página, devolve todos os tickets sem paginação.
            if (!page) {
                const tickets = await Ticket.findAll({ 
                    where: whereClause,
                    include: [{
                        model: Company,
                        attributes: ['id', 'name']
                    }],
                    order: [['createdAt', 'DESC']] 
                });
                return res.status(200).json(tickets);
            }

            // --- Filtros opcionais enviados via query string ---
            if (status && status !== 'all') whereClause.status = status;
            if (priority) whereClause.priority = priority;
            if (category) whereClause.category = category;
            if (company_id) whereClause.company_id = company_id;

            // Filtro por intervalo de datas (inclui o dia final completo até 23:59:59).
            if (startDate || endDate) {
                whereClause.createdAt = {};
                if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    whereClause.createdAt[Op.lte] = end;
                }
            }

            // Pesquisa por assunto, ID numérico ou nome da empresa.
            if (search) {
                const searchConditions = [{ subject: { [Op.iLike]: `%${search}%` } }];
                if (!isNaN(search)) searchConditions.push({ id: parseInt(search) });
                searchConditions.push({ '$Company.name$': { [Op.iLike]: `%${search}%` } });

                if (whereClause[Op.or]) {
                    // Combina as condições RBAC do gestor (Op.or) com os filtros de pesquisa usando Op.and.
                    const rbacOr = whereClause[Op.or];
                    delete whereClause[Op.or];
                    whereClause[Op.and] = [{ [Op.or]: rbacOr }, { [Op.or]: searchConditions }];
                } else {
                    whereClause[Op.or] = searchConditions;
                }
            }

            const offset = (parseInt(page) - 1) * parseInt(limit);

            const { count, rows } = await Ticket.findAndCountAll({ 
                where: whereClause,
                include: [{ model: Company, attributes: ['id', 'name'] }],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                subQuery: false // Necessário quando se usam filtros em campos de "include" ($Company.name$) com paginação.
            });

            const totalPages = Math.ceil(count / parseInt(limit));

            return res.status(200).json({ data: rows, total_records: count, total_pages: totalPages, current_page: parseInt(page) });
        } catch (error) {
            console.error('Find All Tickets error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Devolve os detalhes de um ticket individual com verificação de acesso.
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findByPk(id);
            
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden: Access denied to this ticket.' });
            }

            return res.status(200).json(ticket);
        } catch (error) {
            console.error('Find One Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Atualiza os campos de um ticket (categoria, prioridade, estado). Apenas acessível a staff.
    async update(req, res) {
        try {
            const { id } = req.params;
            const { category, priority, status } = req.body;

            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden.' });
            }
            
            // Clientes nunca podem alterar o estado, prioridade ou categoria dos tickets.
            const { isClient } = getUserRoles(req.user);
            if (isClient) {
                return res.status(403).json({ error: 'Clientes não têm permissão para editar os estados dos tickets.' });
            }

            // Reservado para futura lógica: permitir edição limitada pelo cliente enquanto o ticket estiver "Open".
            if (req.user.id === ticket.opened_by_user_id && ticket.status !== 'Open') {
            }

            await ticket.update({ category, priority, status });

            // Regista a atualização do ticket no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'TICKET_UPDATE',
                entity_type: 'Ticket',
                entity_id: ticket.id,
                ip_address: req.ip
            });

            const response = {
                message: 'Ticket updated successfully!',
                ticket
            };

            return res.status(200).json(response);
        } catch (error) {
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for priority or status.' });
            }
            console.error('Update Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    /**
     * Reclama (claim) um ticket para o gestor autenticado.
     * Usa transação com SELECT FOR UPDATE para evitar condições de corrida (dois gestores a reclamar em simultâneo).
     * Cria automaticamente uma sala de chat entre o gestor e o cliente do ticket.
     */
    async claim(req, res) {
        const t = await Ticket.sequelize.transaction();
        try {
            const { id } = req.params;
            const managerId = req.user.id;

            const { isClient } = getUserRoles(req.user);
            const isStaff = !isClient;

            if (!isStaff) {
                await t.rollback();
                return res.status(403).json({ error: 'Forbidden: Only authorized personnel can claim tickets.' });
            }

            // Lock pessimista: impede que outro gestor reclame o mesmo ticket em simultâneo.
            const ticket = await Ticket.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });

            if (!ticket) {
                await t.rollback();
                return res.status(404).json({ error: 'Ticket not found.' });
            }

            // Rejeita se o ticket já foi reclamado por outro gestor.
            if (ticket.assigned_to_user_id) {
                await t.rollback();
                return res.status(409).json({ error: 'This ticket has already been claimed.' });
            }
            
            // Cria automaticamente uma sala de chat entre o cliente e o gestor ao reclamar o ticket.
            let createdChat = null;
            try {
                const clientId = ticket.opened_by_user_id;
                createdChat = await findOrCreateChatForTicket(clientId, managerId, ticket.company_id, t);
            } catch (chatError) {
                await t.rollback();
                console.error('Failed to create chat for ticket:', chatError);
                return res.status(500).json({ error: 'Could not create chat room for this ticket.' });
            }

            // Atribui o ticket ao gestor e avança o estado para "In Progress".
            ticket.assigned_to_user_id = managerId;
            ticket.status = 'In Progress';
            await ticket.save({ transaction: t });

            await t.commit();

            // Regista a reclamação do ticket no log de auditoria (fora da transação — dados já persistidos).
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'TICKET_CLAIM',
                entity_type: 'Ticket',
                entity_id: ticket.id,
                ip_address: req.ip
            });

            const response = {
                message: 'Ticket claimed successfully!',
                ticket
            };

            // Inclui os dados do chat na resposta para o frontend iniciar a conversa de imediato.
            if (createdChat) {
                response.chat = createdChat;
            }

            return res.status(200).json(response);
        } catch (error) {
            console.error('Update Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Eliminação suave (soft delete) de um ticket. O registo é mantido na BD com deletedAt preenchido.
    async delete(req, res) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findByPk(id);
            
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await ticket.destroy();

            // Regista a eliminação do ticket no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'TICKET_DELETE',
                entity_type: 'Ticket',
                entity_id: ticket.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Ticket deleted successfully!' });
        } catch (error) {
            console.error('Delete Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Restaura um ticket previamente eliminado (soft delete). Usa paranoid: false para encontrar registos eliminados.
    async restore(req, res) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findByPk(id, { paranoid: false });

            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            if (ticket.deletedAt === null) return res.status(400).json({ error: 'This ticket is already active.' });

            await ticket.restore();

            // Regista o restauro do ticket no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'TICKET_RESTORE',
                entity_type: 'Ticket',
                entity_id: ticket.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Ticket restored successfully!', ticket });
        } catch (error) {
            console.error('Restore Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Carrega todas as mensagens associadas a um ticket com dados do remetente (nome, avatar, e-mail).
    async getMessages(req, res) {
        try {
            const { id } = req.params;

            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            // Obtém as mensagens ligadas ao ticket via ticket_id, ordenadas cronologicamente.
            const messages = await Message.findAll({
                where: { ticket_id: id },
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email', 'avatar']
                }],
                order: [['createdAt', 'ASC']]
            });

            return res.status(200).json(messages);
        } catch (error) {
            console.error('Get Ticket Messages error:', error.message);
            return res.status(500).json({ error: `Erro na Base de Dados: ${error.message}` });
        }
    }
};

/**
 * Procura um chat existente entre o cliente e o gestor na mesma empresa,
 * ou cria um novo se não existir. Executada dentro da transação do claim.
 *
 * Estratégia de pesquisa:
 * 1. Obtém os chat_ids do cliente.
 * 2. Cruza com os chat_ids do gestor para encontrar salas partilhadas.
 * 3. Filtra pela empresa (company_id) para evitar colisões.
 * 4. Se não encontrar, cria uma nova sala com ambos os participantes.
 */
async function findOrCreateChatForTicket(clientId, managerId, companyId, transaction) {
    // Passo 1: Obtém todos os chats onde o cliente participa.
    const clientChats = await ChatUser.findAll({
        where: { user_id: clientId },
        attributes: ['chat_id'],
        transaction
    });
    const clientChatIds = clientChats.map(c => c.chat_id);

    if (clientChatIds.length > 0) {
        // Passo 2: Cruza com os chats do gestor para encontrar salas em comum.
        const managerChats = await ChatUser.findAll({
            where: {
                user_id: managerId,
                chat_id: { [Op.in]: clientChatIds }
            },
            attributes: ['chat_id'],
            transaction
        });
        const sharedChatIds = managerChats.map(c => c.chat_id);

        if (sharedChatIds.length > 0) {
            // Passo 3: Filtra pela empresa para garantir que o chat pertence ao contexto correto.
            const existingChat = await Chat.findOne({
                where: { company_id: companyId, id: { [Op.in]: sharedChatIds } },
                transaction
            });
            if (existingChat) return existingChat;
        }
    }

    // Passo 4: Nenhum chat partilhado encontrado — cria um novo com ambos os participantes.
    const newChat = await Chat.create({ company_id: companyId }, { transaction });
    await ChatUser.create({ chat_id: newChat.id, user_id: clientId }, { transaction });
    if (clientId !== managerId) {
        await ChatUser.create({ chat_id: newChat.id, user_id: managerId }, { transaction });
    }

    return newChat;
}

module.exports = ticketController;