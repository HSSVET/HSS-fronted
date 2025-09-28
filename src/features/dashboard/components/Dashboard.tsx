import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { CalendarWidget } from '../../../shared';
import { AnimalService, type AnimalRecord } from '../../animals/services/animalService';
import { AppointmentService, type AppointmentRecord } from '../../appointments/services/appointmentService';

interface DashboardStats {
  totalAnimals: number;
  todaysAppointments: number;
  clinicAnimals: number;
}

interface HospitalizedPatient {
  id: string;
  animalId: string;
  name: string;
  species: string;
  owner: string;
  admittedAt: string;
  status: string;
}

interface ActivityItem {
  id: string;
  animalId: string;
  time: string;
  animalName: string;
  ownerName: string;
  description: string;
}

const STATUS_LABELS = ['Stabil', 'Gözlem', 'Takipte', 'İyileşiyor'];

const formatDateDisplay = (value?: string | null) => {
  if (!value) return new Date().toLocaleDateString('tr-TR');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString('tr-TR');
  }
  return date.toLocaleDateString('tr-TR');
};

const formatTimeDisplay = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Stabil':
      return 'badge badge--ok';
    case 'Takipte':
      return 'badge badge--warning';
    case 'Gözlem':
      return 'badge';
    case 'İyileşiyor':
      return 'badge badge--ok';
    default:
      return 'badge';
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    todaysAppointments: 0,
    clinicAnimals: 0,
  });
  const [hospitalizedPatients, setHospitalizedPatients] = useState<HospitalizedPatient[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodayAppointments = async (): Promise<AppointmentRecord[]> => {
      try {
        const todayResponse = await AppointmentService.getTodayAppointments();
        if (todayResponse.success && todayResponse.data) {
          return todayResponse.data;
        }
      } catch (err) {
        console.warn('Bugünkü randevular alınamadı, tarih aralığı ile tekrar denenecek.', err);
      }

      try {
        const now = new Date();
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        const fallbackResponse = await AppointmentService.getAppointmentsByDateRange(start, end);
        if (fallbackResponse.success && fallbackResponse.data) {
          return fallbackResponse.data;
        }
      } catch (fallbackError) {
        console.error('Tarih aralığı fallback randevular alınamadı.', fallbackError);
      }

      return [];
    };

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [animalResponse, appointmentItems] = await Promise.all([
          AnimalService.getAnimals(0, 8),
          loadTodayAppointments(),
        ]);

        const animalItems: AnimalRecord[] =
          animalResponse.success && animalResponse.data ? animalResponse.data.items : [];

        const patients: HospitalizedPatient[] = animalItems.slice(0, 5).map((animal, index) => ({
          id: animal.id ? animal.id.toString() : `${Date.now()}-${index}`,
          animalId: animal.id ? animal.id.toString() : '',
          name: animal.name || 'İsimsiz',
          species: animal.species?.name || 'Bilinmiyor',
          owner: animal.owner?.name || 'Bilinmiyor',
          admittedAt: formatDateDisplay(animal.birthDate),
          status: STATUS_LABELS[index % STATUS_LABELS.length],
        }));

        const activities: ActivityItem[] = appointmentItems
          .slice()
          .sort((a, b) => {
            const dateA = new Date(a.dateTime || '').getTime();
            const dateB = new Date(b.dateTime || '').getTime();
            return dateB - dateA;
          })
          .slice(0, 6)
          .map((appointment, index) => {
            const generatedId = appointment.id ? appointment.id.toString() : `${Date.now()}-${index}`;
            const animalId = appointment.animal?.id ? appointment.animal.id.toString() : '';

            return {
              id: generatedId,
              animalId,
              time: formatTimeDisplay(appointment.dateTime),
              animalName: appointment.animal?.name || 'Hasta',
              ownerName: appointment.owner?.name || '',
              description: appointment.subject || 'Randevu',
            };
          });

        setStats({
          totalAnimals: animalResponse.data?.total ?? animalItems.length,
          todaysAppointments: appointmentItems.length,
          clinicAnimals: patients.length,
        });
        setHospitalizedPatients(patients);
        setRecentActivities(activities);
      } catch (err) {
        console.error('Dashboard verileri alınırken hata:', err);
        setError('Dashboard verileri alınırken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAnimalClick = (animalId: string) => {
    if (!animalId) {
      return;
    }
    navigate(`/animals/${animalId}`);
  };

  return (
    <div className="dashboard">
      <div className="topbar mb-3">
        <h1 className="ui-section-title">Veteriner Paneli</h1>
        <div className="topbar__spacer" />
        <button className="ui-button" style={{ marginRight: 8 }}>
          <span className="icon icon-plus"></span>
          Yeni Randevu
        </button>
        <button className="ui-button">
          <span className="icon icon-plus"></span>
          Yeni Hasta Kaydı
        </button>
      </div>

      {error && (
        <div className="ui-card panel" style={{ marginBottom: 16, padding: 16 }}>
          <span className="badge badge--danger">{error}</span>
        </div>
      )}

      <div className="stats-container grid gap-3" style={{ gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))' }}>
        <div className="ui-card panel ui-card--hover stat-card">
          <h3 className="muted">Toplam Aktif Hasta</h3>
          <div className="ui-stat-number">{loading ? '...' : stats.totalAnimals}</div>
        </div>
        <div className="ui-card panel ui-card--hover stat-card">
          <h3 className="muted">Bugünkü Randevular</h3>
          <div className="ui-stat-number">{loading ? '...' : stats.todaysAppointments}</div>
        </div>
        <div className="ui-card panel ui-card--hover stat-card">
          <h3 className="muted">Klinikte Bulunan Hayvanlar</h3>
          <div className="ui-stat-number">{loading ? '...' : stats.clinicAnimals}</div>
        </div>
      </div>

      <div className="widgets-container three-column grid grid--dashboard gap-3 grid--rows">
        <div className="widget ui-card panel hospitalized-patients-widget clickable-widget">
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-hospital"></span> Klinikte Yatan Hastalar</h2>
          </div>
          <div className="widget-content">
            {loading ? (
              <div className="muted">Yükleniyor...</div>
            ) : hospitalizedPatients.length === 0 ? (
              <div className="muted">Şu anda klinikte yatan hasta bulunmuyor.</div>
            ) : (
              <table className="hospitalized-patients-table table">
                <thead>
                  <tr>
                    <th>Hasta</th>
                    <th>Yatış Tarihi</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalizedPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <span
                          className="clickable-animal-name"
                          onClick={() => handleAnimalClick(patient.animalId || patient.id)}
                        >
                          {patient.name} ({patient.species})
                        </span>
                        <div className="muted" style={{ fontSize: 12 }}>Sahibi: {patient.owner}</div>
                      </td>
                      <td>{patient.admittedAt}</td>
                      <td><span className={getStatusBadgeClass(patient.status)}>{patient.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="widget ui-card panel recent-activity-widget clickable-widget">
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-paw"></span> Son Hasta Aktiviteleri</h2>
          </div>
          <div className="widget-content">
            {loading ? (
              <div className="muted">Yükleniyor...</div>
            ) : recentActivities.length === 0 ? (
              <div className="muted">Bugün gerçekleşen kayıt bulunmuyor.</div>
            ) : (
              <ul className="activity-list">
                {recentActivities.map((activity) => (
                  <li key={activity.id}>
                    <div className="activity-info">
                      <span className="activity-time">{activity.time}</span>
                      <span
                        className="activity-name clickable-animal-name"
                        onClick={() => handleAnimalClick(activity.animalId || activity.id)}
                      >
                        {activity.animalName}
                      </span>
                    </div>
                    <div className="activity-status">
                      {activity.description}
                      {activity.ownerName && (
                        <span className="muted" style={{ marginLeft: 4 }}>— {activity.ownerName}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="widget ui-card panel calendar-wrapper clickable-widget">
          <CalendarWidget />
        </div>

        <div className="widget ui-card panel low-stock-widget clickable-widget">
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-warning"></span> Düşük Stok Uyarıları</h2>
          </div>
          <div className="widget-content">
            <table className="stock-table table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Mevcut</th>
                  <th>Min.</th>
                </tr>
              </thead>
              <tbody>
                <tr className="critical">
                  <td>Amoksisilin 250mg</td>
                  <td>5</td>
                  <td>20</td>
                </tr>
                <tr className="warning">
                  <td>Kedi Aşıları</td>
                  <td>8</td>
                  <td>10</td>
                </tr>
                <tr className="critical">
                  <td>Cerrahi Eldiven (M)</td>
                  <td>12</td>
                  <td>50</td>
                </tr>
                <tr className="warning">
                  <td>Bandaj 2"</td>
                  <td>15</td>
                  <td>25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="widget ui-card panel lab-results-widget clickable-widget" onClick={() => navigate('/laboratory')}>
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-lab"></span> Bekleyen Laboratuvar Sonuçları</h2>
          </div>
          <div className="widget-content">
            <ul className="lab-list">
              <li>
                <div className="lab-info">
                  <span className="lab-patient">Bella (Köpek)</span>
                  <span className="lab-test">Tam Kan Sayımı</span>
                </div>
                <div className="lab-date">Bugün</div>
              </li>
              <li>
                <div className="lab-info">
                  <span className="lab-patient">Tekir (Kedi)</span>
                  <span className="lab-test">İdrar Tahlili</span>
                </div>
                <div className="lab-date">Yarın</div>
              </li>
              <li>
                <div className="lab-info">
                  <span className="lab-patient">Papatya (Tavşan)</span>
                  <span className="lab-test">Dışkı Analizi</span>
                </div>
                <div className="lab-date">15.06</div>
              </li>
            </ul>
            <div className="widget-action">
              <span className="action-text">Laboratuvar Paneline Git →</span>
            </div>
          </div>
        </div>

        <div className="widget ui-card panel notifications-widget clickable-widget">
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-bell"></span> Sistem Bildirimleri</h2>
          </div>
          <div className="widget-content">
            <ul className="notification-list">
              <li className="notification priority-high">
                <div className="notification-content">
                  <div className="notification-title">Aşı Hatırlatmaları</div>
                  <div className="notification-details">12 aşı hatırlatması</div>
                </div>
              </li>
              <li className="notification priority-medium">
                <div className="notification-content">
                  <div className="notification-title">Takip Aramaları</div>
                  <div className="notification-details">5 takip araması</div>
                </div>
              </li>
              <li className="notification priority-low">
                <div className="notification-content">
                  <div className="notification-title">Ekipman Bakımı</div>
                  <div className="notification-details">Röntgen bakımı</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
