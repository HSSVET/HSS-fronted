import React, { useState, useEffect } from 'react';
import { useBilling } from '../../hooks/useBilling';
import { Payment, PaymentFilters } from '../../types';

export const PaymentList: React.FC = () => {
  const { payments, fetchPayments, loading } = useBilling();
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments(filters);
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const filteredPayments = payments.filter(payment => {
    if (searchTerm && !filters.search) {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.transactionNumber?.toLowerCase().includes(searchLower) ||
        payment.description?.toLowerCase().includes(searchLower) ||
        payment.authorizationCode?.toLowerCase().includes(searchLower) ||
        payment.invoice?.patient?.name?.toLowerCase().includes(searchLower) ||
        payment.invoice?.patient?.ownerName?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'cash': return '💵';
      case 'credit_card': return '💳';
      case 'debit_card': return '💳';
      case 'bank_transfer': return '🏦';
      case 'check': return '📝';
      case 'installment': return '📊';
      default: return '💰';
    }
  };

  const getPaymentMethodText = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'cash': return 'Nakit';
      case 'credit_card': return 'Kredi Kartı';
      case 'debit_card': return 'Banka Kartı';
      case 'bank_transfer': return 'Havale/EFT';
      case 'check': return 'Çek';
      case 'installment': return 'Taksit';
      default: return method;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const statusConfig = {
      pending: { color: '#f39c12', bg: '#fff3cd', text: 'Bekliyor' },
      completed: { color: '#27ae60', bg: '#d4edda', text: 'Tamamlandı' },
      failed: { color: '#e74c3c', bg: '#f8d7da', text: 'Başarısız' },
      cancelled: { color: '#6c757d', bg: '#e2e3e5', text: 'İptal' },
      refunded: { color: '#17a2b8', bg: '#d1ecf1', text: 'İade' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor: config.bg,
        color: config.color
      }}>
        {config.text}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="billing-widget ui-card panel ui-card--hover">
      <div className="widget-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <span className="widget-icon">💳</span>
          <h3>Ödeme Geçmişi</h3>
          <span style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--font-size-sm)' 
          }}>
            ({filteredPayments.length} kayıt)
          </span>
        </div>
      </div>

      <div className="widget-content">
        {/* Filtreler */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--spacing-2)', 
          marginBottom: 'var(--spacing-3)' 
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
            <input
              type="text"
              placeholder="İşlem no, açıklama, hasta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: 'var(--font-size-sm)'
              }}
            />
            <button 
              type="submit" 
              className="action-button"
              style={{ padding: '8px 16px' }}
            >
              🔍
            </button>
          </form>

          <select
            value={filters.paymentMethod || ''}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value as any || undefined })}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            <option value="">Tüm Ödeme Yöntemleri</option>
            <option value="cash">💵 Nakit</option>
            <option value="credit_card">💳 Kredi Kartı</option>
            <option value="debit_card">💳 Banka Kartı</option>
            <option value="bank_transfer">🏦 Havale/EFT</option>
            <option value="check">📝 Çek</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any || undefined })}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            <option value="">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="pending">Bekliyor</option>
            <option value="failed">Başarısız</option>
            <option value="cancelled">İptal</option>
          </select>

          {(filters.paymentMethod || filters.status || filters.search) && (
            <button 
              onClick={clearFilters}
              className="action-button"
              style={{ 
                background: 'var(--surface-variant)', 
                color: 'var(--text-secondary)',
                padding: '8px 16px'
              }}
            >
              ✕ Temizle
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
            <div>⏳ Ödemeler yükleniyor...</div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--text-secondary)' }}>
            Ödeme kaydı bulunamadı
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    İşlem No
                  </th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    Fatura / Hasta
                  </th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    Tutar
                  </th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    Yöntem
                  </th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    Detaylar
                  </th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    Durum
                  </th>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: 'var(--spacing-1)' }}>
                      <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
                        {payment.transactionNumber}
                      </div>
                      {payment.authorizationCode && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Auth: {payment.authorizationCode}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 'var(--spacing-1)' }}>
                      <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {payment.invoice?.invoiceNumber || `Fatura #${payment.invoiceId}`}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        {payment.invoice?.patient?.name} ({payment.invoice?.patient?.ownerName})
                      </div>
                    </td>
                    <td style={{ padding: 'var(--spacing-1)' }}>
                      <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--primary-color)' }}>
                        {formatCurrency(payment.amount)}
                      </div>
                      {payment.cashReceived && payment.changeGiven && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Alınan: {formatCurrency(payment.cashReceived)}<br/>
                          Üstü: {formatCurrency(payment.changeGiven)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 'var(--spacing-1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{getPaymentMethodIcon(payment.paymentMethod)}</span>
                        <span style={{ fontSize: 'var(--font-size-sm)' }}>
                          {getPaymentMethodText(payment.paymentMethod)}
                        </span>
                      </div>
                      {payment.posTerminal && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {payment.posTerminal.name}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 'var(--spacing-1)' }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', maxWidth: '200px' }}>
                        {/* Kart bilgileri */}
                        {payment.cardInfo && (
                          <div>
                            {payment.cardInfo.cardType.toUpperCase()} ****{payment.cardInfo.lastFourDigits}
                            {payment.cardInfo.cardHolderName && (
                              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                {payment.cardInfo.cardHolderName}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Havale bilgileri */}
                        {payment.referenceNumber && (
                          <div>
                            <strong>Ref:</strong> {payment.referenceNumber}
                          </div>
                        )}
                        
                        {/* Çek bilgileri */}
                        {payment.checkNumber && (
                          <div>
                            <strong>Çek:</strong> {payment.checkNumber}
                            {payment.checkBank && (
                              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                {payment.checkBank}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Açıklama */}
                        {payment.description && (
                          <div style={{ 
                            fontSize: '11px', 
                            color: 'var(--text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {payment.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--spacing-1)' }}>
                      {getStatusBadge(payment.status)}
                    </td>
                    <td style={{ padding: 'var(--spacing-1)' }}>
                      <div style={{ fontSize: 'var(--font-size-sm)' }}>
                        {formatDate(payment.paymentDate)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {payment.createdBy}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Özet bilgileri */}
        {filteredPayments.length > 0 && (
          <div style={{ 
            marginTop: 'var(--spacing-3)', 
            padding: 'var(--spacing-2)', 
            background: 'var(--surface-variant)', 
            borderRadius: 'var(--border-radius-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--spacing-2)'
          }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Toplam İşlem
              </div>
              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {filteredPayments.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Toplam Tutar
              </div>
              <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--primary-color)' }}>
                {formatCurrency(filteredPayments
                  .filter(p => p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0)
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Nakit Ödemeler
              </div>
              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatCurrency(filteredPayments
                  .filter(p => p.paymentMethod === 'cash' && p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0)
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Kart Ödemeleri
              </div>
              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatCurrency(filteredPayments
                  .filter(p => (p.paymentMethod === 'credit_card' || p.paymentMethod === 'debit_card') && p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 