import React, { useState } from 'react';
import { Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import '../styles/AppointmentList.css';
import { LegacyAppointment } from '../types/appointment';

interface AppointmentListProps {
  appointments: LegacyAppointment[];
  selectedDate: Date;
  onEdit: (appointment: LegacyAppointment) => void;
  onDelete: (id: string) => void;
  onNewAppointment: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  selectedDate,
  onEdit,
  onDelete,
  onNewAppointment,
  isLoading = false,
  errorMessage = null
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<LegacyAppointment | null>(null);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('tr-TR', options);
  };

  const handleDeleteClick = (appointment: LegacyAppointment): void => {
    setDeleteConfirm(appointment);
  };

  const confirmDelete = (): void => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = (): void => {
    setDeleteConfirm(null);
  };

  return (
    <div className="appointment-list">
      <div className="appointment-list-header">
        <h3>{formatDate(selectedDate)} Randevuları</h3>
        <button
          className="add-appointment-btn"
          onClick={onNewAppointment}
        >
          <Plus size={20} />
          Yeni Randevu
        </button>
      </div>

      {isLoading ? (
        <div className="appointments-loading">
          <p>Randevular yükleniyor...</p>
        </div>
      ) : errorMessage ? (
        <div className="appointments-loading appointments-loading--error">
          <p>{errorMessage}</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="no-appointments">
          <p>Bu tarih için henüz randevu bulunmuyor.</p>
          <button
            className="create-first-appointment"
            onClick={onNewAppointment}
          >
            İlk randevuyu oluştur
          </button>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appointment) => {
            const detailItems = [
              { label: 'Sahip', value: appointment.ownerName },
              { label: 'TC/Kimlik', value: appointment.patientId },
              { label: 'Telefon', value: appointment.phone },
              { label: 'Çip No', value: appointment.chipNumber },
              {
                label: 'Tür/Irk',
                value: [appointment.petType, appointment.breed].filter(Boolean).join(' / '),
              }
            ].filter((item) => Boolean(item.value));

            return (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-time">
                    {appointment.time}
                  </div>
                  <div className="appointment-actions">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(appointment)}
                      title="Düzenle"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(appointment)}
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="appointment-content">
                  <div className="patient-info">
                    <h4>{appointment.patientName}</h4>
                    {detailItems.length > 0 && (
                      <div className="patient-details">
                        {detailItems.map((item) => (
                          <span key={item.label} className="detail-item">
                            <strong>{item.label}:</strong> {item.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {appointment.description && (
                    <div className="appointment-description">
                      <strong>Açıklama:</strong> {appointment.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <div className="delete-confirm-header">
              <AlertTriangle size={24} className="warning-icon" />
              <h3>Randevuyu Sil</h3>
            </div>

            <div className="delete-confirm-content">
              <p>
                <strong>{deleteConfirm.patientName}</strong> adlı hayvanın
                <strong> {deleteConfirm.time}</strong> saatindeki randevusunu silmek istediğinizden emin misiniz?
              </p>
              <p className="warning-text">Bu işlem geri alınamaz.</p>
            </div>

            <div className="delete-confirm-actions">
              <button
                className="cancel-delete-btn"
                onClick={cancelDelete}
              >
                İptal
              </button>
              <button
                className="confirm-delete-btn"
                onClick={confirmDelete}
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList; 
