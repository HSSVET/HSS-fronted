// Main Billing component
export { Billing } from './components/Billing';

// Invoice components
export { InvoiceList } from './components/invoices/InvoiceList';
export { CreateInvoiceModal } from './components/invoices/CreateInvoiceModal';

// Payment components
export { PaymentList } from './components/payments/PaymentList';
export { CreatePaymentModal } from './components/payments/CreatePaymentModal';

// Other components
export { BillingStats } from './components/BillingStats';
export { BillingReports } from './components/reports/BillingReports';

// Hooks
export { useBilling, useInvoice } from './hooks/useBilling';

// Services
export { billingService } from './services/billingService';

// Types
export type {
  Patient,
  Service,
  Invoice,
  InvoiceItem,
  Payment,
  PaymentPlan,
  PaymentInstallment,
  BillingStatsData,
  InvoiceFilters,
  PaymentFilters
} from './types'; 