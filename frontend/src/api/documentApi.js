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
    const response = await api.post('/documents', {
      name: folderName,
      is_folder: true, // Ou o nome do campo que o teu controller usa para distinguir
      type: 'folder'
    });
    return response.data;
  }
};