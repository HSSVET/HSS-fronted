import React, { useState, useEffect } from 'react';
import { StockAlert, AlertSeverity, AlertType } from '../types';
import { stockService } from '../services/stockService';
import '../styles/StockAlerts.css';

const StockAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<StockAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | AlertSeverity>('all');

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            setLoading(true);
            const response = await stockService.getAlerts();
            setAlerts(response.data);
        } catch (error) {
            console.error('Error loading alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAlertIcon = (type: AlertType) => {
        switch (type) {
            case AlertType.EXPIRED: return '⚠️';
            case AlertType.EXPIRING_SOON: return '🕒';
            case AlertType.CRITICAL_STOCK: return '🔴';
            case AlertType.LOW_STOCK: return '🟡';
            default: return '📋';
        }
    };

    const getAlertMessage = (type: AlertType) => {
        switch (type) {
            case AlertType.EXPIRED: return 'Süresi Geçen';
            case AlertType.EXPIRING_SOON: return 'Yakında Bitecek';
            case AlertType.CRITICAL_STOCK: return 'Kritik Stok';
            case AlertType.LOW_STOCK: return 'Düşük Stok';
            default: return 'Uyarı';
        }
    };

    const getSeverityClass = (severity: AlertSeverity) => {
        return `alert-${severity}`;
    };

    const filteredAlerts = filter === 'all'
        ? alerts
        : alerts.filter(alert => alert.severity === filter);

    const alertCounts = {
        expired: alerts.filter(a => a.type === AlertType.EXPIRED).length,
        expiring: alerts.filter(a => a.type === AlertType.EXPIRING_SOON).length,
        critical: alerts.filter(a => a.type === AlertType.CRITICAL_STOCK).length,
        low: alerts.filter(a => a.type === AlertType.LOW_STOCK).length
    };

    if (loading) {
        return (
            <div className="alerts-container">
                <div className="loading-state">Uyarılar yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="alerts-container">
            {/* Header */}
            <div className="alerts-header">
                <div className="section-info">
                    <h2 className="section-title">Stok Uyarıları</h2>
                    <p className="section-subtitle">Kritik stok seviyeleri ve son kullanma tarihi uyarıları</p>
                    <span className="alert-count">{filteredAlerts.length} aktif uyarı</span>
                </div>
            </div>

            {/* Alert Filters */}
            <div className="alert-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tüm Uyarılar
                </button>
                <button
                    className={`filter-btn ${filter === AlertSeverity.CRITICAL ? 'active' : ''}`}
                    onClick={() => setFilter(AlertSeverity.CRITICAL)}
                >
                    Kritik
                </button>
                <button
                    className={`filter-btn ${filter === AlertSeverity.HIGH ? 'active' : ''}`}
                    onClick={() => setFilter(AlertSeverity.HIGH)}
                >
                    Yüksek
                </button>
                <button
                    className={`filter-btn ${filter === AlertSeverity.MEDIUM ? 'active' : ''}`}
                    onClick={() => setFilter(AlertSeverity.MEDIUM)}
                >
                    Orta
                </button>
            </div>

            {/* Alerts Table */}
            <div className="alerts-table-container">
                <table className="alerts-table">
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
                        {filteredAlerts.map((alert) => (
                            <tr key={alert.id} className={`alert-row ${getSeverityClass(alert.severity)}`}>
                                <td className="alert-icon">
                                    <span className="icon">{getAlertIcon(alert.type)}</span>
                                </td>
                                <td className="alert-product">
                                    <div className="product-info">
                                        <span className="product-name">{alert.productName}</span>
                                        <span className="product-code">{alert.productCode}</span>
                                    </div>
                                </td>
                                <td className="alert-type">
                                    <span className={`alert-badge ${getSeverityClass(alert.severity)}`}>
                                        {getAlertMessage(alert.type)}
                                    </span>
                                </td>
                                <td className="alert-message">{alert.message}</td>
                                <td className="alert-date">
                                    {new Date(alert.date).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="alert-actions">
                                    <button className="action-btn view-btn" title="Ürünü Görüntüle">
                                        <span className="icon-view"></span>
                                    </button>
                                    <button className="action-btn order-btn" title="Sipariş Ver">
                                        <span className="icon-order"></span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAlerts.length === 0 && (
                    <div className="empty-state">
                        <p>Hiç uyarı bulunamadı.</p>
                    </div>
                )}
            </div>

            {/* Alert Stats */}
            <div className="alert-stats">
                <div className="stat-item">
                    <span className="stat-value">{alertCounts.expired}</span>
                    <span className="stat-label">Süresi Geçen</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{alertCounts.expiring}</span>
                    <span className="stat-label">Yakında Bitecek</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{alertCounts.critical}</span>
                    <span className="stat-label">Kritik Stok</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{alertCounts.low}</span>
                    <span className="stat-label">Düşük Stok</span>
                </div>
            </div>
        </div>
    );
};

export default StockAlerts; 