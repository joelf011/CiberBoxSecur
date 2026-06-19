import api from './axiosConfig';

/**
 * Wrapper dos documentos e pastas globais.
 * Liga a UI do repositório aos endpoints de documentos e pastas virtuais.
 */
export const documentApi = {
  // Carrega documentos e pastas já filtrados pelo backend quando aplicável.
  getAllDocuments: async () => {
    const response = await api.get('/documents');
    return response.data; // Devolve a lista persistida na base de dados.
  },

  // Cria uma pasta virtual, sem ficheiro físico, através de JSON simples.
  createFolder: async (folderName) => {
    const response = await api.post('/global-folders', {
      name: folderName // Nome recolhido no modal de criação de pasta.
    });
    return response.data;
  },

  // Remove uma pasta virtual através do endpoint global de pastas.
  deleteFolder: async (id) => {
      const response = await api.delete(`/global-folders/${id}`);
      return response.data;
  },
};
