import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';

export class StockService {
  static async getStock(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}`);
  }

  static async getStockById(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/${id}`);
  }

  static async createStockItem(item: any): Promise<ApiResponse<any>> {
    return apiClient.post(`${API_ENDPOINTS.STOCK}`, item);
  }

  static async updateStockItem(id: string, updates: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${API_ENDPOINTS.STOCK}/${id}`, updates);
  }

  static async deleteStockItem(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.STOCK}/${id}`);
  }

  static async getStockReports(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/reports`); // Note: Backend may not have this specific endpoint yet, need to verify
  }

  static async getStockAlerts(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/alerts`);
  }

  static async getStockMovements(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/movements`);
  }

  static async createProduct(product: any): Promise<ApiResponse<any>> {
    return apiClient.post(`${API_ENDPOINTS.STOCK}`, product); // Assuming product creation is same as stock item
  }

  static async getProducts(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();

    if (filters?.category) {
      params.append('category', filters.category);
    }

    if (filters?.status) {
      params.append('status', filters.status);
    }
    // Backend controller maps to /api/stock for getAllProducts
    return apiClient.get(`${API_ENDPOINTS.STOCK}${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.STOCK}/${id}`);
  }

  static async getStockSettings(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/settings`);
  }

  static async updateStockSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${API_ENDPOINTS.STOCK}/settings`, settings);
  }

  static async recordMovement(movement: any): Promise<ApiResponse<any>> {
    return apiClient.post(`${API_ENDPOINTS.STOCK}/movements`, movement);
  }

  static async getStockDashboard(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/dashboard`);
  }

  static async getAlerts(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/alerts`);
  }

  static async getMovements(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/movements`);
  }

  static async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.STOCK}/stats`);
  }
}

// Legacy export for backward compatibility
export const stockService = {
  getStock: StockService.getStock,
  getStockById: StockService.getStockById,
  createStockItem: StockService.createStockItem,
  updateStockItem: StockService.updateStockItem,
  deleteStockItem: StockService.deleteStockItem,
  getStockReports: StockService.getStockReports,
  getStockAlerts: StockService.getStockAlerts,
  getStockMovements: StockService.getStockMovements,
  createProduct: StockService.createProduct,
  getProducts: StockService.getProducts,
  deleteProduct: StockService.deleteProduct,
  getStockSettings: StockService.getStockSettings,
  updateStockSettings: StockService.updateStockSettings,
  recordMovement: StockService.recordMovement,
  getStockDashboard: StockService.getStockDashboard,
  getAlerts: StockService.getAlerts,
  getMovements: StockService.getMovements,
  getStats: StockService.getStats,
  getSettings: StockService.getStockSettings,
  updateSettings: StockService.updateStockSettings,
};

// Note: All mock functions have been replaced with API calls
