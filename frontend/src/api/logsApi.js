import api from './axiosConfig';

export const logsApi = {
  // Ir buscar os logs de auditoria
  getAuditLogs: async () => {
    try {
      const response = await api.get('/audit-logs');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erro ao carregar os logs de auditoria.');
    }
  }
};