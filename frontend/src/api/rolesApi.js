import api from './axiosConfig';

export const rolesApi = {
  // Carregar todos os cargos
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  //Carregar a lista de todas as permissões
  getPermissions: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },

  // Criar um novo cargo (nome e array de IDs de permissões)
  createRole: async (roleData) => {
    const response = await api.post('/roles', roleData);
    return response.data;
  },

  // Atualizar um cargo existente
  updateRole: async (roleId, roleData) => {
    const response = await api.put(`/roles/${roleId}`, roleData);
    return response.data;
  },

  // Eliminar um cargo
  deleteRole: async (roleId) => {
    const response = await api.delete(`/roles/${roleId}`);
    return response.data;
  }
};