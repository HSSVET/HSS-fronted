export interface Patient {
  id: number;
  name: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'examination' | 'surgery' | 'vaccination' | 'laboratory' | 'emergency' | 'other';
}

export interface InvoiceItem {
  id: number;
  serviceId: number;
  service: Service;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  patientId: number;
  patient: Patient;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: number;
  invoiceId: number;
  invoice?: Invoice;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'check';
  transactionId?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface PaymentPlan {
  id: number;
  invoiceId: number;
  invoice?: Invoice;
  totalAmount: number;
  installments: PaymentInstallment[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInstallment {
  id: number;
  paymentPlanId: number;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  paymentId?: number;
  payment?: Payment;
}

export interface BillingStatsData {
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  monthlyRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
}

export interface InvoiceFilters {
  status?: Invoice['status'];
  dateFrom?: Date;
  dateTo?: Date;
  patientId?: number;
  search?: string;
}

export interface PaymentFilters {
  paymentMethod?: Payment['paymentMethod'];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
} 