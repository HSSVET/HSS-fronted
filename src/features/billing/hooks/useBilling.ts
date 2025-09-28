import { useState, useEffect } from 'react';
import { Invoice, Payment, Service, InvoiceFilters, PaymentFilters } from '../types';
import { billingService } from '../services/billingService';

export const useBilling = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async (filters?: InvoiceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingService.getInvoices(filters);
      setInvoices(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Faturalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (filters?: PaymentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingService.getPayments(filters);
      setPayments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ödemeler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingService.getServices();
      setServices(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hizmetler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingService.createInvoice(invoiceData);
      setInvoices(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fatura oluşturulurken hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id: number, updates: Partial<Invoice>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingService.updateInvoice(id, updates);
      setInvoices(prev => prev.map(inv => inv.id === id ? response.data : inv));
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fatura güncellenirken hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingService.createPayment(paymentData);
      setPayments(prev => [response.data, ...prev]);
      // Update invoice status in local state
      setInvoices(prev => prev.map(inv => 
        inv.id === paymentData.invoiceId 
          ? { ...inv, status: 'paid' as const }
          : inv
      ));
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ödeme kaydedilirken hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await billingService.createService(serviceData);
      setServices(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hizmet oluşturulurken hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    invoices,
    payments,
    services,
    loading,
    error,
    
    // Actions
    fetchInvoices,
    fetchPayments,
    fetchServices,
    createInvoice,
    updateInvoice,
    createPayment,
    createService,
  };
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
        const response = await billingService.getInvoiceById(id);
        setInvoice(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fatura yüklenirken hata oluştu');
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