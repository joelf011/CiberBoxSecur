import api from './axiosConfig';

/**
 * Wrapper dos logs de auditoria.
 * Mantém a construção de query params num só ponto para a página de administração.
 */
export const logsApi = {
  // Envia filtros separados para o backend compor a query paginada.
  getAuditLogs: async (page = 1, limit = 20, search = '', action = '', startDate = '', endDate = '') => {
    try {
      let url = `/audit-logs?page=${page}&limit=${limit}`;
      
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (action && action !== 'Todos os tipos') url += `&action=${encodeURIComponent(action)}`;
      
      // Datas seguem separadas para permitir filtros abertos por início ou fim.
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar os logs.');
    }
  }
};
