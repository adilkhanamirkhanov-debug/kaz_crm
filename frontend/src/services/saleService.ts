import api from './api';
import { Sale, PaginatedResponse } from '../types';

interface SaleFilters {
  page?: number;
  limit?: number;
  статус?: string;
  іздеу?: string;
}

export const saleService = {
  async getSales(filters?: SaleFilters): Promise<PaginatedResponse<Sale>> {
    const response = await api.get<PaginatedResponse<Sale>>('/sales', { params: filters });
    return response.data;
  },

  async getSaleById(id: string): Promise<Sale> {
    const response = await api.get<Sale>(`/sales/${id}`);
    return response.data;
  },

  async createSale(data: Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>): Promise<Sale> {
    const response = await api.post<Sale>('/sales', data);
    return response.data;
  },

  async updateSale(id: string, data: Partial<Sale>): Promise<Sale> {
    const response = await api.put<Sale>(`/sales/${id}`, data);
    return response.data;
  },

  async deleteSale(id: string): Promise<void> {
    await api.delete(`/sales/${id}`);
  },

  async getSalesPipeline(): Promise<Record<string, Sale[]>> {
    const response = await api.get<Record<string, Sale[]>>('/sales/pipeline');
    return response.data;
  },
};
