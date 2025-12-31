import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export type BackupType = 'FULL' | 'INCREMENTAL' | 'DATABASE' | 'FILES';
export type BackupStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'DELETED';

export interface BackupRecord {
  backupId: number;
  backupType: BackupType;
  backupName: string;
  filePath?: string;
  fileSize?: number;
  status: BackupStatus;
  backupDate: string;
  completedAt?: string;
  verified: boolean;
  verificationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class BackupService {
  static async createFullBackup(): Promise<ApiResponse<BackupRecord>> {
    return apiClient.post<BackupRecord>(`${API_ENDPOINTS.BACKUPS}/full`);
  }

  static async createDatabaseBackup(): Promise<ApiResponse<BackupRecord>> {
    return apiClient.post<BackupRecord>(`${API_ENDPOINTS.BACKUPS}/database`);
  }

  static async createFilesBackup(): Promise<ApiResponse<BackupRecord>> {
    return apiClient.post<BackupRecord>(`${API_ENDPOINTS.BACKUPS}/files`);
  }

  static async getAllBackups(): Promise<ApiResponse<BackupRecord[]>> {
    return apiClient.get<BackupRecord[]>(API_ENDPOINTS.BACKUPS);
  }

  static async getCompletedBackups(): Promise<ApiResponse<BackupRecord[]>> {
    return apiClient.get<BackupRecord[]>(`${API_ENDPOINTS.BACKUPS}/completed`);
  }

  static async getBackupById(id: number): Promise<ApiResponse<BackupRecord>> {
    return apiClient.get<BackupRecord>(`${API_ENDPOINTS.BACKUPS}/${id}`);
  }

  static async deleteBackup(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_ENDPOINTS.BACKUPS}/${id}`);
  }

  static async restoreBackup(id: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.BACKUPS}/${id}/restore`);
  }
}

export const backupService = new BackupService();

