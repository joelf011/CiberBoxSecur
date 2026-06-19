import api from './axiosConfig';

/**
 * Wrapper dos endpoints de artigos.
 * Centraliza chamadas públicas e de backoffice para manter as páginas sem URLs hardcoded.
 */
export const articlesApi = {

  // Área pública: devolve artigos publicados com filtros de categoria e pesquisa.

  getPublicArticles: async (limit = 6, offset = 0, categoryId = '', search = '') => {
    let url = `/articles/public?limit=${limit}&offset=${offset}`;
    
    if (categoryId) url += `&category=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await api.get(url);
    return response.data;
  },

  // Detalhe público identificado por slug, usado pela rota de notícia.
  getArticleBySlug: async (slug) => {
    const response = await api.get(`/articles/public/${slug}`);
    return response.data;
  },

  // Backoffice: endpoints autenticados para gestão editorial.

  getAllAdminArticles: async () => {
    const response = await api.get('/articles');
    return response.data;
  },

  // Envia FormData porque o artigo pode incluir imagem de capa.
  createArticle: async (formData) => {
    const response = await api.post('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Mantém multipart para permitir substituir a imagem de capa.
  updateArticle: async (id, formData) => {
    const response = await api.put(`/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Elimina logicamente o artigo no backend.
  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  }
};
