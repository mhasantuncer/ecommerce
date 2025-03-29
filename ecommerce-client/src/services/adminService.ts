// src/services/adminService.ts
import axios from 'axios';
import { ILoginResponse } from '../models/IAuth';

const API_URL = 'http://localhost:3000/auth'; // ✅ Fixed API Base URL
console.log('API Base URL:', API_URL);

// Initialize axios instance
const api = axios.create({
  baseURL: API_URL, // ✅ Now all requests use /auth as the base path
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('admin_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('admin_token');
  }
};

// Initialize token from storage
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('admin_token');
  if (storedToken) setAuthToken(storedToken);
}

export const authService = {
  login: async (
    username: string,
    password: string
  ): Promise<ILoginResponse> => {
    console.log('Attempting to reach:', `${API_URL}/login`); // Debug line

    try {
      const response = await api.post('/login', { username, password }); // ✅ Fixed path
      console.log('Login successful:', response.data); // Debug line
      return response.data;
    } catch (error) {
      console.error('Full error details:', {
        config: error.config,
        request: error.request,
        response: error.response?.data,
      });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/clear-token'); // ✅ Fixed path
      setAuthToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshToken: async (): Promise<ILoginResponse> => {
    try {
      const response = await api.post<ILoginResponse>('/refresh-token'); // ✅ Fixed path
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      setAuthToken(null); // Clear token if refresh fails
      throw error;
    }
  },

  getCurrentToken: (): string | null => {
    return authToken;
  },
};
