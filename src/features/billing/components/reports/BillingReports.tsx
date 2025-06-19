import React, { useState, useEffect } from 'react';
import { useBilling } from '../../hooks/useBilling';

export const BillingReports: React.FC = () => {
  const { invoices, payments, stats, fetchInvoices, fetchPayments, fetchStats } = useBilling();
  const [reportPeriod, setReportPeriod] = useState('this_month');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    fetchInvoices();
    fetchPayments();
    fetchStats();
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

  const getMonthlyRevenue = () => {
    // Bu örnekte sadece mockup veri döndürüyoruz
    // Gerçek uygulamada ödeme tarihlerine göre hesaplanacak
    return [
      { month: 'Ocak', revenue: 45000 },
      { month: 'Şubat', revenue: 52000 },
      { month: 'Mart', revenue: 48000 },
      { month: 'Nisan', revenue: 58000 },
      { month: 'Mayıs', revenue: 63000 },
      { month: 'Haziran', revenue: 71000 },
    ];
  };

  const revenueByMethod = getRevenueByMethod();
  const topServices = getTopServices();
  const monthlyRevenue = getMonthlyRevenue();

  const exportReport = () => {
    // Basit CSV export
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
            <label className="filter-label">Rapor Türü</label>
            <select
              className="filter-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Genel Bakış</option>
              <option value="revenue">Gelir Analizi</option>
              <option value="services">Hizmet Analizi</option>
              <option value="customers">Müşteri Analizi</option>
            </select>
          </div>

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
              <option value="custom">Özel Dönem</option>
            </select>
          </div>

          <div className="filter-group">
            <button className="action-button secondary" onClick={exportReport}>
              📊 Rapor İndir
            </button>
          </div>
        </div>
      </div>

      {reportType === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* Aylık Gelir Trendi */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3>Aylık Gelir Trendi</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
              {monthlyRevenue.map((data, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    height: `${(data.revenue / 75000) * 160}px`,
                    backgroundColor: '#667eea',
                    width: '100%',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '0.5rem'
                  }} />
                  <small style={{ fontSize: '0.7rem', textAlign: 'center' }}>
                    {data.month}
                  </small>
                  <small style={{ fontSize: '0.6rem', color: '#6c757d' }}>
                    {formatCurrency(data.revenue)}
                  </small>
                </div>
              ))}
            </div>
          </div>

          {/* Ödeme Yöntemleri */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3>Ödeme Yöntemleri Dağılımı</h3>
            <div style={{ marginTop: '1rem' }}>
              {Object.entries(revenueByMethod).map(([method, amount]) => {
                const percentage = (amount / Object.values(revenueByMethod).reduce((a, b) => a + b, 0)) * 100;
                return (
                  <div key={method} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{method === 'cash' ? '💵 Nakit' : 
                             method === 'credit_card' ? '💳 Kredi Kartı' :
                             method === 'bank_transfer' ? '🏦 Havale' : '📝 Çek'}</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: '#667eea',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <small style={{ color: '#6c757d' }}>{percentage.toFixed(1)}%</small>
                  </div>
                );
              })}
            </div>
          </div>

          {/* En Çok Satılan Hizmetler */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3>En Çok Satılan Hizmetler</h3>
            <div style={{ marginTop: '1rem' }}>
              {topServices.map(([service, revenue], index) => (
                <div key={service} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: index === 0 ? '#f8f9ff' : '#f8f9fa',
                  borderRadius: '6px',
                  border: index === 0 ? '2px solid #667eea' : '1px solid #dee2e6'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{index + 1}. {service}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#27ae60' }}>
                    {formatCurrency(revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fatura Durum Özeti */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3>Fatura Durum Özeti</h3>
            {stats && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#d4edda', borderRadius: '6px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>
                      {stats.paidInvoices}
                    </div>
                    <div style={{ color: '#155724' }}>Ödenen</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#856404' }}>
                      {stats.unpaidInvoices}
                    </div>
                    <div style={{ color: '#856404' }}>Bekleyen</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Toplam Gelir:</span>
                    <strong style={{ color: '#27ae60' }}>{formatCurrency(stats.totalRevenue)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span>Bekleyen Ödemeler:</span>
                    <strong style={{ color: '#f39c12' }}>{formatCurrency(stats.pendingPayments)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {reportType === 'revenue' && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3>Detaylı Gelir Analizi</h3>
          <p style={{ color: '#6c757d' }}>
            Bu bölümde detaylı gelir analizleri, kar marjları ve trend analizleri yer alacak.
            Geliştirilme aşamasında...
          </p>
        </div>
      )}

      {reportType === 'services' && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3>Hizmet Performans Analizi</h3>
          <p style={{ color: '#6c757d' }}>
            Bu bölümde hizmet bazlı performans analizleri, popüler hizmetler ve karlılık analizleri yer alacak.
            Geliştirilme aşamasında...
          </p>
        </div>
      )}

      {reportType === 'customers' && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3>Müşteri Analizi</h3>
          <p style={{ color: '#6c757d' }}>
            Bu bölümde müşteri segmentasyonu, sadakat analizleri ve müşteri değeri analizleri yer alacak.
            Geliştirilme aşamasında...
          </p>
        </div>
      )}
    </div>
  );
}; 