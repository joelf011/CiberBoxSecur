import api from './axiosConfig';

export const categoriesApi = {
  // Obter todas as categorias
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Criar
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Atualizar
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Eliminar
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};