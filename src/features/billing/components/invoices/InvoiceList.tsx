import React, { useState } from 'react';
import { useBilling } from '../../hooks/useBilling';
import { InvoiceFilters } from '../../types';

export const InvoiceList: React.FC = () => {
  const { invoices, fetchInvoices } = useBilling();
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR').format(new Date(date));
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: 'Taslak',
      sent: 'Gönderildi',
      paid: 'Ödendi',
      overdue: 'Gecikmiş',
      cancelled: 'İptal'
    };

    return (
      <span className={`status-badge ${status}`}>
        {statusMap[status as keyof typeof statusMap]}
      </span>
    );
  };

  const handleFilterChange = (key: keyof InvoiceFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchInvoices(newFilters);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    fetchInvoices(newFilters);
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.patient.name.toLowerCase().includes(searchLower) ||
        invoice.patient.ownerName.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Filters Widget */}
      <div className="billing-widget ui-card panel ui-card--hover">
        <div className="widget-header">
          <h2>
            <span className="icon icon-hospital"></span>
            Fatura Filtreleri
          </h2>
        </div>
        <div className="widget-content">
          <div className="billing-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
            <div className="form-group">
              <label className="form-label">Ara</label>
              <input
                type="text"
                className="form-input"
                placeholder="Fatura no, hasta, sahip..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Durum</label>
              <select
                className="form-select"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              >
                <option value="">Tümü</option>
                <option value="draft">Taslak</option>
                <option value="sent">Gönderildi</option>
                <option value="paid">Ödendi</option>
                <option value="overdue">Gecikmiş</option>
                <option value="cancelled">İptal</option>
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

      {/* Invoices Table Widget */}
      <div className="billing-widget ui-card panel">
        <div className="widget-header">
          <h2>
            <span className="icon icon-hospital"></span>
            Faturalar ({filteredInvoices.length})
          </h2>
        </div>
        <div className="widget-content">
          {filteredInvoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-1)', opacity: 0.5 }}>📄</div>
              <div>Henüz fatura bulunamadı</div>
            </div>
          ) : (
            <table className="billing-table table">
              <thead>
                <tr>
                  <th>Fatura No</th>
                  <th>Hasta</th>
                  <th>Sahip</th>
                  <th>Tarih</th>
                  <th>Vade</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <strong>{invoice.invoiceNumber}</strong>
                    </td>
                    <td>{invoice.patient.name}</td>
                    <td>
                      <div>
                        <div>{invoice.patient.ownerName}</div>
                        <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                          {invoice.patient.ownerPhone}
                        </small>
                      </div>
                    </td>
                    <td>{formatDate(invoice.issueDate)}</td>
                    <td>
                      <span style={{ 
                        color: new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' 
                          ? 'var(--error-color)' 
                          : 'inherit' 
                      }}>
                        {formatDate(invoice.dueDate)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--primary-color)' }}>
                        {formatCurrency(invoice.total)}
                      </span>
                    </td>
                    <td>{getStatusBadge(invoice.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--spacing-half)' }}>
                        <button 
                          className="action-button" 
                          style={{ height: '24px', fontSize: '10px', padding: '0 var(--spacing-half)' }}
                        >
                          <span className="icon" style={{ width: '12px', height: '12px', marginRight: '4px' }}>👁️</span>
                          Görüntüle
                        </button>
                        {invoice.status === 'sent' && (
                          <button 
                            className="action-button" 
                            style={{ height: '24px', fontSize: '10px', padding: '0 var(--spacing-half)' }}
                          >
                            <span className="icon" style={{ width: '12px', height: '12px', marginRight: '4px' }}>💰</span>
                            Ödeme Al
                          </button>
                        )}
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