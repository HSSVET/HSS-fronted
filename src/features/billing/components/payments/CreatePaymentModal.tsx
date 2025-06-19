import React, { useState, useEffect } from 'react';
import { useBilling } from '../../hooks/useBilling';
import { Payment, Invoice } from '../../types';

interface CreatePaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preselectedInvoiceId?: number;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({ 
  onClose, 
  onSuccess, 
  preselectedInvoiceId 
}) => {
  const { invoices, createPayment, loading, fetchInvoices } = useBilling();
  
  const [formData, setFormData] = useState({
    invoiceId: preselectedInvoiceId?.toString() || '',
    amount: '',
    paymentMethod: 'cash' as Payment['paymentMethod'],
    transactionId: '',
    notes: ''
  });

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices({ status: 'sent' }); // Sadece gönderilmiş faturaları getir
  }, []);

  useEffect(() => {
    if (formData.invoiceId) {
      const invoice = invoices.find(inv => inv.id === parseInt(formData.invoiceId));
      setSelectedInvoice(invoice || null);
      if (invoice && !formData.amount) {
        setFormData(prev => ({ ...prev, amount: invoice.total.toString() }));
      }
    } else {
      setSelectedInvoice(null);
    }
  }, [formData.invoiceId, invoices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR').format(new Date(date));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.invoiceId || !formData.amount) {
      alert('Lütfen fatura ve ödeme tutarını seçin');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      alert('Ödeme tutarı sıfırdan büyük olmalıdır');
      return;
    }

    if (selectedInvoice && amount > selectedInvoice.total) {
      alert('Ödeme tutarı fatura tutarından büyük olamaz');
      return;
    }

    const paymentData: Omit<Payment, 'id' | 'createdAt'> = {
      invoiceId: parseInt(formData.invoiceId),
      amount,
      paymentDate: new Date(),
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId || undefined,
      notes: formData.notes || undefined,
      createdBy: 'Dr. Veteriner'
    };

    try {
      await createPayment(paymentData);
      onSuccess();
    } catch (error) {
      console.error('Ödeme kaydetme hatası:', error);
    }
  };

  const getPaymentMethodRequirements = () => {
    switch (formData.paymentMethod) {
      case 'credit_card':
        return 'Kredi kartı ödemeleri için işlem numarası zorunludur';
      case 'bank_transfer':
        return 'Havale ödemeleri için dekont numarası eklenmelidir';
      case 'check':
        return 'Çek ödemeleri için çek numarası girilmelidir';
      default:
        return 'Nakit ödemeler için işlem numarası isteğe bağlıdır';
    }
  };

  const unpaidInvoices = invoices.filter(inv => inv.status === 'sent');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Ödeme Kaydet</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Fatura Seçin</label>
              <select
                className="form-select"
                value={formData.invoiceId}
                onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                required
              >
                <option value="">Fatura seçin...</option>
                {unpaidInvoices.map(invoice => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoiceNumber} - {invoice.patient.name} ({invoice.patient.ownerName}) - {formatCurrency(invoice.total)}
                  </option>
                ))}
              </select>
            </div>

            {selectedInvoice && (
              <div style={{ 
                gridColumn: '1 / -1',
                background: '#f8f9fa', 
                border: '1px solid #dee2e6',
                borderRadius: '6px', 
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <h4>Seçilen Fatura Detayları</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <strong>Fatura No:</strong> {selectedInvoice.invoiceNumber}
                  </div>
                  <div>
                    <strong>Hasta:</strong> {selectedInvoice.patient.name}
                  </div>
                  <div>
                    <strong>Sahip:</strong> {selectedInvoice.patient.ownerName}
                  </div>
                  <div>
                    <strong>Vade Tarihi:</strong> {formatDate(selectedInvoice.dueDate)}
                  </div>
                  <div>
                    <strong>Toplam Tutar:</strong> {formatCurrency(selectedInvoice.total)}
                  </div>
                  <div>
                    <strong>Durum:</strong> 
                    <span style={{ 
                      color: new Date(selectedInvoice.dueDate) < new Date() ? '#e74c3c' : '#f39c12',
                      fontWeight: 'bold'
                    }}>
                      {new Date(selectedInvoice.dueDate) < new Date() ? ' Gecikmiş' : ' Bekliyor'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Ödeme Tutarı (₺)</label>
              <input
                type="number"
                className="form-input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                step="0.01"
                min="0.01"
                max={selectedInvoice?.total}
                required
              />
              {selectedInvoice && (
                <small style={{ color: '#6c757d' }}>
                  Maksimum: {formatCurrency(selectedInvoice.total)}
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Ödeme Yöntemi</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Payment['paymentMethod'] })}
                required
              >
                <option value="cash">💵 Nakit</option>
                <option value="credit_card">💳 Kredi Kartı</option>
                <option value="bank_transfer">🏦 Havale/EFT</option>
                <option value="check">📝 Çek</option>
              </select>
              <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                {getPaymentMethodRequirements()}
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                İşlem/Referans Numarası
                {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'bank_transfer') && (
                  <span style={{ color: '#e74c3c' }}> *</span>
                )}
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                placeholder={
                  formData.paymentMethod === 'credit_card' ? 'Kredi kartı işlem no...' :
                  formData.paymentMethod === 'bank_transfer' ? 'Dekont numarası...' :
                  formData.paymentMethod === 'check' ? 'Çek numarası...' :
                  'İsteğe bağlı...'
                }
                required={formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'bank_transfer'}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notlar (İsteğe bağlı)</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ödeme ile ilgili notlar..."
                rows={3}
              />
            </div>
          </div>

          {formData.amount && selectedInvoice && (
            <div style={{ 
              border: '2px solid #27ae60', 
              borderRadius: '8px', 
              padding: '1rem', 
              backgroundColor: '#f8fff8',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#27ae60', marginBottom: '0.5rem' }}>Ödeme Özeti</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>Ödeme Tutarı:</div>
                <div><strong>{formatCurrency(parseFloat(formData.amount) || 0)}</strong></div>
                
                <div>Kalan Tutar:</div>
                <div>
                  <strong>
                    {formatCurrency(selectedInvoice.total - (parseFloat(formData.amount) || 0))}
                  </strong>
                </div>
                
                <div style={{ borderTop: '1px solid #27ae60', paddingTop: '0.5rem', color: '#27ae60' }}>
                  Fatura Durumu:
                </div>
                <div style={{ borderTop: '1px solid #27ae60', paddingTop: '0.5rem', color: '#27ae60' }}>
                  <strong>
                    {(parseFloat(formData.amount) || 0) >= selectedInvoice.total ? 'Tamamen Ödenecek' : 'Kısmi Ödeme'}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="action-button secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="action-button success" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Ödeme Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 