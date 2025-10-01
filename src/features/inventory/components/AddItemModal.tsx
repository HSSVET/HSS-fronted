import React, { useState } from 'react';

interface AddItemModalProps {
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: 'medicine', // medicine or supply
    quantity: '',
    unit: '',
    price: '',
    supplier: '',
    expiryDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new item:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Yeni Ürün Ekle</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-item-form">
          <div className="form-group">
            <label htmlFor="type">Tür</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="medicine">İlaç</option>
              <option value="supply">Malzeme</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Ürün Adı</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Miktar</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit">Birim</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                required
              >
                <option value="">Seçin</option>
                <option value="adet">Adet</option>
                <option value="ml">ML</option>
                <option value="gr">Gram</option>
                <option value="kg">Kilogram</option>
                <option value="şişe">Şişe</option>
                <option value="kutu">Kutu</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Birim Fiyat (₺)</label>
            <input
              type="number"
              step="0.01"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="supplier">Tedarikçi</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              required
            />
          </div>

          {formData.type === 'medicine' && (
            <div className="form-group">
              <label htmlFor="expiryDate">Son Kullanma Tarihi</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>İptal</button>
            <button type="submit">Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal; 