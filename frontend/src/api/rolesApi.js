import api from './axiosConfig';

/**
 * Wrapper dos cargos e permissões.
 * Alimenta a matriz RBAC da página de gestão de cargos.
 */
export const rolesApi = {
  // Carrega cargos já com permissões associadas.
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  // Carrega permissões disponíveis para construir a matriz do modal.
  getPermissions: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },

  // Cria cargo com nome e array de IDs de permissões.
  createRole: async (roleData) => {
    const response = await api.post('/roles', roleData);
    return response.data;
  },

  // Atualiza cargo e substitui o conjunto de permissões.
  updateRole: async (roleId, roleData) => {
    const response = await api.put(`/roles/${roleId}`, roleData);
    return response.data;
  },

  // Elimina logicamente o cargo no backend.
  deleteRole: async (roleId) => {
    const response = await api.delete(`/roles/${roleId}`);
    return response.data;
  }
};
