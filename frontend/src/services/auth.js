import axios from 'axios';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  async login(credentials) {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    return response.data;
  },

  async signup(userData) {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    return response.data;
  },

  async profile() {
    const response = await axios.get(`${API_URL}/api/auth/profile`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  getStoredToken() {
    return localStorage.getItem('access_token');
  },

  setStoredToken(token) {
    localStorage.setItem('access_token', token);
  },

  removeStoredToken() {
    localStorage.removeItem('access_token');
  },

  getAuthHeaders() {
    const token = this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
