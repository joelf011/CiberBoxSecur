import api from './axiosConfig';

export const documentApi = {
  // Procura todos os documentos/pastas do servidor
  getAllDocuments: async () => {
    const response = await api.get('/documents');
    return response.data; // Devolve a lista real da tua BD
  },

  // Cria um registo no servidor. 
  // Como é uma pasta vazia (sem ficheiro físico), enviamos como JSON normal
  createFolder: async (folderName) => {
    const response = await api.post('/global-folders', {
      name: folderName // Envia o nome que digitaste no modal (ex: 'gdg')
    });
    return response.data;
  },

  // Adiciona isto dentro do objeto exportado do documentApi:
  deleteFolder: async (id) => {
      const response = await api.delete(`/global-folders/${id}`); // Ajusta o prefixo 'API' se usares outro nome para o axios instance
      return response.data;
  },
};