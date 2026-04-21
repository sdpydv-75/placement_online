import axios from 'axios';

// Create instance dynamically pointing towards active deployment node
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://placement-online.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to inject JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
