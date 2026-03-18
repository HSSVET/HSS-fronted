import React, { useState, useEffect } from 'react';
import ReminderManagement from './ReminderManagement';
import { ReminderService, SystemStatus } from '../services/reminderService';
import './RemindersPage.css';

const RemindersPage: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

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

    } catch (error) {
      console.error('Sistem verileri alınırken hata:', error);
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
        <h1>Otomatik Hatırlatma Sistemi</h1>
        <p className="page-subtitle">
          Randevu ve aşı hatırlatmalarını otomatik olarak yönetin
        </p>
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
