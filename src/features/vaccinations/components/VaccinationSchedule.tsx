import React, { useState, useEffect } from 'react';
import { VaccinationScheduleService, VaccinationSchedule } from '../services/vaccinationScheduleService';
import './VaccinationSchedule.css';

interface VaccinationScheduleProps {
  animalId?: number;
  showAll?: boolean;
}

export const VaccinationScheduleComponent: React.FC<VaccinationScheduleProps> = ({ 
  animalId, 
  showAll = false 
}) => {
  const [schedules, setSchedules] = useState<VaccinationSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'upcoming'>('all');

  useEffect(() => {
    loadSchedules();
  }, [animalId, filter]);

  const loadSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (animalId) {
        response = await VaccinationScheduleService.getSchedulesByAnimalId(animalId);
      } else if (filter === 'overdue') {
        response = await VaccinationScheduleService.getOverdueSchedules();
      } else if (filter === 'pending') {
        response = await VaccinationScheduleService.getPendingSchedules();
      } else if (filter === 'upcoming') {
        response = await VaccinationScheduleService.getUpcomingSchedules(30);
      } else {
        response = await VaccinationScheduleService.getPendingSchedules();
      }

      if (response.success) {
        setSchedules(response.data);
      } else {
        setError(response.error || 'Aşı takvimi yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    if (!animalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await VaccinationScheduleService.generateScheduleForAnimal(animalId);
      if (response.success) {
        await loadSchedules();
      } else {
        setError(response.error || 'Aşı takvimi oluşturulamadı');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (scheduleId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await VaccinationScheduleService.markScheduleAsCompleted(scheduleId);
      if (response.success) {
        await loadSchedules();
      } else {
        setError(response.error || 'Aşı tamamlanamadı');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: VaccinationSchedule['status']): string => {
    const labels: Record<VaccinationSchedule['status'], string> = {
      PENDING: 'Bekliyor',
      COMPLETED: 'Tamamlandı',
      CANCELLED: 'İptal Edildi',
      OVERDUE: 'Gecikmiş',
      SKIPPED: 'Atlandı',
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: VaccinationSchedule['priority']): string => {
    const labels: Record<VaccinationSchedule['priority'], string> = {
      LOW: 'Düşük',
      MEDIUM: 'Orta',
      HIGH: 'Yüksek',
      CRITICAL: 'Kritik',
    };
    return labels[priority];
  };

  const getPriorityClass = (priority: VaccinationSchedule['priority']): string => {
    return `priority-${priority.toLowerCase()}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const isOverdue = (schedule: VaccinationSchedule): boolean => {
    if (schedule.status === 'COMPLETED') return false;
    return new Date(schedule.scheduledDate) < new Date();
  };

  return (
    <div className="vaccination-schedule">
      <div className="schedule-header">
        <h3>Aşı Takvimi</h3>
        {animalId && (
          <button
            className="btn btn-primary"
            onClick={handleGenerateSchedule}
            disabled={loading}
          >
            Takvim Oluştur
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!animalId && showAll && (
        <div className="schedule-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tümü
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Bekleyenler
          </button>
          <button
            className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilter('overdue')}
          >
            Gecikenler
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Yaklaşanlar
          </button>
        </div>
      )}

      {loading && schedules.length === 0 ? (
        <div className="loading">Yükleniyor...</div>
      ) : schedules.length === 0 ? (
        <div className="no-schedules">Aşı takvimi bulunmamaktadır.</div>
      ) : (
        <div className="schedules-list">
          {schedules.map((schedule) => (
            <div
              key={schedule.scheduleId}
              className={`schedule-item ${getPriorityClass(schedule.priority)} ${isOverdue(schedule) ? 'overdue' : ''}`}
            >
              <div className="schedule-header-item">
                <div className="schedule-title">
                  <strong>{schedule.vaccineName}</strong>
                  {schedule.protocolName && (
                    <span className="protocol-name">({schedule.protocolName})</span>
                  )}
                </div>
                <div className="schedule-badges">
                  <span className={`status-badge status-${schedule.status.toLowerCase()}`}>
                    {getStatusLabel(schedule.status)}
                  </span>
                  <span className={`priority-badge ${getPriorityClass(schedule.priority)}`}>
                    {getPriorityLabel(schedule.priority)}
                  </span>
                </div>
              </div>

              <div className="schedule-details">
                <div className="detail-row">
                  <span className="detail-label">Hayvan:</span>
                  <span className="detail-value">{schedule.animalName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Planlanan Tarih:</span>
                  <span className="detail-value">{formatDate(schedule.scheduledDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Doz Numarası:</span>
                  <span className="detail-value">{schedule.doseNumber}</span>
                </div>
                {schedule.completedDate && (
                  <div className="detail-row">
                    <span className="detail-label">Tamamlanma Tarihi:</span>
                    <span className="detail-value">{formatDate(schedule.completedDate)}</span>
                  </div>
                )}
                {schedule.notes && (
                  <div className="detail-row">
                    <span className="detail-label">Notlar:</span>
                    <span className="detail-value">{schedule.notes}</span>
                  </div>
                )}
              </div>

              {schedule.status === 'PENDING' && (
                <div className="schedule-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleMarkCompleted(schedule.scheduleId)}
                    disabled={loading}
                  >
                    Tamamlandı İşaretle
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="schedule-footer">
        <button className="btn btn-secondary" onClick={loadSchedules} disabled={loading}>
          Yenile
        </button>
      </div>
    </div>
  );
};
