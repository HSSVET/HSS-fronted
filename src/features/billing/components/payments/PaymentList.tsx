import React, { useState } from 'react';
import { useBilling } from '../../hooks/useBilling';
import { PaymentFilters } from '../../types';

export const PaymentList: React.FC = () => {
  const { payments, fetchPayments } = useBilling();
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
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

  const handleFilterChange = (key: keyof PaymentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchPayments(newFilters);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    fetchPayments(newFilters);
  };

  const filteredPayments = payments.filter(payment => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.transactionNumber?.toLowerCase().includes(searchLower) ||
        payment.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Filters Widget */}
      <div className="billing-widget">
        <div className="widget-header">
          <h2>
            <span className="icon icon-card"></span>
            Ödeme Filtreleri
          </h2>
        </div>
        <div className="widget-content">
          <div className="billing-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
            <div className="form-group">
              <label className="form-label">Ara</label>
              <input
                type="text"
                className="form-input"
                placeholder="İşlem no, açıklama..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Ödeme Yöntemi</label>
              <select
                className="form-select"
                value={filters.paymentMethod || ''}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value || undefined)}
              >
                <option value="">Tümü</option>
                <option value="cash">Nakit</option>
                <option value="credit_card">Kredi Kartı</option>
                <option value="bank_transfer">Havale</option>
                <option value="check">Çek</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Başlangıç</label>
              <input
                type="date"
                className="form-input"
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Bitiş</label>
              <input
                type="date"
                className="form-input"
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table Widget */}
      <div className="billing-widget">
        <div className="widget-header">
          <h2>
            <span className="icon icon-card"></span>
            Ödemeler ({filteredPayments.length})
          </h2>
        </div>
        <div className="widget-content">
          {filteredPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-1)', opacity: 0.5 }}>💳</div>
              <div>Henüz ödeme bulunamadı</div>
            </div>
          ) : (
            <table className="billing-table">
              <thead>
                <tr>
                  <th>İşlem No</th>
                  <th>Fatura No</th>
                  <th>Tarih</th>
                  <th>Tutar</th>
                  <th>Yöntem</th>
                  <th>Açıklama</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.transactionNumber || '-'}</strong>
                    </td>
                    <td>
                      <span style={{ color: 'var(--primary-color)', fontWeight: 'var(--font-weight-medium)' }}>
                        #{payment.invoiceId}
                      </span>
                    </td>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td>
                      <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--primary-color)' }}>
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-half)' }}>
                        <span>{getPaymentMethodIcon(payment.paymentMethod)}</span>
                        <span>{getPaymentMethodName(payment.paymentMethod)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {payment.description || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--spacing-half)' }}>
                        <button 
                          className="action-button" 
                          style={{ height: '24px', fontSize: '10px', padding: '0 var(--spacing-half)' }}
                        >
                          <span className="icon" style={{ width: '12px', height: '12px', marginRight: '4px' }}>👁️</span>
                          Detay
                        </button>
                        <button 
                          className="action-button" 
                          style={{ height: '24px', fontSize: '10px', padding: '0 var(--spacing-half)' }}
                        >
                          <span className="icon" style={{ width: '12px', height: '12px', marginRight: '4px' }}>🖨️</span>
                          Yazdır
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}; 