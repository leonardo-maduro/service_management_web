import axios from 'axios';
import { getAuthToken } from './auth';

// Configuração base para todas as instâncias do axios
const createApiClient = (baseURL) => {
  const apiClient = axios.create({
    baseURL,
    timeout: 10000, // Timeout de 10 segundos
  });

  // Interceptor para adicionar o token de autenticação automaticamente
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratar respostas e gerenciar erros de autenticação
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido, limpar dados de autenticação
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        // Redirecionar para login apenas se não estivermos já na página de login
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// Instâncias pré-configuradas para diferentes módulos
export const clientsApi = createApiClient(`${API_BASE_URL}/clients`);
export const usersApi = createApiClient(`${API_BASE_URL}/users`);
export const authApi = createApiClient(`${API_BASE_URL}/auth`);
export const materialsApi = createApiClient(`${API_BASE_URL}/materials`);

// Função para criar instâncias customizadas
export default createApiClient;
