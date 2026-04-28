import api from './api';
import { Client, PaginatedResponse } from '../types';

interface ClientFilters {
  page?: number;
  limit?: number;
  статус?: string;
  іздеу?: string;
}

export const clientService = {
  async getClients(filters?: ClientFilters): Promise<PaginatedResponse<Client>> {
    const response = await api.get<PaginatedResponse<Client>>('/clients', { params: filters });
    return response.data;
  },

  async getClientById(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async createClient(data: Omit<Client, '_id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  async deleteClient(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};
