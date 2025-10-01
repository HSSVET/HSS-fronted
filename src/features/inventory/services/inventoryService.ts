import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import { InventoryItem, Medicine, Supply, StockMovement, InventoryFilter, InventoryStats } from '../types/inventory';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';

export class InventoryService {
  // Inventory Items
  static async getInventoryItems(filter?: InventoryFilter): Promise<ApiResponse<InventoryItem[]>> {
    const params = new URLSearchParams();
    
    if (filter?.category) {
      params.append('category', filter.category);
    }
    
    if (filter?.status) {
      params.append('status', filter.status);
    }
    
    if (filter?.supplier) {
      params.append('supplier', filter.supplier);
    }
    
    if (filter?.search) {
      params.append('search', filter.search);
    }

    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async getInventoryItemById(id: string): Promise<ApiResponse<InventoryItem>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory/${id}`);
  }

  static async addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<InventoryItem>> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/inventory`, item);
  }

  static async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> {
    return apiClient.put(`${API_ENDPOINTS.DOCUMENTS}/inventory/${id}`, updates);
  }

  static async deleteInventoryItem(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.DOCUMENTS}/inventory/${id}`);
  }

  // Medicines
  static async getMedicines(filter?: InventoryFilter): Promise<ApiResponse<Medicine[]>> {
    const params = new URLSearchParams();
    
    if (filter?.category) {
      params.append('category', filter.category);
    }
    
    if (filter?.status) {
      params.append('status', filter.status);
    }
    
    if (filter?.search) {
      params.append('search', filter.search);
    }

    return apiClient.get(`${API_ENDPOINTS.MEDICATIONS}${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async getMedicineById(id: string): Promise<ApiResponse<Medicine>> {
    return apiClient.get(`${API_ENDPOINTS.MEDICATIONS}/${id}`);
  }

  static async addMedicine(medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Medicine>> {
    return apiClient.post(API_ENDPOINTS.MEDICATIONS, medicine);
  }

  static async updateMedicine(id: string, updates: Partial<Medicine>): Promise<ApiResponse<Medicine>> {
    return apiClient.put(`${API_ENDPOINTS.MEDICATIONS}/${id}`, updates);
  }

  static async deleteMedicine(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.MEDICATIONS}/${id}`);
  }

  // Supplies
  static async getSupplies(filter?: InventoryFilter): Promise<ApiResponse<Supply[]>> {
    const params = new URLSearchParams();
    
    if (filter?.category) {
      params.append('category', filter.category);
    }
    
    if (filter?.status) {
      params.append('status', filter.status);
    }
    
    if (filter?.supplier) {
      params.append('supplier', filter.supplier);
    }
    
    if (filter?.search) {
      params.append('search', filter.search);
    }

    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/supplies${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async addSupply(supply: Omit<Supply, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Supply>> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/supplies`, supply);
  }

  static async updateSupply(id: string, updates: Partial<Supply>): Promise<ApiResponse<Supply>> {
    return apiClient.put(`${API_ENDPOINTS.DOCUMENTS}/supplies/${id}`, updates);
  }

  static async deleteSupply(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.DOCUMENTS}/supplies/${id}`);
  }

  // Stock Movements
  static async getStockMovements(itemId?: string): Promise<ApiResponse<StockMovement[]>> {
    const params = new URLSearchParams();
    
    if (itemId) {
      params.append('itemId', itemId);
    }

    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock-movements${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async addStockMovement(movement: Omit<StockMovement, 'id'>): Promise<ApiResponse<StockMovement>> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/stock-movements`, movement);
  }

  static async getStockMovementsByItem(itemId: string): Promise<ApiResponse<StockMovement[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/stock-movements/item/${itemId}`);
  }

  // Statistics
  static async getInventoryStats(): Promise<ApiResponse<InventoryStats>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory/statistics`);
  }

  // Search and Filter
  static async searchInventory(query: string): Promise<ApiResponse<InventoryItem[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory/search?q=${encodeURIComponent(query)}`);
  }

  // Low Stock Alert
  static async getLowStockItems(threshold: number = 10): Promise<ApiResponse<InventoryItem[]>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory/low-stock?threshold=${threshold}`);
  }

  // Expiring Soon
  static async getExpiringSoonItems(days: number = 30): Promise<ApiResponse<Medicine[]>> {
    return apiClient.get(`${API_ENDPOINTS.MEDICATIONS}/expiring-soon?days=${days}`);
  }

  // Batch operations
  static async updateStockQuantities(updates: Array<{id: string; quantity: number}>): Promise<ApiResponse<void>> {
    return apiClient.patch(`${API_ENDPOINTS.DOCUMENTS}/inventory/batch-update`, { updates });
  }

  // Reports
  static async getInventoryReport(startDate: Date, endDate: Date): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory/reports?${params.toString()}`);
  }

  static async getUsageReport(itemId: string, period: string): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.DOCUMENTS}/inventory/${itemId}/usage-report?period=${period}`);
  }
}