import axios from 'axios';

// Create axios instance
const service = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Using backend port 3000
  timeout: 10000,
});

// Request interceptor
service.interceptors.request.use(
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
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
       // You can add global error handling here, like message.error() from antd
       if (error.response.status === 401) {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         if (window.location.pathname !== '/login') {
            window.location.href = '/login';
         }
       }
    }
    return Promise.reject(error);
  }
);

export default service;
