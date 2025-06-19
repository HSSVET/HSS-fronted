import React, { useState } from 'react';
import { Payment, PaymentFilters } from '../../types';

interface PaymentListProps {
  payments: Payment[];
  onRefresh: (filters?: PaymentFilters) => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({ payments, onRefresh }) => {
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

  const getPaymentMethodDisplay = (method: Payment['paymentMethod']) => {
    const methodMap = {
      cash: '💵 Nakit',
      credit_card: '💳 Kredi Kartı',
      bank_transfer: '🏦 Havale',
      check: '📝 Çek'
    };
    return methodMap[method];
  };

  const handleFilterChange = (key: keyof PaymentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onRefresh(newFilters);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onRefresh(newFilters);
  };

  const filteredPayments = payments.filter(payment => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.transactionId?.toLowerCase().includes(searchLower) ||
        payment.notes?.toLowerCase().includes(searchLower) ||
        payment.createdBy.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalPayments = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div>
      <div className="filters-container">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Ara</label>
            <input
              type="text"
              className="filter-input"
              placeholder="İşlem no, not veya kullanıcı..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Ödeme Yöntemi</label>
            <select
              className="filter-select"
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
          
          <div className="filter-group">
            <label className="filter-label">Başlangıç Tarihi</label>
            <input
              type="date"
              className="filter-input"
              onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Bitiş Tarihi</label>
            <input
              type="date"
              className="filter-input"
              onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
            />
          </div>
        </div>

        {filteredPayments.length > 0 && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#f8f9ff', 
            borderRadius: '6px',
            borderLeft: '4px solid #667eea'
          }}>
            <strong>Toplam Ödeme: {formatCurrency(totalPayments)}</strong>
            <span style={{ marginLeft: '1rem', color: '#6c757d' }}>
              ({filteredPayments.length} işlem)
            </span>
          </div>
        )}
      </div>

      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💳</div>
          <div className="empty-state-text">Henüz ödeme bulunamadı</div>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Fatura No</th>
              <th>Tutar</th>
              <th>Ödeme Yöntemi</th>
              <th>İşlem No</th>
              <th>Kaydeden</th>
              <th>Notlar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{formatDate(payment.paymentDate)}</td>
                <td>
                  {payment.invoice ? (
                    <span>
                      <strong>{payment.invoice.invoiceNumber}</strong>
                      <br />
                      <small style={{ color: '#6c757d' }}>
                        {payment.invoice.patient.name} - {payment.invoice.patient.ownerName}
                      </small>
                    </span>
                  ) : (
                    <span>Fatura #{payment.invoiceId}</span>
                  )}
                </td>
                <td>
                  <span className="currency">{formatCurrency(payment.amount)}</span>
                </td>
                <td>{getPaymentMethodDisplay(payment.paymentMethod)}</td>
                <td>
                  {payment.transactionId ? (
                    <code style={{ 
                      background: '#f8f9fa', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {payment.transactionId}
                    </code>
                  ) : (
                    <span style={{ color: '#6c757d' }}>-</span>
                  )}
                </td>
                <td>{payment.createdBy}</td>
                <td>
                  {payment.notes ? (
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {payment.notes}
                    </div>
                  ) : (
                    <span style={{ color: '#6c757d' }}>-</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="table-action-btn view">Detay</button>
                    <button className="table-action-btn edit">Düzenle</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}; 