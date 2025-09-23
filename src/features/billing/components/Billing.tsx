import React, { useState, useEffect } from 'react';
import { useBilling } from '../hooks/useBilling';
import { InvoiceList } from './invoices/InvoiceList';
import { PaymentList } from './payments/PaymentList';
import { CreateInvoiceModal } from './invoices/CreateInvoiceModal';
import { CreatePaymentModal } from './payments/CreatePaymentModal';
import { BillingReports } from './reports/BillingReports';
import '../styles/Billing.css';

type TabType = 'invoices' | 'payments' | 'reports' | 'services';

export const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  
  const { 
    invoices, 
    payments, 
    services,
    loading, 
    error, 
    fetchInvoices, 
    fetchPayments, 
    fetchServices 
  } = useBilling();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (activeTab === 'invoices') {
      fetchInvoices();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  const handleCreateInvoice = () => {
    setShowCreateInvoice(true);
  };

  const handleCreatePayment = () => {
    setShowCreatePayment(true);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'invoices':
        return <InvoiceList />;
      case 'payments':
        return <PaymentList />;
      case 'reports':
        return <BillingReports />;
      case 'services':
        return (
          <div className="services-content">
            <h3>Hizmetler</h3>
            <p>Hizmet yönetimi geliştiriliyor...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="billing">
      <div className="billing-header ui-card panel ui-card--hover">
        <h1>Ödeme ve Faturalandırma</h1>
        <div className="quick-actions">
          <button className="action-button" onClick={handleCreateInvoice}>
            <span className="icon icon-plus"></span>
            Fatura Oluştur
          </button>
          {activeTab === 'invoices' && (
            <button className="action-button" onClick={handleCreateInvoice}>
              <span className="icon icon-hospital"></span>
              Yeni Fatura
            </button>
          )}
          {activeTab === 'payments' && (
            <button className="action-button" onClick={handleCreatePayment}>
              <span className="icon icon-plus"></span>
              Ödeme Kaydet
            </button>
          )}
        </div>
      </div>

      <div className="billing-tabs ui-card panel">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            <span className="icon icon-hospital"></span>
            Faturalar
          </button>
          <button
            className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span className="icon icon-card"></span>
            Ödemeler
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="icon icon-chart"></span>
            Raporlar
          </button>
          <button
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <span className="icon icon-lab"></span>
            Hizmetler
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

      {showCreateInvoice && (
        <CreateInvoiceModal
          onClose={() => setShowCreateInvoice(false)}
          onSuccess={() => {
            setShowCreateInvoice(false);
            fetchInvoices();
          }}
        />
      )}

      {showCreatePayment && (
        <CreatePaymentModal
          onClose={() => setShowCreatePayment(false)}
          onSuccess={() => {
            setShowCreatePayment(false);
            fetchPayments();
          }}
        />
      )}
    </div>
  );
}; 