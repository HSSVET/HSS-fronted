import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';

export class StockService {
  static async getStock(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock`);
  }

  static async getStockById(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/${id}`);
  }

  static async createStockItem(item: any): Promise<ApiResponse<any>> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/stock`, item);
  }

  static async updateStockItem(id: string, updates: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${API_ENDPOINTS.DOCUMENTS}/stock/${id}`, updates);
  }

  static async deleteStockItem(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.DOCUMENTS}/stock/${id}`);
  }

  static async getStockReports(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/reports`);
  }

  static async getStockAlerts(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/alerts`);
  }

  static async getStockMovements(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/movements`);
  }

  static async createProduct(product: any): Promise<ApiResponse<any>> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/stock/products`, product);
  }

  static async getProducts(filters?: any): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (filters?.category) {
      params.append('category', filters.category);
    }
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/products${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.DOCUMENTS}/stock/products/${id}`);
  }

  static async getStockSettings(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/settings`);
  }

  static async updateStockSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put(`${API_ENDPOINTS.DOCUMENTS}/stock/settings`, settings);
  }

  static async recordMovement(movement: any): Promise<ApiResponse<any>> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/stock/movements`, movement);
  }

  static async getStockDashboard(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/dashboard`);
  }

  static async getAlerts(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/alerts`);
  }

  static async getMovements(): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/movements`);
  }

  static async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock/stats`);
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
