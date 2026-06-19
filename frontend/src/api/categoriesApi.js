import api from './axiosConfig';

/**
 * Wrapper dos endpoints de categorias de notícias.
 * Usado pelos filtros públicos e pela gestão editorial no backoffice.
 */
export const categoriesApi = {
  // Lista categorias para filtros e modais de gestão.
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Cria categoria; o backend pode gerar o slug automaticamente.
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Atualiza nome/slug da categoria selecionada no backoffice.
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Remove a categoria e deixa o backend tratar associações existentes.
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};
