import React, { useState } from 'react';
import { Product, ProductCategory, ProductUnit } from '../types';
import { stockService } from '../services/stockService';
import '../styles/AddProductModal.css';

interface AddProductModalProps {
    onClose: () => void;
    onProductAdded: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: ProductCategory.MEDICATION,
        unit: ProductUnit.PIECE,
        currentStock: 0,
        minStockLevel: 0,
        expirationDate: '',
        supplier: '',
        price: 0,
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = 'Ürün adı gereklidir';
        if (!formData.code.trim()) newErrors.code = 'Ürün kodu gereklidir';
        if (!formData.supplier.trim()) newErrors.supplier = 'Tedarikçi adı gereklidir';
        if (!formData.expirationDate) newErrors.expirationDate = 'Son kullanma tarihi gereklidir';
        if (formData.currentStock < 0) newErrors.currentStock = 'Stok miktarı negatif olamaz';
        if (formData.minStockLevel < 0) newErrors.minStockLevel = 'Minimum stok seviyesi negatif olamaz';
        if (formData.price < 0) newErrors.price = 'Fiyat negatif olamaz';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            await stockService.createProduct(formData);
            onProductAdded();
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Ürün eklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'currentStock' || name === 'minStockLevel' || name === 'price'
                ? parseFloat(value) || 0
                : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Yeni Ürün Ekle</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Ürün Adı *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                placeholder="Ürün adını girin"
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="code" className="form-label">Ürün Kodu *</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className={`form-input ${errors.code ? 'error' : ''}`}
                                placeholder="Ürün kodunu girin"
                            />
                            {errors.code && <span className="error-message">{errors.code}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="category" className="form-label">Kategori</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value={ProductCategory.MEDICATION}>Medication</option>
                                <option value={ProductCategory.VACCINE}>Vaccine</option>
                                <option value={ProductCategory.SUPPLY}>Supply</option>
                                <option value={ProductCategory.EQUIPMENT}>Equipment</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="unit" className="form-label">Birim</label>
                            <select
                                id="unit"
                                name="unit"
                                value={formData.unit}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value={ProductUnit.VIAL}>Vial</option>
                                <option value={ProductUnit.BOTTLE}>Bottle</option>
                                <option value={ProductUnit.BOX}>Box</option>
                                <option value={ProductUnit.PIECE}>Adet</option>
                                <option value={ProductUnit.KIT}>Kit</option>
                                <option value={ProductUnit.TABLET}>Tablet</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="currentStock" className="form-label">Mevcut Stok</label>
                            <input
                                type="number"
                                id="currentStock"
                                name="currentStock"
                                value={formData.currentStock}
                                onChange={handleInputChange}
                                className={`form-input ${errors.currentStock ? 'error' : ''}`}
                                min="0"
                                step="1"
                            />
                            {errors.currentStock && <span className="error-message">{errors.currentStock}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="minStockLevel" className="form-label">Minimum Stok Seviyesi</label>
                            <input
                                type="number"
                                id="minStockLevel"
                                name="minStockLevel"
                                value={formData.minStockLevel}
                                onChange={handleInputChange}
                                className={`form-input ${errors.minStockLevel ? 'error' : ''}`}
                                min="0"
                                step="1"
                            />
                            {errors.minStockLevel && <span className="error-message">{errors.minStockLevel}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="expirationDate" className="form-label">Son Kullanma Tarihi *</label>
                            <input
                                type="date"
                                id="expirationDate"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleInputChange}
                                className={`form-input ${errors.expirationDate ? 'error' : ''}`}
                            />
                            {errors.expirationDate && <span className="error-message">{errors.expirationDate}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="supplier" className="form-label">Tedarikçi *</label>
                            <input
                                type="text"
                                id="supplier"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleInputChange}
                                className={`form-input ${errors.supplier ? 'error' : ''}`}
                                placeholder="Tedarikçi adını girin"
                            />
                            {errors.supplier && <span className="error-message">{errors.supplier}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="price" className="form-label">Fiyat (TL)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={`form-input ${errors.price ? 'error' : ''}`}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="description" className="form-label">Açıklama</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Ürün açıklaması (opsiyonel)"
                            rows={3}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            İptal
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal; 