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

// POS Cihazı Bilgileri
export interface POSTerminal {
  id: string;
  name: string;
  serialNumber: string;
  bank: string;
  isActive: boolean;
}

// Kart Bilgileri (POS için)
export interface CardInfo {
  cardType: 'visa' | 'mastercard' | 'amex' | 'troy' | 'other';
  lastFourDigits: string;
  bankName: string;
  cardHolderName?: string;
}

// Gerçek hayat senaryosuna uygun Payment interface
export interface Payment {
  id: number;
  invoiceId: number;
  invoice?: Invoice;
  amount: number;
  paymentDate: Date;
  
  // Ana ödeme yöntemi
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'installment';
  
  // İşlem numarası (her ödeme için unique)
  transactionNumber: string;
  
  // Açıklama/notlar
  description?: string;
  
  // POS işlemi için (kredi/banka kartı ödemeleri)
  posTerminal?: POSTerminal;
  cardInfo?: CardInfo;
  authorizationCode?: string;
  batchNumber?: string;
  
  // Nakit ödemeler için
  cashReceived?: number; // Alınan miktar
  changeGiven?: number;  // Verilen para üstü
  
  // Banka havalesi için
  bankAccount?: string;
  referenceNumber?: string;
  
  // Çek ödemeleri için
  checkNumber?: string;
  checkBank?: string;
  checkDate?: Date;
  
  // Taksit ödemeleri için
  installmentInfo?: {
    installmentNumber: number;
    totalInstallments: number;
    installmentAmount: number;
    interestRate?: number;
  };
  
  // Sistem bilgileri
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  
  // İptal/iade işlemleri için
  refundInfo?: {
    refundAmount: number;
    refundDate: Date;
    refundReason: string;
    refundTransactionNumber: string;
  };
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
  startDate?: Date;
  endDate?: Date;
  patientId?: number;
  search?: string;
}

export interface PaymentFilters {
  paymentMethod?: Payment['paymentMethod'];
  dateFrom?: Date;
  dateTo?: Date;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  status?: Payment['status'];
  posTerminalId?: string;
}
