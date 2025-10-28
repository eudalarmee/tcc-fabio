import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  withCredentials: true, // Necessário para cookies/sessão
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token de autenticação automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('musclemax_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros com logs detalhados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detalhado para debug
    console.error('API Error:', {
      message: error?.message,
      code: error?.code,
      responseStatus: error?.response?.status,
      responseData: error?.response?.data,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        baseURL: error?.config?.baseURL,
      }
    });

    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('musclemax_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
