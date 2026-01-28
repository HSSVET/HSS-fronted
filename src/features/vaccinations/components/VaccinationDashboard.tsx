import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccinationService } from '../services/vaccinationService';
import { VaccinationStats, VaccineStockAlert } from '../types/vaccination';
import VaccineStockInfo from './VaccineStockInfo';
import VaccineApplicationGuide from './VaccineApplicationGuide';
import VaccineHistory from './VaccineHistory';
import StockNotifications from './StockNotifications';
import VaccinationCard from './VaccinationCard';
import VaccineReminder from './VaccineReminder';
import '../styles/Vaccination.css';

const VaccinationDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'stock' | 'guide' | 'history' | 'card' | 'notifications' | 'reminders'>('stock');
    const [stats, setStats] = useState<VaccinationStats | null>(null);
    const [stockAlerts, setVaccineStockAlerts] = useState<VaccineStockAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, alertsData] = await Promise.all([
                    vaccinationService.getVaccinationStats(),
                    vaccinationService.getStockAlerts()
                ]);

                setStats(statsData.data);
                setVaccineStockAlerts(alertsData.data);
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const unreadAlerts = stockAlerts.filter(alert => !alert.isRead).length;

    const tabs = [
        { id: 'stock', label: 'Aşı Stok Bilgisi', icon: '📦' },
        { id: 'guide', label: 'Aşı Uygulama Rehberi', icon: '📋' },
        { id: 'history', label: 'Aşı Geçmişi', icon: '📊' },
        { id: 'card', label: 'Aşı Karnesi', icon: '🐾' },
        {
            id: 'notifications',
            label: 'Stok Bildirimleri',
            icon: '🔔',
            badge: unreadAlerts > 0 ? unreadAlerts : undefined
        },
        { id: 'reminders', label: 'Aşı Hatırlatıcıları', icon: '⏰' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'stock':
                return <VaccineStockInfo />;
            case 'guide':
                return <VaccineApplicationGuide />;
            case 'history':
                return <VaccineHistory />;
            case 'card':
                return <VaccinationCard />;
            case 'notifications':
                return <StockNotifications />;
            case 'reminders':
                return <VaccineReminder />;
            default:
                return <VaccineStockInfo />;
        }
    };

    if (loading) {
        return (
            <div className="vaccination-container">
                <div className="loading-state">
                    <div>Veriler yükleniyor...</div>
                </div>
            </div>
        );
    }



    return (
        <div className="vaccination-container">
            {/* Header */}
            <div className="vaccination-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="vaccination-title">Aşı Yönetim Sistemi</h1>
                <button
                    className="new-vaccination-btn" // You might want to define this class in CSS or use inline styles for now
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#92A78C', // Primary color match
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 600
                    }}
                    onClick={() => navigate('new')}
                >
                    + Yeni Aşı Kaydı
                </button>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="stats-overview" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#007bff', marginBottom: '5px' }}>
                            {stats.totalVaccines}
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '14px' }}>Toplam Aşı Türü</div>
                    </div>

                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#28a745', marginBottom: '5px' }}>
                            {stats.totalStock}
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '14px' }}>Toplam Stok</div>
                    </div>

                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#dc3545', marginBottom: '5px' }}>
                            {stats.lowStockAlerts}
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '14px' }}>Düşük Stok Uyarısı</div>
                    </div>

                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#17a2b8', marginBottom: '5px' }}>
                            {stats.totalAnimalsVaccinated}
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '14px' }}>Aşılanan Hayvan</div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="vaccination-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id as any)}
                    >
                        <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                        {tab.label}
                        {tab.badge && (
                            <span className="stock-alert-badge">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content fade-in">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default VaccinationDashboard; 