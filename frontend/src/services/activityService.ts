import api from './api';
import { Activity, PaginatedResponse } from '../types';

interface ActivityFilters {
  page?: number;
  limit?: number;
  түрі?: string;
  статус?: string;
  іздеу?: string;
}

export const activityService = {
  async getActivities(filters?: ActivityFilters): Promise<PaginatedResponse<Activity>> {
    const response = await api.get<PaginatedResponse<Activity>>('/activities', { params: filters });
    return response.data;
  },

  async getActivityById(id: string): Promise<Activity> {
    const response = await api.get<Activity>(`/activities/${id}`);
    return response.data;
  },

  async createActivity(data: Omit<Activity, '_id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
    const response = await api.post<Activity>('/activities', data);
    return response.data;
  },

  async updateActivity(id: string, data: Partial<Activity>): Promise<Activity> {
    const response = await api.put<Activity>(`/activities/${id}`, data);
    return response.data;
  },

  async deleteActivity(id: string): Promise<void> {
    await api.delete(`/activities/${id}`);
  },
};
