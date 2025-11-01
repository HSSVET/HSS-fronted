import type { ApiResponse, PaginatedResponse, SpringPage } from '../types/common';
import { apiClient } from './api';

export interface Owner {
  ownerId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerCreateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
}

const normalizeSpringPage = <T>(page: SpringPage<T>): PaginatedResponse<T> => ({
  items: page.content,
  total: page.totalElements,
  page: page.number,
  limit: page.size,
  totalPages: page.totalPages,
});

const emptyPage = <T>(page: number, limit: number): PaginatedResponse<Owner> => ({
  items: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

export class OwnerService {
  async getAllOwners(page: number = 0, limit: number = 100): Promise<ApiResponse<PaginatedResponse<Owner>>> {
    const response = await apiClient.get<SpringPage<Owner>>(`/api/owners?page=${page}&size=${limit}`);
    
    if (response.success && response.data) {
      const paginatedResponse: PaginatedResponse<Owner> = normalizeSpringPage(response.data);
      return { success: true, data: paginatedResponse };
    }
    
    return {
      success: false,
      data: emptyPage(page, limit),
      error: response.error || 'Failed to fetch owners',
      status: response.status,
    };
  }

  async getOwnerById(id: number): Promise<ApiResponse<Owner>> {
    const response = await apiClient.get<Owner>(`/api/owners/${id}`);
    return response;
  }

  async createOwner(request: OwnerCreateRequest): Promise<ApiResponse<Owner>> {
    const response = await apiClient.post<Owner>('/api/owners', request);
    return response;
  }

  async searchOwnersByName(name: string): Promise<ApiResponse<Owner[]>> {
    const response = await apiClient.get<Owner[]>(`/api/owners/search/name?name=${encodeURIComponent(name)}`);
    return response;
  }

  async updateOwner(id: number, request: Partial<OwnerCreateRequest>): Promise<ApiResponse<Owner>> {
    const response = await apiClient.put<Owner>(`/api/owners/${id}`, request);
    return response;
  }

  async deleteOwner(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`/api/owners/${id}`);
    return response;
  }
}

export const ownerService = new OwnerService();
export default OwnerService;

