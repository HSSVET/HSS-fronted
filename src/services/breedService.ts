import type { ApiResponse } from '../types/common';
import { apiClient } from './api';

export interface Breed {
  breedId: number;
  speciesId: number;
  speciesName?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export class BreedService {
  async getBreedsBySpeciesId(speciesId: number): Promise<ApiResponse<Breed[]>> {
    const response = await apiClient.get<Breed[]>(`/api/breeds/species/${speciesId}`);
    return response;
  }

  async getAllBreeds(): Promise<ApiResponse<Breed[]>> {
    // Backend'de getAllBreeds pagination ile döner, tüm listeyi almak için büyük bir limit kullanabiliriz
    const response = await apiClient.get<any>(`/api/breeds?page=0&size=1000`);
    if (response.success && response.data?.content) {
      return {
        ...response,
        data: response.data.content,
      };
    }
    return response;
  }

  async getBreedById(id: number): Promise<ApiResponse<Breed>> {
    const response = await apiClient.get<Breed>(`/api/breeds/${id}`);
    return response;
  }
}

export const breedService = new BreedService();
export default BreedService;

