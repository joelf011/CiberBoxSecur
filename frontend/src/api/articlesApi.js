import api from './axiosConfig';

export const articlesApi = {

  // ÁREA PÚBLICA

  // Obter artigos para a grelha
  getPublicArticles: async (limit = 6, offset = 0, categoryId = '', search = '') => {
    let url = `/articles/public?limit=${limit}&offset=${offset}`;
    
    if (categoryId) url += `&category=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await api.get(url);
    return response.data;
  },

  // Obter detalhes de um artigo
  getArticleBySlug: async (slug) => {
    const response = await api.get(`/articles/public/${slug}`);
    return response.data;
  },

  // Backoffice

  // Obter todos os artigos
  getAllAdminArticles: async () => {
    const response = await api.get('/articles');
    return response.data;
  },

  // Criar artigo
  createArticle: async (formData) => {
    const response = await api.post('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Atualizar artigo
  updateArticle: async (id, formData) => {
    const response = await api.put(`/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Eliminar artigo
  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  }
};