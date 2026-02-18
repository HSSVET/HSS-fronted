import { ApiResponse } from '../../../types/common';

export interface RadiologicalImaging {
  imageId: number;
  animalId: number;
  animalName?: string;
  date: string;
  type: string;
  imageUrl?: string;
  comment?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class RadiologicalImagingService {
  async getRadiologicalImagingsByAnimalId(animalId: number): Promise<ApiResponse<RadiologicalImaging[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<RadiologicalImaging[]>(`/api/animals/${animalId}/radiology`);
    return response;
  }

  async getRadiologicalImagingById(animalId: number, imageId: number): Promise<ApiResponse<RadiologicalImaging>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<RadiologicalImaging>(`/api/animals/${animalId}/radiology/${imageId}`);
    return response;
  }

  async createRadiologicalImaging(animalId: number, type: string, date: string, comment: string | undefined, imageFile: File | null): Promise<ApiResponse<RadiologicalImaging>> {
    const { apiClient } = await import('../../../services/api');
    
    const formData = new FormData();
    formData.append('type', type);
    formData.append('date', date);
    if (comment) {
      formData.append('comment', comment);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await apiClient.post<RadiologicalImaging>(`/api/animals/${animalId}/radiology`, formData);
    return response;
  }

  async deleteRadiologicalImaging(animalId: number, imageId: number): Promise<ApiResponse<void>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.delete<void>(`/api/animals/${animalId}/radiology/${imageId}`);
    return response;
  }
}

export const radiologicalImagingService = new RadiologicalImagingService();
export default radiologicalImagingService;
