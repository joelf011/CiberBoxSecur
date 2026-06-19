import api from './axiosConfig';

/**
 * Wrapper dos endpoints de incidentes.
 * A UI envia dados estruturados e o backend aplica permissões e filtros por empresa.
 */
export const incidentsApi = {
  // Cria incidente com dados do formulário CNCS quando existirem.
  createIncident: async (incidentData) => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },

  // Lista incidentes visíveis para o utilizador autenticado.
  getAllIncidents: async () => {
    const response = await api.get('/incidents');
    return response.data;
  },

  // Carrega detalhe de um incidente para páginas de leitura/gestão.
  getIncidentById: async (id) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  // Atualiza estado ou metadados do incidente.
  updateIncident: async (id, updateData) => {
    const response = await api.put(`/incidents/${id}`, updateData);
    return response.data;
  },

  // Apaga logicamente o incidente no backend.
  deleteIncident: async (id) => {
    const response = await api.delete(`/incidents/${id}`);
    return response.data;
  },

  // Restaura incidente previamente eliminado por soft delete.
  restoreIncident: async (id) => {
    const response = await api.patch(`/incidents/${id}/restore`);
    return response.data;
  }
};
