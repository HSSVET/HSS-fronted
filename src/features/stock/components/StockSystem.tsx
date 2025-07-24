import React, { useState, useEffect } from 'react';
import { stockService } from '../services/stockService';
import { StockStats } from '../types';
import StockDashboard from './StockDashboard';
import ProductList from './ProductList';
import StockAlerts from './StockAlerts';
import StockReports from './StockReports';
import StockMovements from './StockMovements';
import StockSettings from './StockSettings';
import '../styles/StockSystem.css';

type TabType = 'dashboard' | 'products' | 'alerts' | 'reports' | 'movements' | 'settings';

interface Tab {
    id: TabType;
    label: string;
    icon: string;
}

const StockSystem: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [stats, setStats] = useState<StockStats | null>(null);
    const [loading, setLoading] = useState(true);

    const tabs: Tab[] = [
        { id: 'dashboard', label: 'Ürün Listesi', icon: 'icon-list' },
        { id: 'alerts', label: 'Stok Uyarıları', icon: 'icon-alert' },
        { id: 'reports', label: 'Raporlar', icon: 'icon-chart' },
        { id: 'movements', label: 'Stok Hareketleri', icon: 'icon-movement' },
        { id: 'settings', label: 'Ayarlar', icon: 'icon-settings' }
    ];

    useEffect(() => {
        loadStockStats();
    }, []);

    const loadStockStats = async () => {
        try {
            setLoading(true);
            const statsData = await stockService.getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading stock stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <ProductList onStatsUpdate={loadStockStats} />;
            case 'alerts':
                return <StockAlerts />;
            case 'reports':
                return <StockReports />;
            case 'movements':
                return <StockMovements />;
            case 'settings':
                return <StockSettings />;
            default:
                return <ProductList onStatsUpdate={loadStockStats} />;
        }
    };

    const getStatColor = (value: number, type: 'positive' | 'negative' | 'warning' | 'danger') => {
        switch (type) {
            case 'positive': return 'var(--success-color)';
            case 'negative': return 'var(--error-color)';
            case 'warning': return 'var(--warning-color)';
            case 'danger': return 'var(--error-color)';
            default: return 'var(--primary-color)';
        }
    };

    if (loading) {
        return (
            <div className="stock-system loading">
                <div className="loading-spinner">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="stock-system">
            <div className="stock-system-container">
                {/* Header */}
                <div className="stock-system-header">
                    <div>
                        <h1 className="stock-system-title">Stok Yönetim Sistemi</h1>
                        <p className="stock-system-subtitle">Veteriner kliniği stok takibi ve yönetimi</p>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{stats.totalProducts}</div>
                            <div className="stat-label">Toplam Ürün</div>
                            <div className="stat-change positive">+12%</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.totalStockValue.toLocaleString('tr-TR')}</div>
                            <div className="stat-label">Toplam Stok Değeri</div>
                            <div className="stat-change positive">+8.5%</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.lowStockAlerts}</div>
                            <div className="stat-label">Düşük Stok Uyarısı</div>
                            <div className="stat-change warning">+3</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.expiredProducts}</div>
                            <div className="stat-label">Süresi Geçen Ürün</div>
                            <div className="stat-change danger">Acil</div>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className={`tab-icon ${tab.icon}`}></span>
                            <span className="tab-label">{tab.label}</span>
                            {tab.id === 'alerts' && stats && stats.lowStockAlerts > 0 && (
                                <span className="notification-badge">{stats.lowStockAlerts}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default StockSystem; 