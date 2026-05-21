import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const baseURL = error.config?.baseURL || '';
    const url = error.config?.url || 'unknown';
    const method = error.config?.method || 'unknown';
    const status = error.response?.status || 'NETWORK';
    const msg = error.response?.data?.message || error.message;
    console.error(`[${method.toUpperCase()} ${baseURL}${url}] ${status}: ${msg}`);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
