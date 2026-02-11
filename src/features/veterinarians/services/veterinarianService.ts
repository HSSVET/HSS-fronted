import { apiClient } from '../../../services/api';
import type { ApiResponse } from '../../../types/common';

export interface VeterinarianRecord {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
}

export class VeterinarianService {
  static async getActiveVeterinarians(): Promise<ApiResponse<VeterinarianRecord[]>> {
    try {
      // Veterinerler staff olarak tutulduğu için /api/staff/active endpoint'ini kullanıyoruz
      const response = await apiClient.get<any[]>('/api/staff/active');
      
      if (response.success && Array.isArray(response.data)) {
        // Staff verilerini VeterinarianRecord formatına dönüştür
        const veterinarians: VeterinarianRecord[] = response.data.map((staff: any) => ({
          id: staff.id,
          fullName: staff.fullName || staff.name || 'İsimsiz',
          phone: staff.phone,
          email: staff.email,
        }));
        
        return { 
          success: true, 
          data: veterinarians,
          status: response.status 
        };
      }
      
      return { 
        success: false, 
        data: [], 
        error: response.error || 'Veteriner listesi alınamadı',
        status: response.status 
      };
    } catch (error) {
      console.error('Veteriner listesi alınırken hata:', error);
      return { 
        success: false, 
        data: [], 
        error: 'Veteriner listesi alınırken bir hata oluştu' 
      };
    }
  }
}

export default VeterinarianService;
