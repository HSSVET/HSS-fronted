import React, { useState, useEffect } from 'react';
import { ReportScheduleService, ReportSchedule, ReportFrequency, ReportType } from '../services/reportScheduleService';
import './ReportScheduler.css';

export const ReportScheduler: React.FC = () => {
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, [showActiveOnly]);

  const loadSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = showActiveOnly
        ? await ReportScheduleService.getActiveSchedules()
        : await ReportScheduleService.getAllSchedules();

      if (response.success) {
        setSchedules(response.data);
      } else {
        setError(response.error || 'Rapor zamanlamaları yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReportScheduleService.executeSchedule(id);
      if (response.success) {
        alert('Rapor başarıyla oluşturuldu');
        await loadSchedules();
      } else {
        setError(response.error || 'Rapor oluşturulamadı');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu rapor zamanlamasını silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await ReportScheduleService.deleteSchedule(id);
      if (response.success) {
        await loadSchedules();
      } else {
        setError(response.error || 'Zamanlama silinemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (schedule: ReportSchedule) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReportScheduleService.updateSchedule(schedule.reportId, {
        isActive: !schedule.isActive,
      });

      if (response.success) {
        await loadSchedules();
      } else {
        setError(response.error || 'Zamanlama güncellenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyLabel = (frequency: ReportFrequency): string => {
    const labels: Record<ReportFrequency, string> = {
      DAILY: 'Günlük',
      WEEKLY: 'Haftalık',
      MONTHLY: 'Aylık',
      QUARTERLY: 'Üç Aylık',
      YEARLY: 'Yıllık',
      CUSTOM: 'Özel',
    };
    return labels[frequency];
  };

  const getReportTypeLabel = (type: ReportType): string => {
    const labels: Record<ReportType, string> = {
      GENERAL: 'Genel',
      FINANCIAL: 'Finansal',
      MEDICAL: 'Tıbbi',
      INVENTORY: 'Envanter',
      APPOINTMENT: 'Randevu',
    };
    return labels[type];
  };

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="report-scheduler">
      <div className="scheduler-header">
        <h2>Rapor Zamanlamaları</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          Yeni Zamanlama
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="scheduler-filters">
        <label>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />
          Sadece Aktif Zamanlamalar
        </label>
        <button
          className="btn btn-secondary btn-sm"
          onClick={loadSchedules}
          disabled={loading}
        >
          Yenile
        </button>
      </div>

      {loading && schedules.length === 0 ? (
        <div className="loading">Yükleniyor...</div>
      ) : schedules.length === 0 ? (
        <div className="no-schedules">Rapor zamanlaması bulunmamaktadır.</div>
      ) : (
        <div className="schedules-list">
          {schedules.map((schedule) => (
            <div
              key={schedule.reportId}
              className={`schedule-item ${!schedule.isActive ? 'inactive' : ''}`}
            >
              <div className="schedule-header-item">
                <div className="schedule-title">
                  <strong>{schedule.name}</strong>
                  <span className="schedule-type">
                    {getReportTypeLabel(schedule.reportType)} - {getFrequencyLabel(schedule.frequency)}
                  </span>
                </div>
                <div className="schedule-badges">
                  <span className={`status-badge ${schedule.isActive ? 'active' : 'inactive'}`}>
                    {schedule.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>

              <div className="schedule-details">
                {schedule.description && (
                  <div className="detail-row">
                    <span className="detail-label">Açıklama:</span>
                    <span className="detail-value">{schedule.description}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Son Çalıştırma:</span>
                  <span className="detail-value">{formatDateTime(schedule.lastRun)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Sonraki Çalıştırma:</span>
                  <span className="detail-value">{formatDateTime(schedule.nextRun)}</span>
                </div>
                {schedule.cronExpression && (
                  <div className="detail-row">
                    <span className="detail-label">Cron İfadesi:</span>
                    <span className="detail-value">{schedule.cronExpression}</span>
                  </div>
                )}
                {schedule.emailRecipients && schedule.emailRecipients.length > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">E-posta Alıcıları:</span>
                    <span className="detail-value">{schedule.emailRecipients.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="schedule-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleExecute(schedule.reportId)}
                  disabled={loading}
                >
                  Şimdi Çalıştır
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleToggleActive(schedule)}
                  disabled={loading}
                >
                  {schedule.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(schedule.reportId)}
                  disabled={loading}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Yeni Rapor Zamanlaması</h3>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Rapor zamanlaması oluşturma formu burada olacak.</p>
              <p className="info-text">
                Şu anda basit bir görünüm gösteriliyor. Detaylı form implementasyonu için
                ayrı bir component oluşturulabilir.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

