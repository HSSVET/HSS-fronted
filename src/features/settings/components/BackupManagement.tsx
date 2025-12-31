import React, { useState, useEffect } from 'react';
import { BackupService, BackupRecord, BackupType } from '../services/backupService';
import './BackupManagement.css';

export const BackupManagement: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  useEffect(() => {
    loadBackups();
  }, [showCompletedOnly]);

  const loadBackups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = showCompletedOnly
        ? await BackupService.getCompletedBackups()
        : await BackupService.getAllBackups();

      if (response.success) {
        setBackups(response.data);
      } else {
        setError(response.error || 'Backup kayıtları yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (type: BackupType) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (type) {
        case 'FULL':
          response = await BackupService.createFullBackup();
          break;
        case 'DATABASE':
          response = await BackupService.createDatabaseBackup();
          break;
        case 'FILES':
          response = await BackupService.createFilesBackup();
          break;
        default:
          throw new Error('Geçersiz backup tipi');
      }

      if (response.success) {
        alert(`${type} backup başarıyla başlatıldı`);
        await loadBackups();
      } else {
        setError(response.error || 'Backup oluşturulamadı');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    if (!window.confirm('Bu backup\'ı geri yüklemek istediğinizden emin misiniz? Bu işlem mevcut verileri değiştirebilir.')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await BackupService.restoreBackup(id);
      if (response.success) {
        alert('Backup başarıyla geri yüklendi');
      } else {
        setError(response.error || 'Backup geri yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu backup\'ı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await BackupService.deleteBackup(id);
      if (response.success) {
        await loadBackups();
      } else {
        setError(response.error || 'Backup silinemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getBackupTypeLabel = (type: BackupType): string => {
    const labels: Record<BackupType, string> = {
      FULL: 'Tam Backup',
      INCREMENTAL: 'Artımlı Backup',
      DATABASE: 'Veritabanı Backup',
      FILES: 'Dosya Backup',
    };
    return labels[type];
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      IN_PROGRESS: 'Devam Ediyor',
      COMPLETED: 'Tamamlandı',
      FAILED: 'Başarısız',
      DELETED: 'Silindi',
    };
    return labels[status] || status;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
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

  return (
    <div className="backup-management">
      <div className="backup-header">
        <h2>Backup Yönetimi</h2>
        <div className="backup-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleCreateBackup('FULL')}
            disabled={loading}
          >
            Tam Backup
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleCreateBackup('DATABASE')}
            disabled={loading}
          >
            Veritabanı Backup
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleCreateBackup('FILES')}
            disabled={loading}
          >
            Dosya Backup
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="backup-filters">
        <label>
          <input
            type="checkbox"
            checked={showCompletedOnly}
            onChange={(e) => setShowCompletedOnly(e.target.checked)}
          />
          Sadece Tamamlanan Backup'lar
        </label>
        <button
          className="btn btn-secondary btn-sm"
          onClick={loadBackups}
          disabled={loading}
        >
          Yenile
        </button>
      </div>

      {loading && backups.length === 0 ? (
        <div className="loading">Yükleniyor...</div>
      ) : backups.length === 0 ? (
        <div className="no-backups">Backup kaydı bulunmamaktadır.</div>
      ) : (
        <div className="backups-list">
          {backups.map((backup) => (
            <div key={backup.backupId} className={`backup-item ${backup.status}`}>
              <div className="backup-header-item">
                <div className="backup-title">
                  <strong>{backup.backupName}</strong>
                  <span className="backup-type">{getBackupTypeLabel(backup.backupType)}</span>
                </div>
                <div className="backup-badges">
                  <span className={`status-badge ${backup.status.toLowerCase()}`}>
                    {getStatusLabel(backup.status)}
                  </span>
                  {backup.verified && (
                    <span className="verified-badge">Doğrulanmış</span>
                  )}
                </div>
              </div>

              <div className="backup-details">
                <div className="detail-row">
                  <span className="detail-label">Oluşturulma:</span>
                  <span className="detail-value">{formatDateTime(backup.backupDate)}</span>
                </div>
                {backup.completedAt && (
                  <div className="detail-row">
                    <span className="detail-label">Tamamlanma:</span>
                    <span className="detail-value">{formatDateTime(backup.completedAt)}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Dosya Boyutu:</span>
                  <span className="detail-value">{formatFileSize(backup.fileSize)}</span>
                </div>
                {backup.filePath && (
                  <div className="detail-row">
                    <span className="detail-label">Dosya Yolu:</span>
                    <span className="detail-value">{backup.filePath}</span>
                  </div>
                )}
                {backup.notes && (
                  <div className="detail-row">
                    <span className="detail-label">Notlar:</span>
                    <span className="detail-value">{backup.notes}</span>
                  </div>
                )}
              </div>

              <div className="backup-actions-item">
                {backup.status === 'COMPLETED' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleRestore(backup.backupId)}
                    disabled={loading}
                  >
                    Geri Yükle
                  </button>
                )}
                {backup.status !== 'DELETED' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(backup.backupId)}
                    disabled={loading}
                  >
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

