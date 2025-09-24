import React, { useState, useEffect } from 'react';
import { vaccinationService } from '../services/vaccinationService';
import { VaccineStockAlert } from '../types/vaccination';

const StockNotifications: React.FC = () => {
    const [alerts, setAlerts] = useState<VaccineStockAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
<<<<<<< HEAD
            setLoading(true);
            const response = await vaccinationService.getStockAlerts();
            setAlerts(response.data);
=======
                setLoading(true);
                const alertData = await vaccinationService.getVaccineStockAlerts();
                setAlerts(alertData);
>>>>>>> 7dd163e (Envanter sayfası ve aşı sayfası için router bağlantıları yapıldı.)
            } catch (error) {
                console.error('Stok uyarıları yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    const getAlertIcon = (alertType: string) => {
        const icons = {
            low_stock: '📦',
            expiring_soon: '⏰',
            expired: '❌'
        };
        return (icons as any)[alertType] || '⚠️';
    };

    const getAlertTypeText = (alertType: string) => {
        const types = {
            low_stock: 'Düşük Stok',
            expiring_soon: 'Yakında Sona Erecek',
            expired: 'Süresi Dolmuş'
        };
        return (types as any)[alertType] || alertType;
    };

    const handleOrderStock = (vaccineId: string) => {
        alert(`${vaccineId} ID'li aşı için sipariş talebi oluşturuldu.`);
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('tr-TR');
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div>Stok bildirimleri yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="stock-alerts">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '0 20px'
            }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>Aşı Stok Bildirim Merkezi</h2>
                <div style={{
                    background: '#f8f9fa',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#6c757d'
                }}>
                    {alerts.filter(a => !a.isRead).length} okunmamış bildirim
                </div>
            </div>

            {alerts.length === 0 ? (
                <div className="empty-state">
                    <h3>Stok bildirimi bulunmuyor</h3>
                    <p>Şu anda herhangi bir stok uyarısı bulunmamaktadır.</p>
                </div>
            ) : (
                <div style={{ padding: '0 20px' }}>
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="alert-item"
                            style={{
                                borderLeftColor: alert.alertType === 'expired' ? '#dc3545' :
                                    alert.alertType === 'expiring_soon' ? '#ffc107' : '#fd7e14'
                            }}
                        >
                            <div className="alert-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '18px' }}>{getAlertIcon(alert.alertType)}</span>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#856404',
                                        background: '#fff3cd',
                                        padding: '2px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        {getAlertTypeText(alert.alertType)}
                                    </span>
                                    {!alert.isRead && (
                                        <span style={{
                                            background: '#dc3545',
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            fontWeight: '600'
                                        }}>
                                            YENİ
                                        </span>
                                    )}
                                </div>

                                <div className="alert-message">
                                    {alert.message}
                                </div>

                                <div style={{ display: 'flex', gap: '15px', marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
                                    <span>Mevcut Stok: {alert.currentStock}</span>
                                    <span>Minimum Stok: {alert.minimumStock}</span>
                                    <span>Tarih: {formatDate(alert.createdDate)}</span>
                                </div>
                            </div>

                            <div className="alert-actions">
                                <button
                                    className="alert-btn order"
                                    onClick={() => handleOrderStock(alert.vaccineId)}
                                >
                                    📋 Sipariş Ver
                                </button>
                                <button className="alert-btn" style={{
                                    background: '#28a745',
                                    color: 'white'
                                }}>
                                    ✓ Okundu İşaretle
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Özet İstatistikler */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                margin: '30px 20px 0',
                padding: '20px 0',
                borderTop: '1px solid #e9ecef'
            }}>
                <div style={{
                    background: '#fff3cd',
                    padding: '15px',
                    borderRadius: '6px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#856404', marginBottom: '5px' }}>
                        {alerts.filter(a => a.alertType === 'low_stock').length}
                    </div>
                    <div style={{ color: '#856404', fontSize: '14px' }}>Düşük Stok Uyarısı</div>
                </div>

                <div style={{
                    background: '#f8d7da',
                    padding: '15px',
                    borderRadius: '6px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#721c24', marginBottom: '5px' }}>
                        {alerts.filter(a => a.alertType === 'expired').length}
                    </div>
                    <div style={{ color: '#721c24', fontSize: '14px' }}>Süresi Dolmuş</div>
                </div>

                <div style={{
                    background: '#d1ecf1',
                    padding: '15px',
                    borderRadius: '6px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#0c5460', marginBottom: '5px' }}>
                        {alerts.filter(a => a.alertType === 'expiring_soon').length}
                    </div>
                    <div style={{ color: '#0c5460', fontSize: '14px' }}>Yakında Sona Erecek</div>
                </div>

                <div style={{
                    background: '#d4edda',
                    padding: '15px',
                    borderRadius: '6px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#155724', marginBottom: '5px' }}>
                        {alerts.filter(a => a.isRead).length}
                    </div>
                    <div style={{ color: '#155724', fontSize: '14px' }}>Okunmuş Bildirim</div>
                </div>
            </div>
        </div>
    );
};

export default StockNotifications; 