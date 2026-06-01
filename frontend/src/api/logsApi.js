import api from './axiosConfig';

export const logsApi = {
  // CONFIRMA BEM ESTA LINHA: Tem de ter o startDate e o endDate separados!
  getAuditLogs: async (page = 1, limit = 20, search = '', action = '', startDate = '', endDate = '') => {
    try {
      let url = `/audit-logs?page=${page}&limit=${limit}`;
      
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (action && action !== 'Todos os tipos') url += `&action=${encodeURIComponent(action)}`;
      
      // Passar as datas para o Backend
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar os logs.');
    }
  }
};