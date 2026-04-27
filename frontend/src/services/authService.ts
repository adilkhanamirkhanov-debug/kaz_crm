import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async login(эл_пошта: string, құпия_сөз: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { эл_пошта, құпия_сөз });
    return response.data;
  },

  async register(аты: string, эл_пошта: string, құпия_сөз: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', { аты, эл_пошта, құпия_сөз });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User> & { құпия_сөз?: string }): Promise<User> {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
};
