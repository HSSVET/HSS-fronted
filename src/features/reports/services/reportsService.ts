import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export class ReportsService {
  static async getAnimalReports(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }

    return apiClient.get(`${API_ENDPOINTS.ANIMALS}/reports${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async getAppointmentReports(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }

    return apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/reports${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async getFinancialReports(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }

    return apiClient.get(`${API_ENDPOINTS.INVOICES}/reports${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async getInventoryReports(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (filters?.category) {
      params.append('category', filters.category);
    }

    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory/reports${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async getCustomReport(reportType: string, filters?: any): Promise<ApiResponse<any>> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/reports/custom`, {
      reportType,
      filters
    });
  }

  static async exportReport(reportId: string, format: 'pdf' | 'excel'): Promise<ApiResponse<Blob>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/reports/${reportId}/export?format=${format}`);
  }
}