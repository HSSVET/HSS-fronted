import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Invoice, Payment, Service, InvoiceFilters, PaymentFilters } from '../types';
import { billingService } from '../services/billingService';

interface BillingContextValue {
  invoices: Invoice[];
  payments: Payment[];
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchInvoices: (filters?: InvoiceFilters) => Promise<void>;
  fetchPayments: (filters?: PaymentFilters) => Promise<void>;
  fetchServices: () => Promise<void>;
  createInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  updateInvoice: (id: number, updates: Partial<Invoice>) => Promise<Invoice>;
  createPayment: (paymentData: Omit<Payment, 'id' | 'createdAt'>) => Promise<Payment>;
  createService: (serviceData: Omit<Service, 'id'>) => Promise<Service>;
}

const BillingContext = createContext<BillingContextValue | undefined>(undefined);

const useProvideBilling = (): BillingContextValue => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async (filters?: InvoiceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getInvoices(filters);
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Faturalar yuklenirken hata olustu');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async (filters?: PaymentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getPayments(filters);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Odemeler yuklenirken hata olustu');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hizmetler yuklenirken hata olustu');
    } finally {
      setLoading(false);
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newInvoice = await billingService.createInvoice(invoiceData);
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fatura olusturulurken hata olustu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInvoice = useCallback(async (id: number, updates: Partial<Invoice>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedInvoice = await billingService.updateInvoice(id, updates);
      setInvoices(prev => prev.map(inv => (inv.id === id ? updatedInvoice : inv)));
      return updatedInvoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fatura guncellenirken hata olustu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPayment = await billingService.createPayment(paymentData);
      setPayments(prev => [newPayment, ...prev]);
      setInvoices(prev => prev.map(inv =>
        inv.id === paymentData.invoiceId ? { ...inv, status: 'paid' } : inv
      ));
      return newPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Odeme kaydedilirken hata olustu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = useCallback(async (serviceData: Omit<Service, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newService = await billingService.createService(serviceData);
      setServices(prev => [newService, ...prev]);
      return newService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hizmet olusturulurken hata olustu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    invoices,
    payments,
    services,
    loading,
    error,
    fetchInvoices,
    fetchPayments,
    fetchServices,
    createInvoice,
    updateInvoice,
    createPayment,
    createService,
  };
};

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useProvideBilling();
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
};

export const useBilling = (): BillingContextValue => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export const useInvoice = (id: number) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await billingService.getInvoiceById(id);
        setInvoice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fatura yuklenirken hata olustu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  return { invoice, loading, error };
};
