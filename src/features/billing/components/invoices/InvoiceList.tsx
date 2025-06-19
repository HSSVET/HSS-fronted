import React, { useState } from 'react';
import { Invoice, InvoiceFilters } from '../../types';

interface InvoiceListProps {
  invoices: Invoice[];
  onRefresh: (filters?: InvoiceFilters) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onRefresh }) => {
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

  const getStatusBadge = (status: Invoice['status']) => {
    const statusMap = {
      draft: 'Taslak',
      sent: 'Gönderildi',
      paid: 'Ödendi',
      overdue: 'Gecikmiş',
      cancelled: 'İptal'
    };

    return (
      <span className={`status-badge ${status}`}>
        {statusMap[status]}
      </span>
    );
  };

  const handleFilterChange = (key: keyof InvoiceFilters, value: any) => {
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
      <div className="filters-container">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Ara</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Fatura no, hasta veya sahip adı..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Durum</label>
            <select
              className="filter-select"
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
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <div className="empty-state-text">Henüz fatura bulunamadı</div>
        </div>
      ) : (
        <table className="data-table">
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
                    <small style={{ color: '#6c757d' }}>{invoice.patient.ownerPhone}</small>
                  </div>
                </td>
                <td>{formatDate(invoice.issueDate)}</td>
                <td>
                  <span style={{ 
                    color: new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' 
                      ? '#e74c3c' 
                      : 'inherit' 
                  }}>
                    {formatDate(invoice.dueDate)}
                  </span>
                </td>
                <td>
                  <span className="currency">{formatCurrency(invoice.total)}</span>
                </td>
                <td>{getStatusBadge(invoice.status)}</td>
                <td>
                  <div className="table-actions">
                    <button className="table-action-btn view">Görüntüle</button>
                    {invoice.status === 'draft' && (
                      <button className="table-action-btn edit">Düzenle</button>
                    )}
                    {invoice.status === 'sent' && (
                      <button className="table-action-btn success">Ödeme Al</button>
                    )}
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