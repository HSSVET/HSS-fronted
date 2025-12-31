import React, { useState, useEffect } from 'react';
import { ReminderService, Reminder } from '../services/reminderService';
import './ReminderSettings.css';

interface ReminderSettingsProps {
  appointmentId: number;
  onClose?: () => void;
}

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({ appointmentId, onClose }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReminders();
  }, [appointmentId]);

  const loadReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReminderService.getRemindersByAppointmentId(appointmentId);
      if (response.success) {
        setReminders(response.data);
      } else {
        setError(response.error || 'Hatırlatmalar yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (reminderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReminderService.sendReminder(reminderId);
      if (response.success) {
        await loadReminders();
      } else {
        setError(response.error || 'Hatırlatma gönderilemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReminder = async (reminderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReminderService.cancelReminder(reminderId);
      if (response.success) {
        await loadReminders();
      } else {
        setError(response.error || 'Hatırlatma iptal edilemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Reminder['status']) => {
    const statusMap = {
      PENDING: { label: 'Bekliyor', className: 'status-pending' },
      SENT: { label: 'Gönderildi', className: 'status-sent' },
      DELIVERED: { label: 'Teslim Edildi', className: 'status-delivered' },
      FAILED: { label: 'Başarısız', className: 'status-failed' },
      CANCELLED: { label: 'İptal Edildi', className: 'status-cancelled' },
    };

    const statusInfo = statusMap[status];
    return (
      <span className={`status-badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getChannelLabel = (channel: Reminder['channel']) => {
    const channelMap = {
      EMAIL: 'E-posta',
      SMS: 'SMS',
      PUSH: 'Push Bildirimi',
    };
    return channelMap[channel];
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="reminder-settings">
      <div className="reminder-settings-header">
        <h3>Randevu Hatırlatmaları</h3>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && reminders.length === 0 ? (
        <div className="loading">Yükleniyor...</div>
      ) : reminders.length === 0 ? (
        <div className="no-reminders">Bu randevu için hatırlatma bulunmamaktadır.</div>
      ) : (
        <div className="reminders-list">
          {reminders.map((reminder) => (
            <div key={reminder.reminderId} className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-header">
                  <span className="reminder-channel">{getChannelLabel(reminder.channel)}</span>
                  {getStatusBadge(reminder.status)}
                </div>
                <div className="reminder-details">
                  <div className="reminder-detail">
                    <strong>Gönderim Zamanı:</strong> {formatDateTime(reminder.sendTime)}
                  </div>
                  {reminder.recipientEmail && (
                    <div className="reminder-detail">
                      <strong>E-posta:</strong> {reminder.recipientEmail}
                    </div>
                  )}
                  {reminder.recipientPhone && (
                    <div className="reminder-detail">
                      <strong>Telefon:</strong> {reminder.recipientPhone}
                    </div>
                  )}
                  {reminder.sentAt && (
                    <div className="reminder-detail">
                      <strong>Gönderildi:</strong> {formatDateTime(reminder.sentAt)}
                    </div>
                  )}
                  {reminder.errorMessage && (
                    <div className="reminder-detail error">
                      <strong>Hata:</strong> {reminder.errorMessage}
                    </div>
                  )}
                  {reminder.retryCount > 0 && (
                    <div className="reminder-detail">
                      <strong>Yeniden Deneme:</strong> {reminder.retryCount}
                    </div>
                  )}
                </div>
                {reminder.message && (
                  <div className="reminder-message">
                    <strong>Mesaj:</strong>
                    <pre>{reminder.message}</pre>
                  </div>
                )}
              </div>
              <div className="reminder-actions">
                {reminder.status === 'PENDING' && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSendReminder(reminder.reminderId)}
                      disabled={loading}
                    >
                      Şimdi Gönder
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleCancelReminder(reminder.reminderId)}
                      disabled={loading}
                    >
                      İptal Et
                    </button>
                  </>
                )}
                {reminder.status === 'FAILED' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSendReminder(reminder.reminderId)}
                    disabled={loading}
                  >
                    Tekrar Dene
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="reminder-settings-footer">
        <button className="btn btn-secondary" onClick={loadReminders} disabled={loading}>
          Yenile
        </button>
      </div>
    </div>
  );
};

