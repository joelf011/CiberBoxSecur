import api from './axiosConfig';

/**
 * Wrapper de utilizadores, perfil e fluxos de conta.
 * Centraliza chamadas de administração, ativação e recuperação de password.
 */
export const usersApi = {
  // Carrega utilizadores para a tabela administrativa.
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar utilizadores.');
    }
  },

  // Carrega cargos para seleção no formulário de utilizador.
  getRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar cargos.');
    }
  },

  // Cria utilizador através do fluxo de convite/ativação.
  createUser: async (userData) => {
    try {
      // O axios serializa JSON e o backend envia o e-mail de ativação.
      const response = await api.post('/auth/register', userData); 
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao criar utilizador.');
    }
  },

  // Atualiza utilizador a partir da gestão administrativa.
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao atualizar utilizador.');
    }
  },

  // Carrega perfil próprio sem expor a password.
  getMyProfile: async () => {
    const response = await api.get('/users/profile'); 
    return response.data;
  },

  // Atualiza perfil próprio, incluindo avatar ou password quando enviados.
  updateMyProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Elimina logicamente utilizador no backend.
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao eliminar utilizador.');
    }
  },

  // Ativa conta a partir do token recebido por e-mail.
  activateAccount: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/activate', { token, newPassword });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao ativar a conta.');
    }
  },

  // Reenvia convite de ativação para contas ainda não concluídas.
  resendActivation: async (userId) => {
    try {
      const response = await api.post('/auth/resend-activation', { id: userId });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao reenviar convite.');
    }
  },

  // Pede link de recuperação sem revelar se o e-mail existe.
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao pedir recuperação.');
    }
  },

  // Grava nova password depois de o backend validar o token.
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao alterar password.');
    }
  }
};
