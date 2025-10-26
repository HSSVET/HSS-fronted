import apiClient from '../../../services/api';
import type { Document, DocumentCreateRequest, DocumentUpdateRequest, FileUploadResponse } from '../types/document';
import type { ApiResponse } from '../../../types/common';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class DocumentService {
  private baseUrl = '/api/documents';

  async getAllDocuments(page: number = 0, size: number = 10): Promise<PageResponse<Document>> {
    const response = await apiClient.get<PageResponse<Document>>(`${this.baseUrl}?page=${page}&size=${size}`);
    return response.data;
  }

  async getDocumentById(id: number): Promise<Document> {
    const response = await apiClient.get<Document>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getDocumentsByOwner(ownerId: number): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(`${this.baseUrl}/owner/${ownerId}`);
    return response.data;
  }

  async getDocumentsByAnimal(animalId: number): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(`${this.baseUrl}/animal/${animalId}`);
    return response.data;
  }

  async searchDocumentsByTitle(title: string): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(`${this.baseUrl}/search/title?title=${title}`);
    return response.data;
  }

  async createDocument(request: DocumentCreateRequest): Promise<Document> {
    const response = await apiClient.post<Document>(this.baseUrl, request);
    return response.data;
  }

  async updateDocument(id: number, request: DocumentUpdateRequest): Promise<Document> {
    const response = await apiClient.put<Document>(`${this.baseUrl}/${id}`, request);
    return response.data;
  }

  async deleteDocument(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async uploadFile(file: File, folder: string = 'documents'): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8090'}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async downloadFile(fileUrl: string): Promise<Blob> {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8090'}/api/files/download?filePath=${encodeURIComponent(fileUrl)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`File download failed: ${response.statusText}`);
    }

    return await response.blob();
  }

  async deleteFile(filePath: string): Promise<void> {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8090'}/api/files?filePath=${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`File delete failed: ${response.statusText}`);
    }
  }
}

export const documentService = new DocumentService();

