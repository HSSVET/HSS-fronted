import React, { useState, useEffect } from 'react';
import { StockSettings as SettingsType } from '../types';
import { stockService } from '../services/stockService';
import '../styles/StockSettings.css';

const StockSettings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await stockService.getSettings();
            setSettings(response.data);
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;

        try {
            setSaving(true);
            await stockService.updateSettings(settings);
            alert('Ayarlar başarıyla kaydedildi.');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Ayarlar kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?')) {
            loadSettings();
        }
    };

    const updateSetting = (path: string, value: any) => {
        if (!settings) return;

        const newSettings = { ...settings };
        const keys = path.split('.');
        let current: any = newSettings;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        setSettings(newSettings);
    };

    if (loading) {
        return (
            <div className="settings-container">
                <div className="loading-state">Ayarlar yükleniyor...</div>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="settings-container">
                <div className="error-state">Ayarlar yüklenemedi.</div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            {/* Header */}
            <div className="settings-header">
                <div className="section-info">
                    <h2 className="section-title">⚙️ Stok Ayarları</h2>
                    <p className="section-subtitle">Otomatik uyarılar ve stok seviyesi ayarları</p>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="settings-sections">

                {/* Auto Alerts Section */}
                <div className="settings-section">
                    <h3 className="section-title">Otomatik Uyarılar</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Düşük stok uyarısı</span>
                            <span className="setting-description">Stok minimum seviyenin altına düştüğünde uyarı ver</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.autoAlerts.lowStock}
                                onChange={(e) => updateSetting('autoAlerts.lowStock', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Son kullanma tarihi uyarısı</span>
                            <span className="setting-description">Ürün son kullanma tarihi yaklaştığında uyarı ver</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.autoAlerts.expiration}
                                onChange={(e) => updateSetting('autoAlerts.expiration', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Otomatik sipariş önerisi</span>
                            <span className="setting-description">Stok düşük olduğunda otomatik sipariş önerisi göster</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.autoAlerts.autoOrder}
                                onChange={(e) => updateSetting('autoAlerts.autoOrder', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* Stock Levels Section */}
                <div className="settings-section">
                    <h3 className="section-title">Stok Seviyeleri</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Minimum stok uyarı seviyesi (%)</span>
                            <span className="setting-description">Bu yüzdenin altında uyarı verilir</span>
                        </div>
                        <div className="input-group">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={settings.stockLevels.minStockWarningPercentage}
                                onChange={(e) => updateSetting('stockLevels.minStockWarningPercentage', parseInt(e.target.value))}
                                className="number-input"
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Kritik stok seviyesi (%)</span>
                            <span className="setting-description">Bu yüzdenin altında kritik uyarı verilir</span>
                        </div>
                        <div className="input-group">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={settings.stockLevels.criticalStockPercentage}
                                onChange={(e) => updateSetting('stockLevels.criticalStockPercentage', parseInt(e.target.value))}
                                className="number-input"
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Son kullanma uyarı süresi (gün)</span>
                            <span className="setting-description">Bu gün sayısı öncesinde son kullanma uyarısı verilir</span>
                        </div>
                        <div className="input-group">
                            <input
                                type="number"
                                min="1"
                                max="365"
                                value={settings.stockLevels.expirationWarningDays}
                                onChange={(e) => updateSetting('stockLevels.expirationWarningDays', parseInt(e.target.value))}
                                className="number-input"
                            />
                            <span className="input-suffix">gün</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Action Buttons */}
            <div className="settings-actions">
                <button
                    className="btn-secondary"
                    onClick={handleReset}
                    disabled={saving}
                >
                    Varsayılana Dön
                </button>
                <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
            </div>
        </div>
    );
};

export default StockSettings; 