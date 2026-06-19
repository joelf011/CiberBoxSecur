import axiosConfig from './axiosConfig';
import { Alerts } from '../utils/Alerts';

/**
 * Wrapper da área de tickets e chat.
 * Também mostra feedback ao utilizador quando o backend devolve erros.
 */
const forumApi = {
    // Tickets: listagem, detalhe, criação, atribuição e atualização.
    async getTickets(filters = {}) {
        try {
            const response = await axiosConfig.get('/tickets', { params: filters });
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to fetch tickets';
            Alerts.error(msg);
            throw error;
        }
    },

    async getTicketById(id) {
        try {
            const response = await axiosConfig.get(`/tickets/${id}`);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to fetch ticket details';
            Alerts.error(msg);
            throw error;
        }
    },

    async createTicket(data) {
        try {
            const response = await axiosConfig.post('/tickets', data);
            Alerts.success('Ticket created successfully!');
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to create ticket';
            Alerts.error(msg);
            throw error;
        }
    },

    async claimTicket(id, assignedToUserId) {
        try {
            const response = await axiosConfig.post(`/tickets/${id}/claim`);
            Alerts.success('Ticket claimed successfully!');
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to claim ticket';
            Alerts.error(msg);
            throw error;
        }
    },

    async updateTicketStatus(id, status) {
        try {
            const response = await axiosConfig.put(`/tickets/${id}`, { status });
            Alerts.success('Ticket updated successfully!');
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to update ticket';
            Alerts.error(msg);
            throw error;
        }
    },

    // Chats e mensagens: histórico e envio ligado a tickets.
    async getChatMessagesForTicket(chatId) {
        try {
            const response = await axiosConfig.get(`/chats/${chatId}/messages`);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to fetch messages';
            Alerts.error(msg);
            throw error;
        }
    },

    async getTicketMessages(ticketId) {
        try {
            const response = await axiosConfig.get(`/tickets/${ticketId}/messages`);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to fetch messages';
            Alerts.error(msg);
            throw error;
        }
    },

    async sendMessageToTicket(chatId, ticketId, content) {
        try {
            const payload = {
                ticket_id: ticketId,
                content
            };

            // Inclui chat_id apenas quando o ticket já tem sala associada.
            if (chatId) {
                payload.chat_id = chatId;
            }

            const response = await axiosConfig.post('/chats/messages', payload);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to send message';
            Alerts.error(msg);
            throw error;
        }
    },

    async getOrCreateChatForUsers(targetUserId, companyId) {
        try {
            const response = await axiosConfig.post('/chats', {
                target_user_id: targetUserId,
                company_id: companyId
            });
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to create/get chat';
            Alerts.error(msg);
            throw error;
        }
    }
};

export default forumApi;
