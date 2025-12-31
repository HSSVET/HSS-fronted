import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export type StockAlertType = 'LOW_STOCK' | 'CRITICAL_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';

export interface StockAlert {
  alertId: number;
  productId: number;
  productName: string;
  productBarcode?: string;
  alertType: StockAlertType;
  currentStock: number;
  thresholdValue?: number;
  minStock?: number;
  maxStock?: number;
  expirationDate?: string;
  message: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export class StockAlertService {
  static async getActiveAlerts(): Promise<ApiResponse<StockAlert[]>> {
    return apiClient.get<StockAlert[]>(API_ENDPOINTS.STOCK_ALERTS);
  }

  static async getAlertsByType(alertType: StockAlertType): Promise<ApiResponse<StockAlert[]>> {
    return apiClient.get<StockAlert[]>(`${API_ENDPOINTS.STOCK_ALERTS}/type/${alertType}`);
  }

  static async getAlertsByProductId(productId: number): Promise<ApiResponse<StockAlert[]>> {
    return apiClient.get<StockAlert[]>(`${API_ENDPOINTS.STOCK_ALERTS}/product/${productId}`);
  }

  static async resolveAlert(alertId: number, resolvedBy?: string): Promise<ApiResponse<void>> {
    const params = resolvedBy ? `?resolvedBy=${encodeURIComponent(resolvedBy)}` : '';
    return apiClient.post<void>(`${API_ENDPOINTS.STOCK_ALERTS}/${alertId}/resolve${params}`);
  }

  static async resolveAlertsByProductId(productId: number, resolvedBy?: string): Promise<ApiResponse<void>> {
    const params = resolvedBy ? `?resolvedBy=${encodeURIComponent(resolvedBy)}` : '';
    return apiClient.post<void>(`${API_ENDPOINTS.STOCK_ALERTS}/product/${productId}/resolve${params}`);
  }

  static async checkStockAlerts(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.STOCK_ALERTS}/check`);
  }
}

export const stockAlertService = new StockAlertService();

