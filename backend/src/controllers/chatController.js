/**
 * Controlador de Chat e Mensagens.
 *
 * Responsável por:
 * - Criar ou reutilizar salas de chat entre dois utilizadores.
 * - Enviar mensagens (texto e/ou anexos) associadas a um chat e opcionalmente a um ticket.
 * - Carregar o histórico de mensagens e marcar como lidas.
 * - Listar as conversas ativas do utilizador autenticado com contagem de não lidas.
 *
 * Modelo de dados:
 * - Chat: sala de conversa associada a uma empresa (company_id).
 * - ChatUser: tabela de junção N:N entre Chat e User (participantes da sala).
 * - Message: mensagem individual com referência ao chat, ao remetente e opcionalmente a um ticket.
 *
 * Fluxo:
 * Frontend (componente de chat) -> API -> Base de Dados (Chat, ChatUser, Message) -> Resposta JSON.
 */
const { Chat, ChatUser, Message, User, Ticket } = require('../models');
const { Op } = require('sequelize');
const auditLogService = require('../services/auditLogService');

const chatController = {

    // Procura um chat existente entre dois utilizadores ou cria um novo se não existir.
    async findOrCreateChat(req, res) {
        try {
            const my_id = req.user.id;
            const { target_user_id, company_id } = req.body;

            if (my_id === target_user_id) {
                return res.status(400).json({ error: "You cannot start a chat with yourself." });
            }

            // Obtém todos os chat_ids do utilizador autenticado para cruzar com o utilizador alvo.
            const myChats = await ChatUser.findAll({ where: { user_id: my_id }, attributes: ['chat_id'] });
            const myChatIds = myChats.map(cu => cu.chat_id);

            // Verifica se o utilizador alvo já participa num dos chats do utilizador atual.
            const existingChatUser = await ChatUser.findOne({
                where: {
                    user_id: target_user_id,
                    chat_id: { [Op.in]: myChatIds }
                }
            });

            // Se já existe uma sala partilhada, devolve o ID sem criar duplicados.
            if (existingChatUser) {
                return res.status(200).json({ 
                    message: 'Chat already exists.', 
                    chat_id: existingChatUser.chat_id 
                });
            }

            // Cria uma nova sala de chat associada à empresa.
            const newChat = await Chat.create({ company_id });

            // Regista ambos os utilizadores como participantes na tabela de junção.
            await ChatUser.bulkCreate([
                { chat_id: newChat.id, user_id: my_id },
                { chat_id: newChat.id, user_id: target_user_id }
            ]);

            // Regista a criação da sala no log de auditoria.
            await auditLogService.logEvent({
                user_id: my_id,
                action: 'CHAT_CREATE',
                entity_type: 'Chat',
                entity_id: newChat.id,
                ip_address: req.ip
            });

            return res.status(201).json({ 
                message: 'Chat created successfully!', 
                chat_id: newChat.id 
            });

        } catch (error) {
            console.error('Find/Create Chat error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Envia uma mensagem num chat. Resolve automaticamente o chat_id a partir do ticket_id quando necessário.
    async sendMessage(req, res) {
        try {
            const sender_id = req.user.id;
            let { chat_id, ticket_id, content } = req.body;

            // Permite conteúdo vazio apenas se existir um ficheiro anexado (ex.: imagem, PDF).
            if ((!content || content.trim() === '') && !req.file) {
                return res.status(400).json({ error: "A mensagem ou o anexo não podem estar vazios." });
            }

            // Quando o frontend envia apenas o ticket_id, resolve o chat_id correspondente.
            if (ticket_id && !chat_id) {
                // Tenta encontrar o chat através de mensagens já existentes neste ticket.
                const existingMessage = await Message.findOne({
                    where: { ticket_id: ticket_id },
                    attributes: ['chat_id']
                });

                if (existingMessage && existingMessage.chat_id) {
                    chat_id = existingMessage.chat_id;
                } else {
                    // Sem mensagens prévias: resolve os participantes a partir do ticket.
                    const ticket = await Ticket.findByPk(ticket_id);

                    if (!ticket) {
                        return res.status(404).json({ error: "Ticket not found." });
                    }

                    // Impede o envio de mensagens em tickets já encerrados.
                    if (ticket.status === 'Closed') {
                        return res.status(403).json({ error: "This ticket is closed and cannot receive new messages." });
                    }

                    const userA = ticket.opened_by_user_id;
                    const userB = ticket.assigned_to_user_id;

                    // O ticket precisa de estar reclamado por um gestor antes de permitir mensagens.
                    if (!userB) {
                        return res.status(400).json({ error: "Cannot send messages. The ticket must be claimed by a manager first." });
                    }

                    // Apenas os dois participantes do ticket (cliente e gestor) podem enviar mensagens.
                    if (sender_id !== userA && sender_id !== userB) {
                        return res.status(403).json({ error: "Access denied. You are not a participant of this ticket." });
                    }

                    // Procura um chat existente que inclua ambos os participantes do ticket.
                    const userAChats = await ChatUser.findAll({ where: { user_id: userA }, attributes: ['chat_id'] });
                    const userAChatIds = userAChats.map(c => c.chat_id);

                    if (userAChatIds.length > 0) {
                        const sharedChats = await ChatUser.findAll({
                            where: { user_id: userB, chat_id: { [Op.in]: userAChatIds } },
                            attributes: ['chat_id']
                        });
                        const sharedChatIds = sharedChats.map(c => c.chat_id);

                        if (sharedChatIds.length > 0) {
                            // Filtra pela empresa do ticket para evitar colisões entre empresas diferentes.
                            const chatWithBoth = await Chat.findOne({
                                where: { company_id: ticket.company_id, id: { [Op.in]: sharedChatIds } }
                            });
                            if (chatWithBoth) {
                                chat_id = chatWithBoth.id;
                            }
                        }
                    }

                    // Se nenhum chat partilhado foi encontrado, cria um novo para este ticket.
                    if (!chat_id) {
                        const newChat = await Chat.create({ company_id: ticket.company_id });
                        await ChatUser.create({ chat_id: newChat.id, user_id: userA });
                        if (userA !== userB) {
                            await ChatUser.create({ chat_id: newChat.id, user_id: userB });
                        }
                        chat_id = newChat.id;
                    }
                }
            }

            if (!chat_id) {
                return res.status(400).json({ error: "Could not find associated chat for this ticket. Please ensure the ticket has been claimed." });
            }

            // Validação IDOR: confirma que o remetente é participante da sala antes de permitir o envio.
            const isParticipant = await ChatUser.findOne({
                where: { chat_id: chat_id, user_id: sender_id }
            });

            if (!isParticipant) {
                return res.status(403).json({ error: "Access denied. You are not a participant of this chat room." });
            }

            const newMessage = await Message.create({
                sender_id,
                chat_id: chat_id,
                ticket_id: ticket_id || null,
                content: content || '',
                attachment: req.file ? `/uploads/${req.file.filename}` : null
            });

            // Carrega a mensagem com os dados do utilizador (nome, avatar) para o frontend
            // renderizar imediatamente sem necessitar de um novo pedido à API.
            const populatedMessage = await Message.findByPk(newMessage.id, {
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'avatar']
                }]
            });

            // Regista o envio da mensagem no log de auditoria.
            await auditLogService.logEvent({
                user_id: sender_id,
                action: 'MESSAGE_SEND',
                entity_type: 'Message',
                entity_id: newMessage.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Message sent!', data: populatedMessage });
        } catch (error) {
            console.error('Send Message error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Carrega o histórico de mensagens de um chat e marca as mensagens recebidas como lidas.
    async getChatMessages(req, res) {
        try {
            const my_id = req.user.id;
            const { chat_id } = req.params;

            // Prevenção IDOR: apenas participantes ou admins podem aceder ao histórico.
            const isParticipant = await ChatUser.findOne({
                where: { chat_id, user_id: my_id }
            });

            if (!isParticipant && req.user.role_id !== 1) {
                return res.status(403).json({ error: 'Forbidden: You do not have access to this chat.' });
            }

            // Carrega todas as mensagens ordenadas cronologicamente com dados do remetente.
            const messages = await Message.findAll({
                where: { chat_id },
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'avatar']
                }],
                order: [['createdAt', 'ASC']]
            });

            // Marca como lidas todas as mensagens enviadas por outros utilizadores neste chat.
            await Message.update(
                { is_read: true },
                { 
                    where: { 
                        chat_id, 
                        sender_id: { [Op.ne]: my_id }, // Op.ne = "Not Equal" — exclui as mensagens do próprio utilizador
                        is_read: false 
                    } 
                }
            );

            return res.status(200).json(messages);
        } catch (error) {
            console.error('Get Messages error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista todas as conversas do utilizador autenticado com a contagem de mensagens não lidas em cada uma.
    async getMyChats(req, res) {
        try {
            const my_id = req.user.id;

            // Obtém os IDs de todos os chats onde o utilizador participa.
            const myChatUsers = await ChatUser.findAll({ where: { user_id: my_id } });
            const chatIds = myChatUsers.map(cu => cu.chat_id);

            // Carrega os detalhes das salas, ordenadas pela última atividade.
            const activeChats = await Chat.findAll({
                where: { id: { [Op.in]: chatIds } },
                order: [['updatedAt', 'DESC']]
            });

            // Agrega a contagem de mensagens não lidas (enviadas por outros) para cada sala.
            const chatsWithUnreadCounts = await Promise.all(activeChats.map(async (chat) => {
                const unreadCount = await Message.count({
                    where: {
                        chat_id: chat.id,
                        sender_id: { [Op.ne]: my_id },
                        is_read: false
                    }
                });
                
                return {
                    ...chat.toJSON(),
                    unread_count: unreadCount
                };
            }));

            return res.status(200).json(chatsWithUnreadCounts);
        } catch (error) {
            console.error('Get My Chats error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = chatController;