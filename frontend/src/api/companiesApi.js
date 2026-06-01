import api from './axiosConfig';

export const companiesApi = {
  // Procurar todas as empresas
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Procurar uma empresa por ID
  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // Criar empresa
  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  // Atualizar
  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  // Eliminar
  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },

  // Restaurar 
  restoreCompany: async (id) => {
    const response = await api.patch(`/companies/${id}/restore`);
    return response.data;
  }
};