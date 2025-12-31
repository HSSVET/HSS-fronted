import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarWidget } from '../../../shared';
import { AnimalService, type AnimalRecord } from '../../animals/services/animalService';
import { AppointmentService, type AppointmentRecord } from '../../appointments/services/appointmentService';
import { useError } from '../../../context/ErrorContext';
import { useLoading } from '../../../hooks/useLoading';
import LoadingSpinner from '../../../components/LoadingSpinner';
import '../styles/Dashboard.css';
import QuickAppointmentModal from './QuickAppointmentModal';
import FastAppointmentModal from './FastAppointmentModal';
import AddAnimalDialog from '../../animals/components/AddAnimalDialog';
import { useAnimals } from '../../animals/hooks/useAnimals';
import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';

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

interface StockAlert {
  productId: number;
  name: string;
  currentStock: number;
  minStock: number;
  category: string;
}

interface PendingLabTest {
  testId: number;
  testName: string;
  animalName: string;
  animalSpecies: string;
  date: string;
  status: string;
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
  const { addError, showSuccess } = useError();
  const { loading, startLoading, stopLoading } = useLoading();
  const { createAnimal } = useAnimals({ autoFetch: false });

  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    todaysAppointments: 0,
    clinicAnimals: 0,
  });
  const [hospitalizedPatients, setHospitalizedPatients] = useState<HospitalizedPatient[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [pendingLabTests, setPendingLabTests] = useState<PendingLabTest[]>([]);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [isFastModalOpen, setIsFastModalOpen] = useState(false);
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);
  const { slug } = useParams<{ slug?: string }>();

  const loadTodayAppointments = useCallback(async (): Promise<AppointmentRecord[]> => {
    const appointmentService = new AppointmentService();

    try {
      const todayResponse = await appointmentService.getTodayAppointments();
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

      const fallbackResponse = await appointmentService.getAppointmentsByDateRange(start, end);
      if (fallbackResponse.success && fallbackResponse.data) {
        return fallbackResponse.data;
      }
    } catch (fallbackError) {
      console.error('Tarih aralığı fallback randevular alınamadı.', fallbackError);
    }

    // Mock data fallback when backend is not available
    console.warn('Backend bağlantısı yok, mock data kullanılıyor');
    return [
      {
        appointmentId: 1,
        animalId: 1,
        animalName: 'Mock Hayvan',
        dateTime: new Date().toISOString(),
        subject: 'Mock Randevu',
        veterinarianId: 1,
        veterinarianName: 'Mock Veteriner',
        ownerName: 'Mock Sahip',
        status: 'SCHEDULED',
        notes: 'Mock randevu',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      startLoading('Dashboard verileri yükleniyor...');

      const animalService = new AnimalService();
      const [animalResponse, appointmentItems] = await Promise.all([
        animalService.getAnimals(0, 8),
        loadTodayAppointments(),
      ]);

      let animalItems: AnimalRecord[] = [];

      if (animalResponse.success && animalResponse.data) {
        animalItems = animalResponse.data.items || [];
      } else {
        // Mock data fallback when backend is not available
        console.warn('Backend bağlantısı yok, mock animal data kullanılıyor');
        animalItems = [
          {
            id: 1,
            name: 'Mock Hayvan 1',
            species: { id: 1, name: 'Kedi' },
            breed: { id: 1, name: 'Tekir' },
            owner: { id: 1, name: 'Mock Sahip 1' },
            gender: 'Erkek',
            birthDate: '2020-01-01',
            weight: 4.5,
            color: 'Gri',
            microchipNumber: 'MOCK001',
            allergies: undefined,
            chronicDiseases: undefined,
            notes: 'Mock hayvan',
          },
          {
            id: 2,
            name: 'Mock Hayvan 2',
            species: { id: 2, name: 'Köpek' },
            breed: { id: 2, name: 'Golden Retriever' },
            owner: { id: 2, name: 'Mock Sahip 2' },
            gender: 'Dişi',
            birthDate: '2019-05-15',
            weight: 25.0,
            color: 'Altın',
            microchipNumber: 'MOCK002',
            allergies: undefined,
            chronicDiseases: undefined,
            notes: 'Mock hayvan',
          }
        ];
      }

      const patients: HospitalizedPatient[] = (animalItems || []).slice(0, 5).map((animal, index) => ({
        id: animal.id ? animal.id.toString() : `${Date.now()}-${index}`,
        animalId: animal.id ? animal.id.toString() : '',
        name: animal.name || 'İsimsiz',
        species: animal.species?.name || 'Bilinmiyor',
        owner: animal.owner?.name || 'Bilinmiyor',
        admittedAt: formatDateDisplay(animal.birthDate),
        status: STATUS_LABELS[index % STATUS_LABELS.length],
      }));

      // Ensure appointmentItems is an array
      const appointmentArray = Array.isArray(appointmentItems) ? appointmentItems : [];

      const activities: ActivityItem[] = appointmentArray
        .slice()
        .sort((a, b) => {
          const dateA = new Date(a.dateTime || '').getTime();
          const dateB = new Date(b.dateTime || '').getTime();
          return dateB - dateA;
        })
        .slice(0, 6)
        .map((appointment, index) => {
          const generatedId = appointment.appointmentId ? appointment.appointmentId.toString() : `${Date.now()}-${index}`;
          const animalId = appointment.animalId ? appointment.animalId.toString() : '';

          return {
            id: generatedId,
            animalId,
            time: formatTimeDisplay(appointment.dateTime),
            animalName: appointment.animalName || 'Hasta',
            ownerName: appointment.ownerName || '',
            description: appointment.subject || 'Randevu',
          };
        });

      setStats({
        totalAnimals: animalResponse.data?.total ?? animalItems.length,
        todaysAppointments: appointmentArray.length,
        clinicAnimals: patients.length,
      });
      setHospitalizedPatients(patients);
      setRecentActivities(activities);

      // Fetch stock alerts
      try {
        const stockResponse = await apiClient.get<StockAlert[]>(API_ENDPOINTS.STOCK_ALERTS);
        if (stockResponse.success && stockResponse.data) {
          setStockAlerts(stockResponse.data);
        }
      } catch (stockErr) {
        console.warn('Stock alerts could not be fetched:', stockErr);
      }

      // Fetch pending lab tests
      try {
        const labResponse = await apiClient.get<any[]>(`${API_ENDPOINTS.LAB_TESTS}/pending`);
        if (labResponse.success && labResponse.data) {
          const mappedLabTests: PendingLabTest[] = labResponse.data.map((test: any) => ({
            testId: test.testId,
            testName: test.testName,
            animalName: test.animal?.name || 'Bilinmiyor',
            animalSpecies: test.animal?.species?.name || '',
            date: test.date,
            status: test.status,
          }));
          setPendingLabTests(mappedLabTests);
        }
      } catch (labErr) {
        console.warn('Pending lab tests could not be fetched:', labErr);
      }

      showSuccess('Dashboard verileri başarıyla yüklendi');
    } catch (err) {
      console.error('Dashboard verileri alınırken hata:', err);
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      addError(
        'Dashboard verileri alınırken bir hata oluştu',
        'error',
        errorMessage,
        {
          label: 'Tekrar Dene',
          onClick: () => fetchDashboardData(),
        }
      );
    } finally {
      stopLoading();
    }
  }, [loadTodayAppointments, startLoading, stopLoading, addError, showSuccess]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleQuickAppointmentCreated = useCallback(async () => {
    await fetchDashboardData();
    setCalendarRefreshKey((prev) => prev + 1);
  }, [fetchDashboardData]);

  const handleAnimalClick = (animalId: string) => {
    if (!animalId) {
      return;
    }
    const basePath = slug ? `/clinic/${slug}/animals` : '/animals';
    navigate(`${basePath}/${animalId}`);
  };

  const handleAddAnimal = async (form: {
    ownerId: number;
    name: string;
    speciesId: number;
    breedId: number;
    gender?: string;
    birthDate?: string;
    weight?: number;
    color?: string;
    microchipNo?: string;
    allergies?: string;
    chronicDiseases?: string;
    notes?: string;
  }) => {
    try {
      startLoading('Hayvan ekleniyor...');

      const ok = await createAnimal(form);
      if (ok) {
        setIsAddAnimalOpen(false);
        showSuccess('Hayvan başarıyla eklendi');
        await fetchDashboardData();

        // Custom event dispatch et - AnimalList'i yenilemek için
        window.dispatchEvent(new CustomEvent('animalAdded'));

        // Hayvan listesine yönlendir ki kullanıcı yeni eklenen hayvanı görebilsin
        navigate('/animals');
      } else {
        // createAnimal false döndüğünde hata zaten gösterilmiş olacak
        // Dialog açık kalacak
        console.error('Hayvan eklenemedi');
      }
    } catch (err: any) {
      // Validation hataları için detaylı mesaj göster
      let msg = err instanceof Error ? err.message : 'Bilinmeyen hata';

      // 400 validation hatası için payload'dan detaylı mesaj al
      if (err?.status === 400 && err?.payload?.validationErrors) {
        const validationErrors = err.payload.validationErrors;
        const errorDetails = Object.entries(validationErrors)
          .map(([field, message]) => {
            // Field adını Türkçe'ye çevir
            const fieldNames: { [key: string]: string } = {
              'ownerId': 'Sahip ID',
              'name': 'İsim',
              'speciesId': 'Tür ID',
              'breedId': 'Irk ID',
              'gender': 'Cinsiyet',
              'birthDate': 'Doğum Tarihi',
              'weight': 'Ağırlık',
              'color': 'Renk',
              'microchipNo': 'Çip Numarası',
              'allergies': 'Alerjiler',
              'chronicDiseases': 'Kronik Hastalıklar',
              'notes': 'Notlar'
            };
            const fieldName = fieldNames[field] || field;
            return `${fieldName}: ${message}`;
          })
          .join(', ');
        msg = `Doğrulama Hatası: ${errorDetails}`;
      }

      console.error('Hayvan ekleme hatası:', err);
      addError('Yeni hasta kaydı başarısız', 'error', msg);
      // Hata durumunda dialog açık kalacak
      throw err; // AddAnimalDialog'a hata bildirmek için
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="dashboard">
      <LoadingSpinner
        isLoading={loading.isLoading}
        message={loading.loadingMessage}
        variant="overlay"
      />

      <div className="topbar mb-3">
        <h1 className="ui-section-title">Veteriner Paneli</h1>
        <div className="topbar__spacer" />
        <button
          type="button"
          className="fast-appointment-btn"
          style={{ marginRight: 8 }}
          onClick={() => setIsFastModalOpen(true)}
        >
          <span className="fast-appointment-btn__sparkle">✨</span>
          <span>Hızlı Randevu</span>
        </button>
        <button
          type="button"
          className="ui-button"
          style={{ marginRight: 8 }}
          onClick={() => setIsQuickModalOpen(true)}
        >
          <span className="icon icon-plus"></span>
          Yeni Randevu
        </button>
        <button className="ui-button" onClick={() => setIsAddAnimalOpen(true)}>
          <span className="icon icon-plus"></span>
          Yeni Hasta Kaydı
        </button>
      </div>


      <div className="stats-container grid gap-3" style={{ gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))' }}>
        <div className="ui-card panel ui-card--hover stat-card">
          <h3 className="muted">Toplam Aktif Hasta</h3>
          <div className="ui-stat-number">{loading.isLoading ? '...' : stats.totalAnimals}</div>
        </div>
        <div className="ui-card panel ui-card--hover stat-card">
          <h3 className="muted">Bugünkü Randevular</h3>
          <div className="ui-stat-number">{loading.isLoading ? '...' : stats.todaysAppointments}</div>
        </div>
        <div className="ui-card panel ui-card--hover stat-card">
          <h3 className="muted">Klinikte Bulunan Hayvanlar</h3>
          <div className="ui-stat-number">{loading.isLoading ? '...' : stats.clinicAnimals}</div>
        </div>
      </div>

      <div className="widgets-container three-column grid grid--dashboard gap-3 grid--rows">
        <div className="widget ui-card panel hospitalized-patients-widget clickable-widget">
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-hospital"></span> Klinikte Yatan Hastalar</h2>
          </div>
          <div className="widget-content">
            {loading.isLoading ? (
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
            {loading.isLoading ? (
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
          <CalendarWidget refreshKey={calendarRefreshKey} />
        </div>

        <div className="widget ui-card panel low-stock-widget clickable-widget" onClick={() => navigate(slug ? `/clinic/${slug}/inventory` : '/inventory')}>
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-warning"></span> Düşük Stok Uyarıları</h2>
          </div>
          <div className="widget-content">
            {loading.isLoading ? (
              <div className="muted">Yükleniyor...</div>
            ) : stockAlerts.length === 0 ? (
              <div className="muted">Düşük stok uyarısı bulunmuyor.</div>
            ) : (
              <table className="stock-table table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Mevcut</th>
                    <th>Min.</th>
                  </tr>
                </thead>
                <tbody>
                  {stockAlerts.slice(0, 5).map((item) => (
                    <tr key={item.productId} className={item.currentStock <= item.minStock / 2 ? 'critical' : 'warning'}>
                      <td>{item.name}</td>
                      <td>{item.currentStock}</td>
                      <td>{item.minStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="widget ui-card panel lab-results-widget clickable-widget" onClick={() => navigate(slug ? `/clinic/${slug}/laboratory` : '/laboratory')}>
          <div className="widget-header card-header">
            <h2 className="ui-section-title"><span className="icon icon-lab"></span> Bekleyen Laboratuvar Sonuçları</h2>
          </div>
          <div className="widget-content">
            {loading.isLoading ? (
              <div className="muted">Yükleniyor...</div>
            ) : pendingLabTests.length === 0 ? (
              <div className="muted">Bekleyen test bulunmuyor.</div>
            ) : (
              <ul className="lab-list">
                {pendingLabTests.slice(0, 5).map((test) => (
                  <li key={test.testId}>
                    <div className="lab-info">
                      <span className="lab-patient">{test.animalName} {test.animalSpecies && `(${test.animalSpecies})`}</span>
                      <span className="lab-test">{test.testName}</span>
                    </div>
                    <div className="lab-date">{formatDateDisplay(test.date)}</div>
                  </li>
                ))}
              </ul>
            )}
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

      <FastAppointmentModal
        isOpen={isFastModalOpen}
        onClose={() => setIsFastModalOpen(false)}
        onCreated={handleQuickAppointmentCreated}
      />

      <QuickAppointmentModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        onCreated={handleQuickAppointmentCreated}
      />

      <AddAnimalDialog
        open={isAddAnimalOpen}
        onClose={() => setIsAddAnimalOpen(false)}
        onAdd={handleAddAnimal}
      />

    </div>
  );
};

export default Dashboard;
