import React, { useState, useEffect } from 'react';
import { StockAlertService, StockAlert, StockAlertType } from '../services/stockAlertService';
import './StockAlerts.css';

export const StockAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<StockAlertType | 'ALL'>('ALL');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, [filterType, showResolved]);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filterType === 'ALL') {
        response = await StockAlertService.getActiveAlerts();
      } else {
        response = await StockAlertService.getAlertsByType(filterType);
      }

      if (response.success) {
        let filteredAlerts = response.data;
        if (!showResolved) {
          filteredAlerts = filteredAlerts.filter(alert => !alert.isResolved);
        }
        setAlerts(filteredAlerts);
      } else {
        setError(response.error || 'Stok uyarıları yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StockAlertService.resolveAlert(alertId, 'user');
      if (response.success) {
        await loadAlerts();
      } else {
        setError(response.error || 'Uyarı çözülemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAllForProduct = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await StockAlertService.resolveAlertsByProductId(productId, 'user');
      if (response.success) {
        await loadAlerts();
      } else {
        setError(response.error || 'Uyarılar çözülemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await StockAlertService.checkStockAlerts();
      if (response.success) {
        await loadAlerts();
      } else {
        setError(response.error || 'Stok kontrolü yapılamadı');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getAlertTypeLabel = (type: StockAlertType): string => {
    const labels: Record<StockAlertType, string> = {
      LOW_STOCK: 'Düşük Stok',
      CRITICAL_STOCK: 'Kritik Stok',
      OUT_OF_STOCK: 'Stok Tükendi',
      EXPIRING_SOON: 'Yakında Sona Erecek',
      EXPIRED: 'Süresi Doldu',
    };
    return labels[type];
  };

  const getAlertTypeClass = (type: StockAlertType): string => {
    const classes: Record<StockAlertType, string> = {
      LOW_STOCK: 'alert-low',
      CRITICAL_STOCK: 'alert-critical',
      OUT_OF_STOCK: 'alert-out',
      EXPIRING_SOON: 'alert-expiring',
      EXPIRED: 'alert-expired',
    };
    return classes[type];
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const alertTypeOptions: Array<{ value: StockAlertType | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Tümü' },
    { value: 'LOW_STOCK', label: 'Düşük Stok' },
    { value: 'CRITICAL_STOCK', label: 'Kritik Stok' },
    { value: 'OUT_OF_STOCK', label: 'Stok Tükendi' },
    { value: 'EXPIRING_SOON', label: 'Yakında Sona Erecek' },
    { value: 'EXPIRED', label: 'Süresi Doldu' },
  ];

  return (
    <div className="stock-alerts">
      <div className="stock-alerts-header">
        <h2>Stok Uyarıları</h2>
        <button
          className="btn btn-primary"
          onClick={handleManualCheck}
          disabled={loading}
        >
          Manuel Kontrol
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="stock-alerts-filters">
        <div className="filter-group">
          <label htmlFor="filterType">Uyarı Tipi:</label>
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as StockAlertType | 'ALL')}
            className="filter-select"
          >
            {alertTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
            />
            Çözülenleri Göster
          </label>
        </div>

        <button
          className="btn btn-secondary"
          onClick={loadAlerts}
          disabled={loading}
        >
          Yenile
        </button>
      </div>

      {loading && alerts.length === 0 ? (
        <div className="loading">Yükleniyor...</div>
      ) : alerts.length === 0 ? (
        <div className="no-alerts">
          {showResolved ? 'Hiç uyarı bulunmamaktadır.' : 'Aktif uyarı bulunmamaktadır.'}
        </div>
      ) : (
        <>
          <div className="alerts-summary">
            <span>Toplam {alerts.length} uyarı bulundu</span>
          </div>

          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert.alertId}
                className={`alert-item ${getAlertTypeClass(alert.alertType)} ${alert.isResolved ? 'resolved' : ''}`}
              >
                <div className="alert-header">
                  <div className="alert-type-badge">
                    {getAlertTypeLabel(alert.alertType)}
                  </div>
                  {alert.isResolved && (
                    <span className="resolved-badge">Çözüldü</span>
                  )}
                </div>

                <div className="alert-content">
                  <div className="alert-product">
                    <strong>{alert.productName}</strong>
                    {alert.productBarcode && (
                      <span className="barcode">Barkod: {alert.productBarcode}</span>
                    )}
                  </div>

                  <div className="alert-message">{alert.message}</div>

                  <div className="alert-details">
                    <div className="detail-item">
                      <strong>Mevcut Stok:</strong> {alert.currentStock}
                    </div>
                    {alert.minStock !== undefined && (
                      <div className="detail-item">
                        <strong>Minimum Stok:</strong> {alert.minStock}
                      </div>
                    )}
                    {alert.thresholdValue !== undefined && (
                      <div className="detail-item">
                        <strong>Eşik Değeri:</strong> {alert.thresholdValue}
                      </div>
                    )}
                    {alert.expirationDate && (
                      <div className="detail-item">
                        <strong>Son Kullanma:</strong> {formatDate(alert.expirationDate)}
                      </div>
                    )}
                    {alert.resolvedAt && (
                      <div className="detail-item">
                        <strong>Çözüldü:</strong> {formatDateTime(alert.resolvedAt)}
                        {alert.resolvedBy && ` (${alert.resolvedBy})`}
                      </div>
                    )}
                    <div className="detail-item">
                      <strong>Oluşturulma:</strong> {formatDateTime(alert.createdAt)}
                    </div>
                  </div>
                </div>

                {!alert.isResolved && (
                  <div className="alert-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleResolveAlert(alert.alertId)}
                      disabled={loading}
                    >
                      Çözüldü İşaretle
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleResolveAllForProduct(alert.productId)}
                      disabled={loading}
                    >
                      Ürünün Tüm Uyarılarını Çöz
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

