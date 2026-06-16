const { Ticket, Chat, ChatUser, Message, User, Company } = require('../models');
const { Op } = require('sequelize');
const auditLogService = require('../services/auditLogService');

// Helper to determine roles reliably without relying on nullable fields
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

// Centralized authorization helper
const checkTicketAccess = (user, ticket) => {
    const { isAdmin, isManager, isClient } = getUserRoles(user);

    // REGRA UNIVERSAL: Qualquer utilizador tem sempre acesso aos tickets que abriu
    if (ticket.opened_by_user_id === user.id) {
        return true;
    }

    if (isClient) {
        return false; // Se chegou aqui, não é o dono, e sendo cliente não pode ver mais nada
    }
    
    if (isManager) {
        // Managers can only access unclaimed tickets or tickets claimed by themselves
        if (ticket.assigned_to_user_id !== null && ticket.assigned_to_user_id !== user.id) {
            return false;
        }
        return true;
    }

    if (isAdmin) {
        return true;
    }
    
    return false;
};

const ticketController = {
    // NEW TICKET
    async create(req, res) {
        try {
            const opened_by_user_id = req.user.id; 
            const { category, priority, subject, description } = req.body;
            
            const { isClient } = getUserRoles(req.user);
            const isStaff = !isClient;

            // Fetch fresh DB user to bypass stale JWT payload
            const dbUser = await User.findByPk(opened_by_user_id);
            
            if (!dbUser) {
                return res.status(401).json({ error: 'User not found. Please log in again.' });
            }

            let company_id;
            if (!isStaff) {
                // Cliente: força a usar a empresa associada ao perfil real
                company_id = dbUser.company_id;

                // Fallback: verifica se é dono (client_owner_id) de alguma empresa
                if (!company_id) {
                    const ownedCompany = await Company.findOne({ where: { client_owner_id: dbUser.id } });
                    if (ownedCompany) {
                        company_id = ownedCompany.id;
                    }
                }
            } else {
                // Admin/Gestor: pode definir a empresa no corpo do pedido
                company_id = req.body.company_id || dbUser.company_id;
            }

            if (!company_id) {
                return res.status(400).json({ error: 'A tua conta ainda não está associada a nenhuma Empresa. Por favor, contacta a administração.' });
            }

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

            // LOG: ticket created
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

    // LIST ALL
    async findAll(req, res) {
        try {
            const { isAdmin, isManager, isClient } = getUserRoles(req.user);
            const { page, limit = 10, search, status, priority, category, company_id, startDate, endDate } = req.query;

            let whereClause = {};
            
            if (isClient) {
                whereClause.opened_by_user_id = req.user.id;
            } else if (isManager) {
                whereClause[Op.or] = [
                    { opened_by_user_id: req.user.id }, // Garante que Gestores vêm os seus próprios tickets
                    { assigned_to_user_id: null },
                    { assigned_to_user_id: req.user.id }
                ];
            }

            // Compatibilidade com código legado: Se não pedir página, devolve todos como antigamente
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

            // --- LÓGICA DE PAGINAÇÃO E FILTRAGEM ---
            if (status && status !== 'all') whereClause.status = status;
            if (priority) whereClause.priority = priority;
            if (category) whereClause.category = category;
            if (company_id) whereClause.company_id = company_id;

            if (startDate || endDate) {
                whereClause.createdAt = {};
                if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    whereClause.createdAt[Op.lte] = end;
                }
            }

            if (search) {
                const searchConditions = [{ subject: { [Op.iLike]: `%${search}%` } }];
                if (!isNaN(search)) searchConditions.push({ id: parseInt(search) }); // Permite procurar por ID #
                searchConditions.push({ '$Company.name$': { [Op.iLike]: `%${search}%` } }); // Permite procurar por nome da Empresa

                if (whereClause[Op.or]) {
                    // Junta a regra RBAC (Gestor vê X) com a pesquisa atual
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
                subQuery: false // Necessário quando usamos filtros num campo "include" ($Company.name$) com paginação (limit/offset)
            });

            const totalPages = Math.ceil(count / parseInt(limit));

            return res.status(200).json({ data: rows, total_records: count, total_pages: totalPages, current_page: parseInt(page) });
        } catch (error) {
            console.error('Find All Tickets error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LIST ONE
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

    // UPDATE / CLAIM
    async update(req, res) {
        try {
            const { id } = req.params;
            const { category, priority, status } = req.body;

            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden.' });
            }
            
            // Bloqueio extra: Clientes nunca podem editar detalhes do ticket (fechar, mudar prioridades)
            const { isClient } = getUserRoles(req.user);
            if (isClient) {
                return res.status(403).json({ error: 'Clientes não têm permissão para editar os estados dos tickets.' });
            }

            // Um cliente só pode atualizar o seu próprio ticket se o estado for 'Open'
            if (req.user.id === ticket.opened_by_user_id && ticket.status !== 'Open') {
                // Adicionar aqui lógica se o cliente puder editar algo depois de criado
            }

            await ticket.update({ category, priority, status });

            // LOG: ticket updated
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

    // CLAIM TICKET (Apenas para Gestores/Admins)
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

            const ticket = await Ticket.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });

            if (!ticket) {
                await t.rollback();
                return res.status(404).json({ error: 'Ticket not found.' });
            }

            if (ticket.assigned_to_user_id) {
                await t.rollback();
                return res.status(409).json({ error: 'This ticket has already been claimed.' });
            }
            
            // Auto-create chat when ticket is first claimed
            let createdChat = null;
            try {
                const clientId = ticket.opened_by_user_id;
                createdChat = await findOrCreateChatForTicket(clientId, managerId, ticket.company_id, t);
            } catch (chatError) {
                await t.rollback();
                console.error('Failed to create chat for ticket:', chatError);
                return res.status(500).json({ error: 'Could not create chat room for this ticket.' });
            }

            ticket.assigned_to_user_id = managerId;
            ticket.status = 'In Progress';
            await ticket.save({ transaction: t });

            await t.commit();

            // LOG: ticket updated
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

            // Include chat info if one was created
            if (createdChat) {
                response.chat = createdChat;
            }

            return res.status(200).json(response);
        } catch (error) {
            console.error('Update Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findByPk(id);
            
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await ticket.destroy();

            // LOG: ticket deleted
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

    // RESTORE
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

            // LOG: ticket restored
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

    // GET TICKET MESSAGES (linked via ticket_id and chat_id)
    async getMessages(req, res) {
        try {
            const { id } = req.params;

            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            if (!checkTicketAccess(req.user, ticket)) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            // Get all messages for this ticket
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
            // Log detalhado para o terminal do backend
            console.error('Get Ticket Messages error:', error.message);
            return res.status(500).json({ error: `Erro na Base de Dados: ${error.message}` });
        }
    }
};

// Helper function: Auto-create chat when ticket is claimed
async function findOrCreateChatForTicket(clientId, managerId, companyId, transaction) {
    // Search for existing chat with both users
    const clientChats = await ChatUser.findAll({
        where: { user_id: clientId },
        attributes: ['chat_id'],
        transaction
    });
    const clientChatIds = clientChats.map(c => c.chat_id);

    if (clientChatIds.length > 0) {
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
            const existingChat = await Chat.findOne({
                where: { company_id: companyId, id: { [Op.in]: sharedChatIds } },
                transaction
            });
            if (existingChat) return existingChat;
        }
    }

    // Create new chat with both users
    const newChat = await Chat.create({ company_id: companyId }, { transaction });
    await ChatUser.create({ chat_id: newChat.id, user_id: clientId }, { transaction });
    if (clientId !== managerId) {
        await ChatUser.create({ chat_id: newChat.id, user_id: managerId }, { transaction });
    }

    return newChat;
}

module.exports = ticketController;