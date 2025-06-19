import React, { useState, useEffect } from 'react';
import { useBilling } from '../../hooks/useBilling';
import { Invoice, InvoiceItem, Service, Patient } from '../../types';

interface CreateInvoiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ onClose, onSuccess }) => {
  const { services, createInvoice, loading } = useBilling();
  
  // Mock patients - gerçek uygulamada API'den gelecek
  const mockPatients: Patient[] = [
    { id: 1, name: 'Max', ownerName: 'Ahmet Yılmaz', ownerPhone: '+90 555 123 4567', ownerEmail: 'ahmet@email.com' },
    { id: 2, name: 'Pamuk', ownerName: 'Ayşe Demir', ownerPhone: '+90 555 987 6543', ownerEmail: 'ayse@email.com' },
    { id: 3, name: 'Karabaş', ownerName: 'Mehmet Kaya', ownerPhone: '+90 555 456 7890', ownerEmail: 'mehmet@email.com' },
  ];

  const [formData, setFormData] = useState({
    patientId: '',
    dueDate: '',
    notes: '',
    discount: 0,
    tax: 18
  });

  const [selectedItems, setSelectedItems] = useState<Omit<InvoiceItem, 'id' | 'total'>[]>([]);

  const addService = () => {
    setSelectedItems([...selectedItems, {
      serviceId: 0,
      service: services[0] || { id: 0, name: '', description: '', price: 0, category: 'examination' },
      quantity: 1,
      unitPrice: 0,
      discount: 0
    }]);
  };

  const removeService = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateServiceItem = (index: number, field: string, value: any) => {
    const updated = [...selectedItems];
    if (field === 'serviceId') {
      const service = services.find(s => s.id === parseInt(value));
      if (service) {
        updated[index] = {
          ...updated[index],
          serviceId: service.id,
          service,
          unitPrice: service.price
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setSelectedItems(updated);
  };

  const calculateItemTotal = (item: Omit<InvoiceItem, 'id' | 'total'>) => {
    const subtotal = item.quantity * item.unitPrice;
    return subtotal - item.discount;
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const discountAmount = formData.discount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * formData.tax) / 100;
    const total = taxableAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || selectedItems.length === 0) {
      alert('Lütfen hasta seçin ve en az bir hizmet ekleyin');
      return;
    }

    const selectedPatient = mockPatients.find(p => p.id === parseInt(formData.patientId));
    if (!selectedPatient) return;

    const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

    const invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'> = {
      patientId: parseInt(formData.patientId),
      patient: selectedPatient,
      issueDate: new Date(),
      dueDate: new Date(formData.dueDate),
      items: selectedItems.map((item, index) => ({
        ...item,
        id: index + 1,
        total: calculateItemTotal(item)
      })),
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      status: 'draft',
      notes: formData.notes,
      createdBy: 'Dr. Veteriner'
    };

    try {
      await createInvoice(invoiceData);
      onSuccess();
    } catch (error) {
      console.error('Fatura oluşturma hatası:', error);
    }
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Yeni Fatura Oluştur</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Hasta Seçin</label>
              <select
                className="form-select"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
              >
                <option value="">Hasta seçin...</option>
                {mockPatients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.ownerName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vade Tarihi</label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Genel İndirim (₺)</label>
              <input
                type="number"
                className="form-input"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">KDV Oranı (%)</label>
              <input
                type="number"
                className="form-input"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notlar</label>
            <textarea
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Fatura ile ilgili notlar..."
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Hizmetler</h3>
              <button type="button" className="action-button" onClick={addService}>
                + Hizmet Ekle
              </button>
            </div>

            {selectedItems.map((item, index) => (
              <div key={index} style={{ 
                border: '1px solid #dee2e6', 
                borderRadius: '6px', 
                padding: '1rem', 
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa'
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Hizmet</label>
                    <select
                      className="form-select"
                      value={item.serviceId}
                      onChange={(e) => updateServiceItem(index, 'serviceId', e.target.value)}
                      required
                    >
                      <option value="">Hizmet seçin...</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price}₺
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Miktar</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.quantity}
                      onChange={(e) => updateServiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Birim Fiyat (₺)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.unitPrice}
                      onChange={(e) => updateServiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">İndirim (₺)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.discount}
                      onChange={(e) => updateServiceItem(index, 'discount', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <strong>Toplam: {calculateItemTotal(item).toFixed(2)}₺</strong>
                  <button 
                    type="button" 
                    className="table-action-btn delete"
                    onClick={() => removeService(index)}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            border: '2px solid #667eea', 
            borderRadius: '8px', 
            padding: '1rem', 
            backgroundColor: '#f8f9ff',
            marginBottom: '1.5rem'
          }}>
            <h4>Fatura Özeti</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>Ara Toplam:</div>
              <div><strong>{subtotal.toFixed(2)}₺</strong></div>
              
              <div>Genel İndirim:</div>
              <div><strong>-{discountAmount.toFixed(2)}₺</strong></div>
              
              <div>KDV ({formData.tax}%):</div>
              <div><strong>{taxAmount.toFixed(2)}₺</strong></div>
              
              <div style={{ borderTop: '1px solid #667eea', paddingTop: '0.5rem', fontSize: '1.1rem' }}>
                Genel Toplam:
              </div>
              <div style={{ borderTop: '1px solid #667eea', paddingTop: '0.5rem', fontSize: '1.1rem' }}>
                <strong>{total.toFixed(2)}₺</strong>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="action-button secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="action-button" disabled={loading}>
              {loading ? 'Oluşturuluyor...' : 'Fatura Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 