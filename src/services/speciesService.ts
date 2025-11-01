import type { ApiResponse } from '../types/common';
import { apiClient } from './api';

export interface Species {
  speciesId: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export class SpeciesService {
  async getAllSpecies(): Promise<ApiResponse<Species[]>> {
    const response = await apiClient.get<Species[]>('/api/species/all');
    return response;
  }

  async getSpeciesById(id: number): Promise<ApiResponse<Species>> {
    const response = await apiClient.get<Species>(`/api/species/${id}`);
    return response;
  }
}

export const speciesService = new SpeciesService();
export default SpeciesService;

