import api from './axiosConfig';

export const cmsApi = {
  getHomeData: async () => {
    const response = await api.get('/cms/home');
    return response.data;
  },
  updateHomeData: async (dadosSite) => {
    const response = await api.put('/cms/home', dadosSite);
    return response.data;
  }
};