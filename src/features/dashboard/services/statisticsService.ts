import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export interface DashboardStatistics {
  totalAnimals: number;
  totalOwners: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  lowStockItems: number;
  outOfStockItems: number;
  upcomingVaccinations: number;
  overdueVaccinations: number;
  appointmentsByStatus: Record<string, number>;
  animalsBySpecies: Record<string, number>;
  revenueByMonth: Record<string, number>;
}

export interface FinancialStatistics {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceAmount: number;
  totalTaxAmount: number;
  revenueByMonth: Record<string, number>;
  invoicesByStatus: Record<string, number>;
  topCustomers: Array<{
    ownerId: number;
    firstName: string;
    lastName: string;
    invoiceCount: number;
    totalAmount: number;
  }>;
}

export interface MedicalStatistics {
  startDate: string;
  endDate: string;
  totalAnimals: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalVaccinations: number;
  upcomingVaccinations: number;
  overdueVaccinations: number;
  animalsBySpecies: Record<string, number>;
  animalsByBreed: Record<string, number>;
  appointmentsByType: Record<string, number>;
  mostCommonTreatments: Array<Record<string, any>>;
  vaccinationsByType: Record<string, number>;
}

export class StatisticsService {
  static async getDashboardStatistics(): Promise<ApiResponse<DashboardStatistics>> {
    return apiClient.get<DashboardStatistics>(`${API_ENDPOINTS.STATISTICS}/dashboard`);
  }

  static async getFinancialStatistics(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<FinancialStatistics>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    return apiClient.get<FinancialStatistics>(
      `${API_ENDPOINTS.STATISTICS}/financial${queryString ? '?' + queryString : ''}`
    );
  }

  static async getMedicalStatistics(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<MedicalStatistics>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    return apiClient.get<MedicalStatistics>(
      `${API_ENDPOINTS.STATISTICS}/medical${queryString ? '?' + queryString : ''}`
    );
  }
}

export const statisticsService = new StatisticsService();

