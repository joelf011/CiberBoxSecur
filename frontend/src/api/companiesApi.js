import api from './axiosConfig';

/**
 * Wrapper dos endpoints de empresas.
 * Usado na gestão administrativa e em formulários que precisam de relações com clientes/gestores.
 */
export const companiesApi = {
  // Lista empresas com relações carregadas pelo backend.
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Obtém uma empresa para preencher o modal de edição.
  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // Cria empresa e envia relações selecionadas no formulário.
  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  // Atualiza empresa e respetivos gestores atribuídos.
  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  // Elimina logicamente a empresa no backend.
  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },

  // Restaura empresa previamente eliminada por soft delete.
  restoreCompany: async (id) => {
    const response = await api.patch(`/companies/${id}/restore`);
    return response.data;
  }
};
