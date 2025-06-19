import React, { useState, useEffect } from 'react';
import { useBilling } from '../hooks/useBilling';
import { InvoiceList } from './invoices/InvoiceList';
import { PaymentList } from './payments/PaymentList';
import { BillingStats } from './BillingStats';
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
    stats, 
    loading, 
    error, 
    fetchInvoices, 
    fetchPayments, 
    fetchStats,
    fetchServices 
  } = useBilling();

  useEffect(() => {
    fetchStats();
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

  const renderActionButtons = () => {
    switch (activeTab) {
      case 'invoices':
        return (
          <button className="action-button" onClick={handleCreateInvoice}>
            <span>+</span>
            Yeni Fatura
          </button>
        );
      case 'payments':
        return (
          <button className="action-button success" onClick={handleCreatePayment}>
            <span>+</span>
            Ödeme Kaydet
          </button>
        );
      case 'reports':
        return (
          <button className="action-button secondary">
            <span>📊</span>
            Rapor İndir
          </button>
        );
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-text">Hata: {error}</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'invoices':
        return <InvoiceList invoices={invoices} onRefresh={fetchInvoices} />;
      case 'payments':
        return <PaymentList payments={payments} onRefresh={fetchPayments} />;
      case 'reports':
        return <BillingReports />;
      case 'services':
        return <div>Hizmet yönetimi yakında eklenecek...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="billing-container">
      <div className="billing-header">
        <h1 className="billing-title">Ödeme ve Faturalandırma</h1>
        <div className="billing-actions">
          {renderActionButtons()}
        </div>
      </div>

      {stats && <BillingStats stats={stats} />}

      <div className="billing-tabs">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            📄 Faturalar
          </button>
          <button
            className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            💳 Ödemeler
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📊 Raporlar
          </button>
          <button
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            🛠️ Hizmetler
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
            fetchStats();
          }}
        />
      )}

      {showCreatePayment && (
        <CreatePaymentModal
          onClose={() => setShowCreatePayment(false)}
          onSuccess={() => {
            setShowCreatePayment(false);
            fetchPayments();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}; 