import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppointmentRecord } from '../../appointments/services/appointmentService';
import '../styles/ProfileWidgets.css';

interface MyAppointmentsWidgetProps {
  appointments: AppointmentRecord[];
}

const MyAppointmentsWidget: React.FC<MyAppointmentsWidgetProps> = ({ appointments }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 5);

  const handleViewAll = () => {
    if (slug) {
      navigate(`/clinic/${slug}/appointments`);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      SCHEDULED: { label: 'Planlandı', className: 'status-scheduled' },
      CONFIRMED: { label: 'Onaylandı', className: 'status-confirmed' },
      COMPLETED: { label: 'Tamamlandı', className: 'status-completed' },
      CANCELLED: { label: 'İptal', className: 'status-cancelled' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.label}</span>;
  };

  return (
    <div className="profile-widget ui-card panel">
      <div className="widget-header">
        <h3>
          <span className="widget-icon">📅</span>
          Yaklaşan Randevularım
        </h3>
        {upcomingAppointments.length > 0 && (
          <button onClick={handleViewAll} className="view-all-button">
            Tümünü Gör
          </button>
        )}
      </div>

      <div className="widget-content">
        {upcomingAppointments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>Yaklaşan randevu bulunmuyor</p>
          </div>
        ) : (
          <div className="appointments-list">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.appointmentId} className="appointment-item">
                <div className="appointment-info">
                  <div className="appointment-header">
                    <span className="appointment-subject">{appointment.subject}</span>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="appointment-details">
                    <span className="detail-item">
                      <span className="detail-icon">🐾</span>
                      {appointment.animalName}
                    </span>
                    <span className="detail-item">
                      <span className="detail-icon">👤</span>
                      {appointment.ownerName}
                    </span>
                  </div>
                  <div className="appointment-time">
                    <span className="time-icon">🕐</span>
                    {formatDateTime(appointment.dateTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsWidget;
