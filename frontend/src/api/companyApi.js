import api from './axiosConfig';

export const companyApi = {
  // Procura todas as empresas (Chama o findAll do teu controller)
  getAllCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Procura uma empresa específica por ID se for necessário
  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  }
};