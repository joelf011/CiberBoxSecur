const { Chat, ChatUser, Message, User } = require('../models');
const { Op } = require('sequelize');
const auditLogController = require('./auditLogController');

const chatController = {

    // CREATE
    async findOrCreateChat(req, res) {
        try {
            const my_id = req.user.id;
            const { target_user_id, company_id } = req.body;

            if (my_id === target_user_id) {
                return res.status(400).json({ error: "You cannot start a chat with yourself." });
            }

            // FIND chat bettwen both users
            // FIND all chats
            const myChats = await ChatUser.findAll({ where: { user_id: my_id }, attributes: ['chat_id'] });
            const myChatIds = myChats.map(cu => cu.chat_id);

            const existingChatUser = await ChatUser.findOne({
                where: {
                    user_id: target_user_id,
                    chat_id: { [Op.in]: myChatIds }
                }
            });

            // return chat ID
            if (existingChatUser) {
                return res.status(200).json({ 
                    message: 'Chat already exists.', 
                    chat_id: existingChatUser.chat_id 
                });
            }

            // new 'room'
            const newChat = await Chat.create({ company_id });

            // join table between both users
            await ChatUser.bulkCreate([
                { chat_id: newChat.id, user_id: my_id },
                { chat_id: newChat.id, user_id: target_user_id }
            ]);

            // LOG: new room created
            await auditLogController.logEvent({
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

    // SEND message
    async sendMessage(req, res) {
        try {
            const sender_id = req.user.id;
            const { chat_id, ticket_id, content } = req.body;

            // empty message
            if (!content || content.trim() === '') {
                return res.status(400).json({ error: "Message content cannot be empty." });
            }

            if (chat_id) {
                const isParticipant = await ChatUser.findOne({
                    where: { chat_id: chat_id, user_id: sender_id }
                });

                if (!isParticipant) {
                    return res.status(403).json({ error: "Access denied. You are not a participant of this chat room." });
                }
            }
            
            const newMessage = await Message.create({
                sender_id,
                chat_id: chat_id || null,
                ticket_id: ticket_id || null,
                content
            });

            // LOG: message sent
            await auditLogController.logEvent({
                user_id: sender_id,
                action: 'MESSAGE_SEND',
                entity_type: 'Message',
                entity_id: newMessage.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Message sent!', data: newMessage });
        } catch (error) {
            console.error('Send Message error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LOAD historic / Mark as read
    async getChatMessages(req, res) {
        try {
            const my_id = req.user.id;
            const { chat_id } = req.params;

            // LOAD
            const messages = await Message.findAll({
                where: { chat_id },
                order: [['createdAt', 'ASC']]
            });

            // Mark all messages received as read
            await Message.update(
                { is_read: true },
                { 
                    where: { 
                        chat_id, 
                        sender_id: { [Op.ne]: my_id }, // Op.ne means "Not Equal"
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

    // List active conversations
    async getMyChats(req, res) {
        try {
            const my_id = req.user.id;

            // FIND by ID
            const myChatUsers = await ChatUser.findAll({ where: { user_id: my_id } });
            const chatIds = myChatUsers.map(cu => cu.chat_id);

            // Load details and count unread messages
            const activeChats = await Chat.findAll({
                where: { id: { [Op.in]: chatIds } },
                order: [['updatedAt', 'DESC']]
            });

            // Calculate unread for each chat
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