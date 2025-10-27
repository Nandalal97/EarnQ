// src/utils/axios.js
import axios from 'axios';
const API = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://api.earnq.in/api',
  withCredentials: true,
});
// Add a response interceptor to handle auto-logout
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default API;
