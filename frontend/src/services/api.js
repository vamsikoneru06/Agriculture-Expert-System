import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

/* Attach JWT token to every request */
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('agri_user') || '{}');
    if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch (_) {}
  return config;
});

/* Global error handler */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('agri_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/* ── Auth ── */
export const authAPI = {
  login:    (data) => api.post('/auth/login',    data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
};

/* ── Expert System ── */
export const expertAPI = {
  predict:    (data) => api.post('/expert/predict', data),
  getRules:   ()     => api.get('/expert/rules'),
  addRule:    (data) => api.post('/expert/rules', data),
  updateRule: (id, data) => api.put(`/expert/rules/${id}`, data),
  deleteRule: (id)   => api.delete(`/expert/rules/${id}`),
};

/* ── Simulation ── */
export const simulationAPI = {
  run:        (params) => api.post('/simulation/run', params),
  getHistory: ()       => api.get('/simulation/history'),
};

/* ── ML Model ── */
export const mlAPI = {
  predict:   (data) => api.post('/ml/predict', data),
  getModels: ()     => api.get('/ml/models'),
};

/* ── Predictions History ── */
export const historyAPI = {
  getAll:   (params) => api.get('/predictions', { params }),
  getById:  (id)     => api.get(`/predictions/${id}`),
  delete:   (id)     => api.delete(`/predictions/${id}`),
  export:   ()       => api.get('/predictions/export', { responseType: 'blob' }),
};

/* ── Admin ── */
export const adminAPI = {
  getUsers:   () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id)       => api.delete(`/admin/users/${id}`),
  getStats:   () => api.get('/admin/stats'),
};

export default api;
