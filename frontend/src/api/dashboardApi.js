import api from './axiosConfig';

export const dashboardApi = {
  // Carregar todos os dados estatísticos do dashboard
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  }
};