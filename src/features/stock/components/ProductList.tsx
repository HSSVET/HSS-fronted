import React, { useState, useEffect } from 'react';
import { Product, ProductFilters, ProductCategory } from '../types';
import { stockService } from '../services/stockService';
import AddProductModal from './AddProductModal';
import '../styles/ProductList.css';

interface ProductListProps {
    onStatsUpdate?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ onStatsUpdate }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ProductFilters>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, [filters]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await stockService.getProducts(filters);
            setProducts(response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setFilters({ ...filters, searchTerm: term });
    };

    const handleStatusFilter = (status: string) => {
        setFilters({ ...filters, status: status as any });
    };

    const handleCategoryFilter = (category: string) => {
        setFilters({
            ...filters,
            category: category === 'all' ? undefined : category as ProductCategory
        });
    };

    const getStockStatus = (product: Product) => {
        const isExpired = new Date(product.expirationDate) < new Date();
        const isCritical = product.currentStock <= product.minStockLevel * 0.5;
        const isLow = product.currentStock <= product.minStockLevel;

        if (isExpired) return { status: 'expired', label: 'Expired', class: 'status-expired' };
        if (isCritical) return { status: 'critical', label: 'Critical', class: 'status-critical' };
        if (isLow) return { status: 'low', label: 'Low', class: 'status-low' };
        return { status: 'good', label: 'Good', class: 'status-good' };
    };

    const getCategoryLabel = (category: ProductCategory) => {
        switch (category) {
            case ProductCategory.MEDICATION: return 'Medication';
            case ProductCategory.VACCINE: return 'Vaccine';
            case ProductCategory.SUPPLY: return 'Supply';
            case ProductCategory.EQUIPMENT: return 'Equipment';
            default: return category;
        }
    };

    const getUnitLabel = (unit: string) => {
        const unitMap: { [key: string]: string } = {
            'vial': 'vial',
            'bottle': 'bottle',
            'box': 'box',
            'piece': 'adet',
            'kit': 'kit',
            'tablet': 'tablet'
        };
        return unitMap[unit] || unit;
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                await stockService.deleteProduct(productId);
                await loadProducts();
                onStatsUpdate?.();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Ürün silinirken bir hata oluştu.');
            }
        }
    };

    const handleProductAdded = () => {
        loadProducts();
        onStatsUpdate?.();
        setShowAddModal(false);
    };

    if (loading) {
        return (
            <div className="product-list-container">
                <div className="loading-state">Ürünler yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            {/* Header */}
            <div className="product-list-header">
                <div className="section-info">
                    <h2 className="section-title">Ürün Envanteri</h2>
                    <p className="section-subtitle">Veteriner kliniği ürün stok durumu ve detayları</p>
                </div>
                <button
                    className="add-product-btn"
                    onClick={() => setShowAddModal(true)}
                >
                    <span className="btn-icon">+</span>
                    Yeni Ürün Ekle
                </button>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Ürün adı veya kodu ile ara..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <select
                        className="filter-select"
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        value={filters.category || 'all'}
                    >
                        <option value="all">Tüm Kategoriler</option>
                        <option value={ProductCategory.MEDICATION}>Medication</option>
                        <option value={ProductCategory.VACCINE}>Vaccine</option>
                        <option value={ProductCategory.SUPPLY}>Supply</option>
                        <option value={ProductCategory.EQUIPMENT}>Equipment</option>
                    </select>

                    <select
                        className="filter-select"
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        value={filters.status || 'all'}
                    >
                        <option value="all">Stok Durumu</option>
                        <option value="good">Good</option>
                        <option value="low">Low</option>
                        <option value="critical">Critical</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Ürün Adı</th>
                            <th>Ürün Kodu</th>
                            <th>Kategori</th>
                            <th>Birim</th>
                            <th>Stok Miktarı</th>
                            <th>Min. Stok</th>
                            <th>Son Kullanma</th>
                            <th>Tedarikçi</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const stockStatus = getStockStatus(product);
                            return (
                                <tr key={product.id} className="product-row">
                                    <td className="product-name">{product.name}</td>
                                    <td className="product-code">{product.code}</td>
                                    <td className="product-category">
                                        <span className={`category-badge category-${product.category}`}>
                                            {getCategoryLabel(product.category)}
                                        </span>
                                    </td>
                                    <td className="product-unit">{getUnitLabel(product.unit)}</td>
                                    <td className="stock-quantity">
                                        <span className={`stock-value ${stockStatus.class}`}>
                                            {product.currentStock}
                                        </span>
                                    </td>
                                    <td className="min-stock">{product.minStockLevel}</td>
                                    <td className="expiration-date">
                                        <span className={`date-value ${stockStatus.status === 'expired' ? 'expired' : ''}`}>
                                            {new Date(product.expirationDate).toLocaleDateString('tr-TR')}
                                        </span>
                                        <span className={`status-badge ${stockStatus.class}`}>
                                            {stockStatus.status === 'expired' ? 'Expired' :
                                                stockStatus.status === 'critical' ? 'Critical' :
                                                    stockStatus.status === 'low' ? 'Low' : 'Good'}
                                        </span>
                                    </td>
                                    <td className="supplier">{product.supplier}</td>
                                    <td className="actions">
                                        <button
                                            className="action-btn edit-btn"
                                            title="Düzenle"
                                        >
                                            <span className="icon-edit"></span>
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(product.id)}
                                            title="Sil"
                                        >
                                            <span className="icon-delete"></span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="empty-state">
                        <p>Hiç ürün bulunamadı.</p>
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onProductAdded={handleProductAdded}
                />
            )}
        </div>
    );
};

export default ProductList; 