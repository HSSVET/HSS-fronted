import React, { useState, useEffect } from 'react';
import ReminderManagement from './ReminderManagement';
import { ReminderService, SystemStatus } from '../services/reminderService';
import './RemindersPage.css';

const RemindersPage: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReminders: 0,
    pendingCount: 0,
    sentCount: 0,
    failedCount: 0
  });

  useEffect(() => {
    fetchSystemData();
    // Her 30 saniyede bir verileri güncelle
    const interval = setInterval(fetchSystemData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      const statusResponse = await ReminderService.getSystemStatus();
      if (statusResponse.success && statusResponse.data) {
        setSystemStatus(statusResponse.data);
      }

      // İstatistikleri al (gerçek API implement edildiğinde)
      setStats({
        totalReminders: 156,
        pendingCount: 23,
        sentCount: 128,
        failedCount: 5
      });

    } catch (error) {
      console.error('Sistem verileri alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      let result;
      switch (action) {
        case 'process':
          result = await ReminderService.processReminders();
          break;
        case 'createAppointment':
          result = await ReminderService.createAppointmentReminders();
          break;
        case 'createVaccination':
          result = await ReminderService.createVaccinationReminders();
          break;
        case 'retryFailed':
          result = await ReminderService.retryFailedReminders();
          break;
        default:
          return;
      }

      if (result.success) {
        alert(result.message);
        fetchSystemData(); // Verileri yenile
      } else {
        alert(result.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      alert('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !systemStatus) {
    return (
      <div className="reminders-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Sistem bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reminders-page">
      <div className="page-header">
        <h1>🔔 Otomatik Hatırlatma Sistemi</h1>
        <p className="page-subtitle">
          Randevu ve aşı hatırlatmalarını otomatik olarak yönetin
        </p>
      </div>

      {/* Sistem Durumu Kartları */}
      <div className="status-cards">
        <div className="status-card">
          <div className="card-icon">🔄</div>
          <div className="card-content">
            <h3>Sistem Durumu</h3>
            <p className={`status ${systemStatus?.schedulerEnabled ? 'active' : 'inactive'}`}>
              {systemStatus?.schedulerEnabled ? 'Aktif' : 'Pasif'}
            </p>
          </div>
        </div>

        <div className="status-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Başarı Oranı</h3>
            <p className="success-rate">
              {systemStatus?.successRate?.toFixed(1) || '0'}%
            </p>
          </div>
        </div>

        <div className="status-card">
          <div className="card-icon">⏰</div>
          <div className="card-content">
            <h3>Beklemede</h3>
            <p className="pending-count">{stats.pendingCount}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Gönderildi</h3>
            <p className="sent-count">{stats.sentCount}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <h3>Başarısız</h3>
            <p className="failed-count">{stats.failedCount}</p>
          </div>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div className="quick-actions">
        <h2>🚀 Hızlı İşlemler</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>📋 Hatırlatmaları İşle</h3>
            <p>Beklemedeki tüm hatırlatmaları kontrol et ve gönder</p>
            <button 
              className="action-btn primary"
              onClick={() => handleAction('process')}
              disabled={loading}
            >
              {loading ? 'İşleniyor...' : 'Şimdi İşle'}
            </button>
          </div>

          <div className="action-card">
            <h3>📅 Randevu Hatırlatmaları</h3>
            <p>Yaklaşan randevular için yeni hatırlatmalar oluştur</p>
            <button 
              className="action-btn secondary"
              onClick={() => handleAction('createAppointment')}
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>

          <div className="action-card">
            <h3>💉 Aşı Hatırlatmaları</h3>
            <p>Aşı zamanı gelen hayvanlar için hatırlatma oluştur</p>
            <button 
              className="action-btn secondary"
              onClick={() => handleAction('createVaccination')}
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>

          <div className="action-card">
            <h3>🔄 Başarısızları Yeniden Dene</h3>
            <p>Başarısız olan hatırlatmaları tekrar göndermeyi dene</p>
            <button 
              className="action-btn warning"
              onClick={() => handleAction('retryFailed')}
              disabled={loading}
            >
              {loading ? 'Deneniyor...' : 'Yeniden Dene'}
            </button>
          </div>
        </div>
      </div>

      {/* Ana Hatırlatma Yönetimi Bileşeni */}
      <ReminderManagement showCreateButton={true} />

      {/* Son Güncelleme Bilgisi */}
      {systemStatus?.lastProcessTime && (
        <div className="last-update">
          <p>
            Son işlem: {new Date(systemStatus.lastProcessTime).toLocaleString('tr-TR')}
          </p>
        </div>
      )}
    </div>
  );
};

export default RemindersPage;
