import api from './axiosConfig';

/**
 * Wrapper dos dados agregados do dashboard.
 * O backend aplica permissões e âmbito de empresa antes de devolver KPIs e gráficos.
 */
export const dashboardApi = {
  // Carrega o pacote completo usado pelos cartões, gráficos e tabela de incidentes.
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  }
};
