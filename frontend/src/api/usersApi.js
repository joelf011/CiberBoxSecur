import api from './axiosConfig';

export const usersApi = {
  // Ir buscar utilizadores
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar utilizadores.');
    }
  },

  // Ir buscar os cargos
  getRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar cargos.');
    }
  },

  // Criar Utilizador
  createUser: async (userData) => {
    try {
      // O Axios faz o JSON.stringify por ti
      const response = await api.post('/auth/register', userData); 
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao criar utilizador.');
    }
  },

  // Atualizar Utilizador
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao atualizar utilizador.');
    }
  },

  getMyProfile: async () => {
    const response = await api.get('/users/profile'); 
    return response.data;
  },

  updateMyProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Eliminar Utilizador
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao eliminar utilizador.');
    }
  },

  // Ativar Conta
  activateAccount: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/activate', { token, newPassword });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao ativar a conta.');
    }
  },

  // Reenviar Ativação
  resendActivation: async (userId) => {
    try {
      const response = await api.post('/auth/resend-activation', { id: userId });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao reenviar convite.');
    }
  },

  // Pede o link de recuperação
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao pedir recuperação.');
    }
  },

  // Grava a nova password com o token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao alterar password.');
    }
  }
};