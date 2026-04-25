import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  retry: 2, 
  retryDelay: 1000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !config.retry || config.retry === 0) {
      return Promise.reject(error);
    }
    config.retry -= 1;
    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
    return api(config);
  }
);

export default api;