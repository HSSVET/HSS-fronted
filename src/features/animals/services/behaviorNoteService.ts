import { ApiResponse } from '../../../types/common';

export interface BehaviorNote {
  behaviorNoteId: number;
  animalId: number;
  animalName?: string;
  clinicId: number;
  category?: 'AGGRESSION' | 'ANXIETY' | 'FEEDING' | 'SOCIAL' | 'TRAINING' | 'OTHER';
  title: string;
  description: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  observedDate: string;
  observedBy?: string;
  recommendations?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BehaviorNoteCreateRequest {
  animalId: number;
  category?: BehaviorNote['category'];
  title: string;
  description: string;
  severity?: BehaviorNote['severity'];
  observedDate: string;
  observedBy?: string;
  recommendations?: string;
}

export interface BehaviorNoteUpdateRequest {
  category?: BehaviorNote['category'];
  title?: string;
  description?: string;
  severity?: BehaviorNote['severity'];
  observedDate?: string;
  observedBy?: string;
  recommendations?: string;
}

export class BehaviorNoteService {
  async getBehaviorNotesByAnimalId(animalId: number): Promise<ApiResponse<BehaviorNote[]>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<BehaviorNote[]>(`/api/animals/${animalId}/behavior-notes`);
    return response;
  }

  async getBehaviorNoteById(animalId: number, noteId: number): Promise<ApiResponse<BehaviorNote>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.get<BehaviorNote>(`/api/animals/${animalId}/behavior-notes/${noteId}`);
    return response;
  }

  async createBehaviorNote(request: BehaviorNoteCreateRequest): Promise<ApiResponse<BehaviorNote>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.post<BehaviorNote>(`/api/animals/${request.animalId}/behavior-notes`, request);
    return response;
  }

  async updateBehaviorNote(animalId: number, noteId: number, request: BehaviorNoteUpdateRequest): Promise<ApiResponse<BehaviorNote>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.put<BehaviorNote>(`/api/animals/${animalId}/behavior-notes/${noteId}`, request);
    return response;
  }

  async deleteBehaviorNote(animalId: number, noteId: number): Promise<ApiResponse<void>> {
    const { apiClient } = await import('../../../services/api');
    const response = await apiClient.delete<void>(`/api/animals/${animalId}/behavior-notes/${noteId}`);
    return response;
  }
}

export const behaviorNoteService = new BehaviorNoteService();
export default behaviorNoteService;
