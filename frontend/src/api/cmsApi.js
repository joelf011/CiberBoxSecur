import api from './axiosConfig';

/**
 * Wrapper do CMS da homepage.
 * A página pública lê este JSON e o backoffice grava alterações no mesmo endpoint.
 */
export const cmsApi = {
  // Carrega o conteúdo editável da Home guardado na tabela Pages.
  getHomeData: async () => {
    const response = await api.get('/cms/home');
    return response.data;
  },
  // Persiste o JSON produzido pelo editor de conteúdos do backoffice.
  updateHomeData: async (dadosSite) => {
    const response = await api.put('/cms/home', dadosSite);
    return response.data;
  }
};
