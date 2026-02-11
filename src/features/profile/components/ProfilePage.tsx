import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ProfileService, type UserProfile } from '../services/profileService';
import { AppointmentService, type AppointmentRecord } from '../../appointments/services/appointmentService';
import WorkScheduleEditor from './WorkScheduleEditor';
import DashboardCustomizer from './DashboardCustomizer';
import MyPatientsWidget from './MyPatientsWidget';
import MyAppointmentsWidget from './MyAppointmentsWidget';
import '../styles/ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'dashboard'>('overview');
  const [myAppointments, setMyAppointments] = useState<AppointmentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Backend'de profil endpoint'i yoksa, mevcut user bilgilerini ve staff endpoint'ini kullan
      const appointmentService = new AppointmentService();
      
      // Kullanıcının kendi randevularını al
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const appointmentsResponse = await appointmentService.getAppointmentsByDateRange(
        today,
        nextMonth,
        user?.staffId?.toString()
      );

      if (appointmentsResponse.success && appointmentsResponse.data) {
        setMyAppointments(appointmentsResponse.data);
      }

      // Mock profil verisi (backend endpoint oluşana kadar)
      const mockProfile: UserProfile = {
        id: user?.staffId || 0,
        fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Kullanıcı',
        email: user?.email || '',
        phone: '',
        workSchedules: [
          { dayOfWeek: 'Pazartesi', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'Salı', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'Çarşamba', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'Perşembe', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'Cuma', startTime: '09:00', endTime: '17:00', isActive: true },
          { dayOfWeek: 'Cumartesi', startTime: '00:00', endTime: '00:00', isActive: false },
          { dayOfWeek: 'Pazar', startTime: '00:00', endTime: '00:00', isActive: false },
        ],
        dashboardPreferences: [
          { widgetId: 'appointments', isVisible: true, position: 1 },
          { widgetId: 'patients', isVisible: true, position: 2 },
          { widgetId: 'lab-results', isVisible: true, position: 3 },
          { widgetId: 'notifications', isVisible: true, position: 4 },
        ],
        totalAppointments: appointmentsResponse.success ? appointmentsResponse.data.length : 0,
        upcomingAppointments: appointmentsResponse.success 
          ? appointmentsResponse.data.filter(apt => new Date(apt.dateTime) > new Date()).length 
          : 0,
      };

      setProfile(mockProfile);
    } catch (err) {
      console.error('Profil yüklenirken hata:', err);
      setError('Profil bilgileri yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleUpdate = async (schedules: any[]) => {
    try {
      // Backend endpoint'i hazır olduğunda güncelleme yapılacak
      console.log('Çalışma programı güncelleniyor:', schedules);
      
      if (profile) {
        setProfile({ ...profile, workSchedules: schedules });
      }
      
      // TODO: Backend'e kaydet
      // const response = await ProfileService.updateWorkSchedule(schedules);
      // if (response.success) {
      //   loadProfileData();
      // }
    } catch (error) {
      console.error('Çalışma programı güncellenemedi:', error);
    }
  };

  const handleDashboardUpdate = async (preferences: any[]) => {
    try {
      console.log('Dashboard tercihleri güncelleniyor:', preferences);
      
      if (profile) {
        setProfile({ ...profile, dashboardPreferences: preferences });
      }
      
      // TODO: Backend'e kaydet
      // const response = await ProfileService.updateDashboardPreferences(preferences);
      // if (response.success) {
      //   loadProfileData();
      // }
    } catch (error) {
      console.error('Dashboard tercihleri güncellenemedi:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={loadProfileData} className="retry-button">
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>Profil bilgisi bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            <h1>{profile.fullName}</h1>
            <p className="profile-email">{profile.email}</p>
            <div className="profile-roles">
              {user?.roles?.map((role) => (
                <span key={role} className="role-badge">
                  {role === 'ADMIN' && '🔑 Yönetici'}
                  {role === 'VETERINER' && '⚕️ Veteriner'}
                  {role === 'STAFF' && '👨‍💼 Personel'}
                  {role === 'SEKRETER' && '📋 Sekreter'}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{profile.totalAppointments || 0}</span>
            <span className="stat-label">Toplam Randevu</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{profile.upcomingAppointments || 0}</span>
            <span className="stat-label">Yaklaşan Randevu</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{profile.totalPatients || 0}</span>
            <span className="stat-label">Toplam Hasta</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Genel Bakış
        </button>
        <button
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <span className="tab-icon">📅</span>
          Çalışma Programı
        </button>
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="tab-icon">⚙️</span>
          Dashboard Özelleştirme
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="widgets-grid">
              <MyAppointmentsWidget appointments={myAppointments} />
              <MyPatientsWidget staffId={user?.staffId?.toString()} />
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-tab">
            <WorkScheduleEditor
              schedules={profile.workSchedules}
              onUpdate={handleScheduleUpdate}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <DashboardCustomizer
              preferences={profile.dashboardPreferences}
              onUpdate={handleDashboardUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
