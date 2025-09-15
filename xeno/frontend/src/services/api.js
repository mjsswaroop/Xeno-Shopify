import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API service functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const dashboardAPI = {
  getMetrics: (params) => api.get('/dashboard/metrics', { params }),
  getRevenueAnalytics: (params) => api.get('/dashboard/analytics/revenue', { params }),
};

export const shopifyAPI = {
  connectStore: (data) => api.post('/shopify/connect', data),
  syncData: () => api.post('/shopify/sync'),
  getConnectionStatus: () => api.get('/shopify/status'),
};

export const tenantAPI = {
  getInfo: () => api.get('/tenant/info'),
  updateSettings: (settings) => api.put('/tenant/settings', settings),
  getStats: () => api.get('/tenant/stats'),
};