import api from './axiosConfig';

export const incidentsApi = {
  // Criar um novo incidente
  createIncident: async (incidentData) => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },

  // Obter todos os incidentes
  getAllIncidents: async () => {
    const response = await api.get('/incidents');
    return response.data;
  },

  // Obter detalhes de um incidente específico
  getIncidentById: async (id) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  // Atualizar um incidente
  updateIncident: async (id, updateData) => {
    const response = await api.put(`/incidents/${id}`, updateData);
    return response.data;
  },

  // Apagar
  deleteIncident: async (id) => {
    const response = await api.delete(`/incidents/${id}`);
    return response.data;
  },

  // Restaurar
  restoreIncident: async (id) => {
    const response = await api.patch(`/incidents/${id}/restore`);
    return response.data;
  }
};