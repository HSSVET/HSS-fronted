import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';
import type { ApiResponse } from '../../../types/common';

export type InvoiceRuleType = 
  | 'APPOINTMENT_AFTER' 
  | 'MONTHLY_SUBSCRIPTION' 
  | 'TREATMENT_AFTER' 
  | 'VACCINATION_AFTER' 
  | 'LAB_TEST_AFTER' 
  | 'CUSTOM';

export interface InvoiceRule {
  ruleId: number;
  ruleName: string;
  ruleType: InvoiceRuleType;
  triggerEntity?: string;
  triggerStatus?: string;
  conditions?: string; // JSON string
  invoiceTemplate?: string; // JSON string
  dueDays: number;
  isActive: boolean;
  priority: number;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceRuleCreateRequest {
  ruleName: string;
  ruleType: InvoiceRuleType;
  triggerEntity?: string;
  triggerStatus?: string;
  conditions?: string;
  invoiceTemplate?: string;
  dueDays?: number;
  isActive?: boolean;
  priority?: number;
  description?: string;
  notes?: string;
}

export interface InvoiceRuleUpdateRequest {
  ruleName?: string;
  ruleType?: InvoiceRuleType;
  triggerEntity?: string;
  triggerStatus?: string;
  conditions?: string;
  invoiceTemplate?: string;
  dueDays?: number;
  isActive?: boolean;
  priority?: number;
  description?: string;
  notes?: string;
}

export class InvoiceRuleService {
  static async createRule(request: InvoiceRuleCreateRequest): Promise<ApiResponse<InvoiceRule>> {
    return apiClient.post<InvoiceRule>(API_ENDPOINTS.INVOICE_RULES, request);
  }

  static async getAllRules(): Promise<ApiResponse<InvoiceRule[]>> {
    return apiClient.get<InvoiceRule[]>(API_ENDPOINTS.INVOICE_RULES);
  }

  static async getActiveRules(): Promise<ApiResponse<InvoiceRule[]>> {
    return apiClient.get<InvoiceRule[]>(`${API_ENDPOINTS.INVOICE_RULES}/active`);
  }

  static async getRuleById(id: number): Promise<ApiResponse<InvoiceRule>> {
    return apiClient.get<InvoiceRule>(`${API_ENDPOINTS.INVOICE_RULES}/${id}`);
  }

  static async updateRule(id: number, request: InvoiceRuleUpdateRequest): Promise<ApiResponse<InvoiceRule>> {
    return apiClient.put<InvoiceRule>(`${API_ENDPOINTS.INVOICE_RULES}/${id}`, request);
  }

  static async deleteRule(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_ENDPOINTS.INVOICE_RULES}/${id}`);
  }

  static async processAllRules(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.INVOICE_RULES}/process`);
  }

  static async processRulesForAppointment(appointmentId: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${API_ENDPOINTS.INVOICE_RULES}/appointment/${appointmentId}/process`);
  }
}

export const invoiceRuleService = new InvoiceRuleService();

