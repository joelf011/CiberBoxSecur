import axios from 'axios';

/**
 * Instância central do axios partilhada por todos os módulos da camada API.
 * Configura o URL base do backend e injeta automaticamente o token JWT em cada pedido.
 *
 * Fluxo:
 * Chamada API (ex.: usersApi.getUsers) -> Interceptor adiciona token -> Pedido HTTP ao backend.
 */

// URL base configurável por variável de ambiente; fallback para localhost em desenvolvimento.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de pedidos: anexa o token Bearer do localStorage às chamadas autenticadas.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
