import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import { Invoice, Payment, PaymentPlan, Service, BillingStatsData, InvoiceFilters, PaymentFilters, POSTerminal, CardInfo } from '../types';
import type { ApiResponse, PaginatedResponse } from '../../../types/common';

export class BillingService {
  // Invoice operations
  static async getInvoices(filters?: InvoiceFilters): Promise<ApiResponse<Invoice[]>> {
    const params = new URLSearchParams();
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }

    return apiClient.get(`${API_ENDPOINTS.INVOICES}${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async getInvoiceById(id: number): Promise<ApiResponse<Invoice>> {
    return apiClient.get(`${API_ENDPOINTS.INVOICES}/${id}`);
  }

  static async createInvoice(invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Invoice>> {
    return apiClient.post(API_ENDPOINTS.INVOICES, invoiceData);
  }

  static async updateInvoice(id: number, updates: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return apiClient.put(`${API_ENDPOINTS.INVOICES}/${id}`, updates);
  }

  static async deleteInvoice(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.INVOICES}/${id}`);
  }

  // Payment operations
  static async getPayments(filters?: PaymentFilters): Promise<ApiResponse<Payment[]>> {
    const params = new URLSearchParams();
    
    if (filters?.paymentMethod) {
      params.append('paymentMethod', filters.paymentMethod);
    }
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    if (filters?.posTerminalId) {
      params.append('posTerminalId', filters.posTerminalId);
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }

    return apiClient.get(`${API_ENDPOINTS.INVOICES}/payments${params.toString() ? '?' + params.toString() : ''}`);
  }

  static async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'transactionNumber'>): Promise<ApiResponse<Payment>> {
    return apiClient.post(`${API_ENDPOINTS.INVOICES}/payments`, paymentData);
  }

  // POS Terminal operations
  static async getPOSTerminals(): Promise<ApiResponse<POSTerminal[]>> {
    return apiClient.get(`${API_ENDPOINTS.INVOICES}/pos-terminals`);
  }

  // Process card payment simulation
  static async processCardPayment(amount: number, posTerminalId: string, cardType: string): Promise<ApiResponse<{
    success: boolean;
    authorizationCode?: string;
    batchNumber?: string;
    errorMessage?: string;
  }>> {
    return apiClient.post(`${API_ENDPOINTS.INVOICES}/process-payment`, {
      amount,
      posTerminalId,
      cardType
    });
  }

  // Service operations (for creating invoices)
  static async getServices(): Promise<ApiResponse<Service[]>> {
    return apiClient.get(`${API_ENDPOINTS.INVOICES}/services`);
  }

  static async createService(serviceData: Omit<Service, 'id'>): Promise<ApiResponse<Service>> {
    return apiClient.post(`${API_ENDPOINTS.INVOICES}/services`, serviceData);
  }

  // Statistics
  static async getBillingStats(): Promise<ApiResponse<BillingStatsData>> {
    return apiClient.get(`${API_ENDPOINTS.INVOICES}/statistics`);
  }

  // Payment plans
  static async getPaymentPlans(invoiceId?: number): Promise<ApiResponse<PaymentPlan[]>> {
    const endpoint = invoiceId 
      ? `${API_ENDPOINTS.INVOICES}/${invoiceId}/payment-plans`
      : `${API_ENDPOINTS.INVOICES}/payment-plans`;
    
    return apiClient.get(endpoint);
  }

  static async createPaymentPlan(paymentPlanData: Omit<PaymentPlan, 'id' | 'createdAt'>): Promise<ApiResponse<PaymentPlan>> {
    return apiClient.post(`${API_ENDPOINTS.INVOICES}/payment-plans`, paymentPlanData);
  }

  static async updatePaymentPlan(id: number, updates: Partial<PaymentPlan>): Promise<ApiResponse<PaymentPlan>> {
    return apiClient.put(`${API_ENDPOINTS.INVOICES}/payment-plans/${id}`, updates);
  }

  // Invoice status operations
  static async markInvoiceAsPaid(id: number): Promise<ApiResponse<Invoice>> {
    return apiClient.patch(`${API_ENDPOINTS.INVOICES}/${id}/mark-paid`);
  }

  static async markInvoiceAsOverdue(id: number): Promise<ApiResponse<Invoice>> {
    return apiClient.patch(`${API_ENDPOINTS.INVOICES}/${id}/mark-overdue`);
  }

  static async sendInvoice(id: number, recipientEmail?: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${API_ENDPOINTS.INVOICES}/${id}/send`, { recipientEmail });
  }

  // Reports
  static async getMonthlyReport(year: number, month: number): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.INVOICES}/reports/monthly?year=${year}&month=${month}`);
  }

  static async getYearlyReport(year: number): Promise<ApiResponse<any>> {
    return apiClient.get(`${API_ENDPOINTS.INVOICES}/reports/yearly?year=${year}`);
  }

  static async getCustomReport(startDate: Date, endDate: Date): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    return apiClient.get(`${API_ENDPOINTS.INVOICES}/reports/custom?${params.toString()}`);
  }
}

// Legacy export for backward compatibility
export const billingService = {
  getInvoices: BillingService.getInvoices,
  getInvoiceById: BillingService.getInvoiceById,
  createInvoice: BillingService.createInvoice,
  updateInvoice: BillingService.updateInvoice,
  deleteInvoice: BillingService.deleteInvoice,
  getPayments: BillingService.getPayments,
  createPayment: BillingService.createPayment,
  getPOSTerminals: BillingService.getPOSTerminals,
  processCardPayment: BillingService.processCardPayment,
  getServices: BillingService.getServices,
  createService: BillingService.createService,
  getBillingStats: BillingService.getBillingStats,
};