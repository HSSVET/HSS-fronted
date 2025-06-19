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
      const data = await billingService.getInvoices(filters);
      setInvoices(data);
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
      const data = await billingService.getPayments(filters);
      setPayments(data);
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
      const data = await billingService.getServices();
      setServices(data);
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
      const newInvoice = await billingService.createInvoice(invoiceData);
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
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
      const updatedInvoice = await billingService.updateInvoice(id, updates);
      setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
      return updatedInvoice;
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
      const newPayment = await billingService.createPayment(paymentData);
      setPayments(prev => [newPayment, ...prev]);
      // Update invoice status in local state
      setInvoices(prev => prev.map(inv => 
        inv.id === paymentData.invoiceId 
          ? { ...inv, status: 'paid' as const }
          : inv
      ));
      return newPayment;
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
      const newService = await billingService.createService(serviceData);
      setServices(prev => [newService, ...prev]);
      return newService;
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
        const data = await billingService.getInvoiceById(id);
        setInvoice(data);
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