import api from './axiosConfig';

/**
 * Wrapper simples de leitura de empresas.
 * Mantido para componentes que só precisam de consultar empresas, sem operações administrativas.
 */
export const companyApi = {
  // Consulta todas as empresas através do controller de empresas.
  getAllCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Consulta uma empresa específica para preencher vistas de detalhe.
  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  }
};
