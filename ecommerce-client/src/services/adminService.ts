import axios from 'axios';
import { ILoginResponse } from '../models/IAuth';

const API_URL = 'http://localhost:3000/auth';
console.log('API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('admin_token');
  if (storedToken) setAuthToken(storedToken);
}

export const authService = {
  login: async (
    username: string,
    password: string
  ): Promise<ILoginResponse> => {
    console.log('Attempting to reach:', `${API_URL}/login`);

    try {
      const response = await api.post('/login', { username, password });
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Token refresh error:',
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error('Token refresh error:', error.message);
      } else {
        console.error('Token refresh error: An unexpected error occurred');
      }
      setAuthToken(null);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/clear-token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshToken: async (): Promise<ILoginResponse> => {
    try {
      const response = await api.post<ILoginResponse>('/refresh-token');
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      setAuthToken(null);
      throw error;
    }
  },

  getCurrentToken: (): string | null => {
    return authToken;
  },
};
