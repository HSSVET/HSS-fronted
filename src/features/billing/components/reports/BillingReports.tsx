import React, { useState, useEffect } from 'react';
import { useBilling } from '../../hooks/useBilling';

export const BillingReports: React.FC = () => {
  const { invoices, payments, fetchInvoices, fetchPayments } = useBilling();
  const [reportPeriod, setReportPeriod] = useState('this_month');

  useEffect(() => {
    fetchInvoices();
    fetchPayments();
  }, []);

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

  return (
    <div>
      <div className="filters-container">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Dönem</label>
            <select
              className="filter-select"
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

          <div className="filter-group">
            <button className="action-button primary" onClick={exportReport}>
              📊 CSV İndir
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Özet Bilgiler */}
        <div className="report-card">
          <h3>Genel Özet</h3>
          <div className="report-stats">
            <div className="stat-item">
              <span className="stat-label">Toplam Gelir</span>
              <span className="stat-value currency">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ödenen Faturalar</span>
              <span className="stat-value">{paidInvoices}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Bekleyen Faturalar</span>
              <span className="stat-value">{pendingInvoices}</span>
            </div>
          </div>
        </div>

        {/* Ödeme Yöntemleri */}
        <div className="report-card">
          <h3>Ödeme Yöntemleri</h3>
          <div className="payment-methods">
            {Object.entries(revenueByMethod).map(([method, amount]) => (
              <div key={method} className="payment-method-item">
                <span className="method-name">
                  {method === 'cash' ? '💵 Nakit' : 
                   method === 'credit_card' ? '💳 Kredi Kartı' :
                   method === 'bank_transfer' ? '🏦 Havale' : '📝 Çek'}
                </span>
                <span className="method-amount">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* En Çok Kullanılan Hizmetler */}
        <div className="report-card">
          <h3>Popüler Hizmetler</h3>
          <div className="service-list">
            {topServices.map(([service, revenue], index) => (
              <div key={service} className="service-item">
                <span className="service-rank">{index + 1}</span>
                <span className="service-name">{service}</span>
                <span className="service-revenue">{formatCurrency(revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 