import React, { useState } from 'react';
import { Invoice, Payment } from '../../types';

interface BillingReportsProps {
  invoices: Invoice[];
  payments: Payment[];
}

export const BillingReports: React.FC<BillingReportsProps> = ({ invoices, payments }) => {
  const [reportPeriod, setReportPeriod] = useState('this_month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getRevenueByMethod = () => {
    const methodTotals = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    return methodTotals;
  };

  const getTopServices = () => {
    const serviceTotals = invoices.reduce((acc, invoice) => {
      invoice.items.forEach(item => {
        const serviceName = item.service.name;
        acc[serviceName] = (acc[serviceName] || 0) + item.total;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(serviceTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const revenueByMethod = getRevenueByMethod();
  const topServices = getTopServices();
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent').length;

  const exportReport = () => {
    const csvData = invoices.map(invoice => ({
      'Fatura No': invoice.invoiceNumber,
      'Hasta': invoice.patient.name,
      'Sahip': invoice.patient.ownerName,
      'Tarih': new Date(invoice.issueDate).toLocaleDateString('tr-TR'),
      'Tutar': invoice.total,
      'Durum': invoice.status
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(h => row[h as keyof typeof row]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fatura_raporu_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getPaymentMethodIcon = (method: string) => {
    const iconMap = {
      cash: '💵',
      credit_card: '💳',
      bank_transfer: '🏦',
      check: '📝'
    };
    return iconMap[method as keyof typeof iconMap] || '💰';
  };

  const getPaymentMethodName = (method: string) => {
    const nameMap = {
      cash: 'Nakit',
      credit_card: 'Kredi Kartı',
      bank_transfer: 'Havale',
      check: 'Çek'
    };
    return nameMap[method as keyof typeof nameMap] || method;
  };

  return (
    <div>
      {/* Filters Widget */}
      <div className="billing-widget">
        <div className="widget-header">
          <h2>
            <span className="icon icon-chart"></span>
            Rapor Ayarları
          </h2>
        </div>
        <div className="widget-content">
          <div className="billing-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
            <div className="form-group">
              <label className="form-label">Dönem</label>
              <select
                className="form-select"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
              >
                <option value="this_week">Bu Hafta</option>
                <option value="this_month">Bu Ay</option>
                <option value="last_month">Geçen Ay</option>
                <option value="this_quarter">Bu Çeyrek</option>
                <option value="this_year">Bu Yıl</option>
              </select>
            </div>

            <div className="form-group">
              <button className="action-button" onClick={exportReport}>
                <span className="icon icon-plus"></span>
                CSV İndir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-2)' }}>
        {/* Özet Bilgiler Widget */}
        <div className="billing-widget">
          <div className="widget-header">
            <h2>
              <span className="icon icon-chart"></span>
              Genel Özet
            </h2>
          </div>
          <div className="widget-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--spacing-1)',
                background: 'var(--surface-variant)',
                borderRadius: 'var(--border-radius-sm)'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Toplam Gelir
                </span>
                <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--primary-color)' }}>
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--spacing-1)',
                background: 'var(--surface-variant)',
                borderRadius: 'var(--border-radius-sm)'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Ödenen Faturalar
                </span>
                <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                  {paidInvoices}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--spacing-1)',
                background: 'var(--surface-variant)',
                borderRadius: 'var(--border-radius-sm)'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Bekleyen Faturalar
                </span>
                <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                  {pendingInvoices}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ödeme Yöntemleri Widget */}
        <div className="billing-widget">
          <div className="widget-header">
            <h2>
              <span className="icon icon-card"></span>
              Ödeme Yöntemleri
            </h2>
          </div>
          <div className="widget-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              {Object.entries(revenueByMethod).map(([method, amount]) => (
                <div key={method} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-1)',
                  background: 'var(--surface-variant)',
                  borderRadius: 'var(--border-radius-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-half)' }}>
                    <span>{getPaymentMethodIcon(method)}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {getPaymentMethodName(method)}
                    </span>
                  </div>
                  <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--primary-color)' }}>
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* En Çok Kullanılan Hizmetler Widget */}
        <div className="billing-widget">
          <div className="widget-header">
            <h2>
              <span className="icon icon-lab"></span>
              Popüler Hizmetler
            </h2>
          </div>
          <div className="widget-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              {topServices.map(([service, revenue], index) => (
                <div key={service} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-1)',
                  padding: 'var(--spacing-1)',
                  background: 'var(--surface-variant)',
                  borderRadius: 'var(--border-radius-sm)'
                }}>
                  <div style={{
                    background: 'var(--primary-color)',
                    color: 'var(--text-on-primary)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-medium)',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <span style={{ 
                    flex: 1, 
                    color: 'var(--text-secondary)', 
                    fontSize: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {service}
                  </span>
                  <span style={{ 
                    fontWeight: 'var(--font-weight-medium)', 
                    color: 'var(--primary-color)',
                    fontSize: '12px'
                  }}>
                    {formatCurrency(revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 