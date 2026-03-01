import axios from 'axios';

// ================= BASE URL =================
const BASE_URL = import.meta.env.VITE_API_URL;

// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      const method = (config.method || 'GET').toUpperCase();
      console.log(`[API] → ${method} ${BASE_URL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API] ← ${response.status} ${response.config.url}`,
        response.data
      );
    }

    return response.data;
  },
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: `Network Error: Unable to reach ${BASE_URL}`,
      });
    }

    return Promise.reject(
      error.response.data || { message: 'Request failed' }
    );
  }
);

export default api;
