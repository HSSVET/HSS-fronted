import React, { useState } from 'react';
import { useAuth } from '../../../context/MockAuthContext';
import '../styles/ProfilePage.css';

const ProfilePage: React.FC = () => {
    const { user, updateUser, updatePreferences } = useAuth();

    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences' | 'sessions' | 'schedule' | 'performance' | 'activity' | 'notifications' | 'shortcuts'>('info');
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.profilePicture || '');

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        department: user?.department || '',
        title: user?.title || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [preferences, setPreferences] = useState({
        theme: user?.preferences?.theme || 'light',
        language: user?.preferences?.language || 'tr',
        emailNotifications: user?.preferences?.notifications?.email || true,
        pushNotifications: user?.preferences?.notifications?.push || true,
        desktopNotifications: user?.preferences?.notifications?.desktop || true,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setPreferences(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        await updateUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            department: formData.department,
            title: formData.title,
            profilePicture: profileImage,
        });
        console.log('✅ Profil bilgileri güncellendi:', formData);
        setIsEditing(false);
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }
        // Şifre değiştirme işlemi
        console.log('Şifre değiştiriliyor...');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleSavePreferences = async () => {
        await updatePreferences({
            theme: preferences.theme as 'light' | 'dark' | 'system',
            language: preferences.language as 'tr' | 'en',
            notifications: {
                email: preferences.emailNotifications,
                push: preferences.pushNotifications,
                desktop: preferences.desktopNotifications,
            },
            dashboard: user?.preferences?.dashboard || {
                layout: 'modern',
                widgets: []
            }
        });
    };

    const getRoleBadgeColor = (roles: string[]) => {
        if (roles?.includes('ADMIN')) return 'badge-admin';
        if (roles?.includes('VETERINER')) return 'badge-veterinarian';
        if (roles?.includes('SEKRETER')) return 'badge-secretary';
        if (roles?.includes('TEKNISYEN')) return 'badge-technician';
        return 'badge-default';
    };

    const getRoleLabel = (roles: string[]) => {
        if (roles?.includes('ADMIN')) return 'Yönetici';
        if (roles?.includes('VETERINER')) return 'Veteriner Hekim';
        if (roles?.includes('SEKRETER')) return 'Sekreter';
        if (roles?.includes('TEKNISYEN')) return 'Teknisyen';
        return 'Kullanıcı';
    };

    const mockSessions = [
        {
            id: '1',
            device: 'Windows 10 - Chrome',
            location: 'İstanbul, Türkiye',
            ip: '192.168.1.1',
            lastActive: 'Şu anda aktif',
            isCurrent: true,
        },
        {
            id: '2',
            device: 'iPhone 13 - Safari',
            location: 'İstanbul, Türkiye',
            ip: '192.168.1.2',
            lastActive: '2 saat önce',
            isCurrent: false,
        },
    ];

    // Çalışma Saatleri Mock Data
    const workSchedule = {
        weekly: [
            { day: 'Pazartesi', startTime: '09:00', endTime: '18:00', isWorkDay: true },
            { day: 'Salı', startTime: '09:00', endTime: '18:00', isWorkDay: true },
            { day: 'Çarşamba', startTime: '09:00', endTime: '18:00', isWorkDay: true },
            { day: 'Perşembe', startTime: '09:00', endTime: '18:00', isWorkDay: true },
            { day: 'Cuma', startTime: '09:00', endTime: '17:00', isWorkDay: true },
            { day: 'Cumartesi', startTime: '10:00', endTime: '14:00', isWorkDay: true },
            { day: 'Pazar', startTime: '', endTime: '', isWorkDay: false },
        ],
        currentShift: 'Sabah Vardiyası (09:00 - 18:00)',
        nextShift: 'Yarın - Sabah Vardiyası',
        availability: 'Müsait',
        vacationDays: [
            { start: '2024-12-25', end: '2024-12-31', reason: 'Yıl sonu tatili' },
            { start: '2025-01-15', end: '2025-01-18', reason: 'Kişisel izin' },
        ],
    };

    // Performans İstatistikleri Mock Data
    const performanceStats = {
        totalExaminations: 1247,
        totalSurgeries: 89,
        totalAnimals: 543,
        successRate: 98.5,
        monthlyData: [
            { month: 'Ocak', examinations: 95, surgeries: 7, animals: 45 },
            { month: 'Şubat', examinations: 102, surgeries: 8, animals: 48 },
            { month: 'Mart', examinations: 118, surgeries: 9, animals: 52 },
            { month: 'Nisan', examinations: 98, surgeries: 6, animals: 43 },
            { month: 'Mayıs', examinations: 125, surgeries: 10, animals: 58 },
            { month: 'Haziran', examinations: 110, surgeries: 8, animals: 51 },
        ],
        topProcedures: [
            { name: 'Rutin Muayene', count: 456 },
            { name: 'Aşılama', count: 234 },
            { name: 'Cerrahi', count: 89 },
            { name: 'Diş Tedavisi', count: 67 },
            { name: 'Laboratuvar Testi', count: 156 },
        ],
    };

    // Aktivite Geçmişi Mock Data
    const activityHistory = [
        {
            id: '1',
            type: 'examination',
            title: 'Köpek Muayenesi Tamamlandı',
            description: 'Charlie adlı Golden Retriever muayene edildi',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            icon: '🏥',
            color: '#4CAF50',
        },
        {
            id: '2',
            type: 'surgery',
            title: 'Cerrahi Operasyon',
            description: 'Kedi kısırlaştırma ameliyatı başarıyla tamamlandı',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            icon: '⚕️',
            color: '#FF5722',
        },
        {
            id: '3',
            type: 'login',
            title: 'Sistem Girişi',
            description: 'Windows 10 - Chrome üzerinden giriş yapıldı',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
            icon: '🔐',
            color: '#2196F3',
        },
        {
            id: '4',
            type: 'report',
            title: 'Rapor Oluşturuldu',
            description: 'Aylık performans raporu hazırlandı',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            icon: '📊',
            color: '#9C27B0',
        },
        {
            id: '5',
            type: 'appointment',
            title: 'Randevu Planlandı',
            description: '5 yeni randevu oluşturuldu',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
            icon: '📅',
            color: '#FF9800',
        },
    ];

    // Bildirim Ayarları Mock Data
    const [notificationSettings, setNotificationSettings] = useState({
        appointments: { email: true, push: true, desktop: true },
        stockAlerts: { email: true, push: true, desktop: false },
        vaccineReminders: { email: true, push: true, desktop: true },
        systemAlerts: { email: false, push: true, desktop: true },
        quietHoursEnabled: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
    });

    // Bildirim Geçmişi Mock Data
    const notificationHistory = [
        {
            id: '1',
            title: 'Kritik Stok Uyarısı',
            message: 'Rabies Vaccine stoğu kritik seviyede (5 adet kaldı)',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            type: 'stock',
            read: false,
        },
        {
            id: '2',
            title: 'Aşı Hatırlatıcı',
            message: '3 hayvan için aşı randevusu yaklaşıyor',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            type: 'vaccine',
            read: false,
        },
        {
            id: '3',
            title: 'Yeni Randevu',
            message: 'Ahmet Yılmaz - Kedi muayenesi için randevu aldı',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            type: 'appointment',
            read: true,
        },
    ];

    // Kısayollar & Favoriler Mock Data
    const [shortcuts, setShortcuts] = useState([
        { id: '1', name: 'Hayvan Listesi', path: '/animals', icon: '🐾', color: '#4CAF50' },
        { id: '2', name: 'Randevular', path: '/appointments', icon: '📅', color: '#2196F3' },
        { id: '3', name: 'Stok Yönetimi', path: '/inventory', icon: '📦', color: '#FF9800' },
        { id: '4', name: 'Raporlar', path: '/reports', icon: '📊', color: '#9C27B0' },
    ]);

    const [favoriteReports, setFavoriteReports] = useState([
        { id: '1', name: 'Aylık Performans Raporu', lastGenerated: '2024-10-01' },
        { id: '2', name: 'Hayvan İstatistikleri', lastGenerated: '2024-10-05' },
        { id: '3', name: 'Finansal Özet', lastGenerated: '2024-10-03' },
    ]);

    return (
        <div className="profile-page">
            {/* Header Section */}
            <div className="profile-header">
                <div className="profile-header-content">
                    <div className="profile-image-container">
                        <div className="profile-image">
                            {profileImage ? (
                                <img src={profileImage} alt={user?.name} />
                            ) : (
                                <div className="profile-image-placeholder">
                                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <label className="profile-image-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <span className="upload-icon">📷</span>
                        </label>
                    </div>
                    <div className="profile-header-info">
                        <h1 className="profile-name">{user?.firstName} {user?.lastName}</h1>
                        <p className="profile-email">{user?.email}</p>
                        <div className="profile-badges">
                            <span className={`role-badge ${getRoleBadgeColor(user?.roles || [])}`}>
                                {getRoleLabel(user?.roles || [])}
                            </span>
                            {user?.department && (
                                <span className="department-badge">{user.department}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button
                    className={`tab ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    📋 Bilgiler
                </button>
                <button
                    className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('performance')}
                >
                    📊 Performans
                </button>
                <button
                    className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                >
                    🕐 Çalışma
                </button>
                <button
                    className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                >
                    📜 Aktivite
                </button>
                <button
                    className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    🔔 Bildirimler
                </button>
                <button
                    className={`tab ${activeTab === 'shortcuts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shortcuts')}
                >
                    ⭐ Favoriler
                </button>
                <button
                    className={`tab ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    🔐 Güvenlik
                </button>
                <button
                    className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preferences')}
                >
                    ⚙️ Tercihler
                </button>
                <button
                    className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sessions')}
                >
                    💻 Oturumlar
                </button>
            </div>

            {/* Content */}
            <div className="profile-content">
                {/* Kişisel Bilgiler Tab */}
                {activeTab === 'info' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Kişisel Bilgiler</h2>
                            {!isEditing && (
                                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                    Düzenle
                                </button>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Ad</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Soyad</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label>E-posta</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Departman</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="Departman bilgisi"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Ünvan</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="Ünvan bilgisi"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                                    İptal
                                </button>
                                <button className="btn-primary" onClick={handleSaveProfile}>
                                    Kaydet
                                </button>
                            </div>
                        )}

                        {/* İstatistikler */}
                        <div className="stats-container">
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-info">
                                    <span className="stat-label">Kayıt Tarihi</span>
                                    <span className="stat-value">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🔐</div>
                                <div className="stat-info">
                                    <span className="stat-label">Son Giriş</span>
                                    <span className="stat-value">
                                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : 'Bilinmiyor'}
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">⚡</div>
                                <div className="stat-info">
                                    <span className="stat-label">Aktif Oturumlar</span>
                                    <span className="stat-value">{mockSessions.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Güvenlik Tab */}
                {activeTab === 'security' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Güvenlik Ayarları</h2>
                        </div>

                        <div className="security-section">
                            <h3>Şifre Değiştir</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Mevcut Şifre</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Mevcut şifrenizi girin"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Yeni Şifre</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Yeni şifrenizi girin"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Yeni Şifre (Tekrar)</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Yeni şifrenizi tekrar girin"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button className="btn-primary" onClick={handleSavePassword}>
                                    Şifreyi Güncelle
                                </button>
                            </div>
                        </div>

                        <div className="security-section">
                            <h3>İki Faktörlü Kimlik Doğrulama</h3>
                            <p className="section-description">
                                Hesabınızı daha güvenli hale getirmek için iki faktörlü kimlik doğrulamayı etkinleştirin.
                            </p>
                            <button className="btn-secondary">2FA'yı Etkinleştir</button>
                        </div>
                    </div>
                )}

                {/* Tercihler Tab */}
                {activeTab === 'preferences' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Tercihler</h2>
                        </div>

                        <div className="preferences-section">
                            <h3>Görünüm</h3>
                            <div className="form-group">
                                <label>Tema</label>
                                <select
                                    name="theme"
                                    value={preferences.theme}
                                    onChange={handlePreferenceChange}
                                >
                                    <option value="light">Açık</option>
                                    <option value="dark">Koyu</option>
                                    <option value="system">Sistem</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Dil</label>
                                <select
                                    name="language"
                                    value={preferences.language}
                                    onChange={handlePreferenceChange}
                                >
                                    <option value="tr">Türkçe</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>

                        <div className="preferences-section">
                            <h3>Bildirimler</h3>
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="emailNotifications"
                                        checked={preferences.emailNotifications}
                                        onChange={handlePreferenceChange}
                                    />
                                    <span>E-posta Bildirimleri</span>
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="pushNotifications"
                                        checked={preferences.pushNotifications}
                                        onChange={handlePreferenceChange}
                                    />
                                    <span>Push Bildirimleri</span>
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="desktopNotifications"
                                        checked={preferences.desktopNotifications}
                                        onChange={handlePreferenceChange}
                                    />
                                    <span>Masaüstü Bildirimleri</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn-primary" onClick={handleSavePreferences}>
                                Tercihleri Kaydet
                            </button>
                        </div>
                    </div>
                )}

                {/* Performans & İstatistikler Tab */}
                {activeTab === 'performance' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Performans & İstatistikler</h2>
                        </div>

                        {/* Ana İstatistikler */}
                        <div className="performance-overview">
                            <div className="perf-stat-card">
                                <div className="perf-stat-icon">🏥</div>
                                <div className="perf-stat-content">
                                    <span className="perf-stat-label">Toplam Muayene</span>
                                    <span className="perf-stat-value">{performanceStats.totalExaminations}</span>
                                </div>
                            </div>
                            <div className="perf-stat-card">
                                <div className="perf-stat-icon">⚕️</div>
                                <div className="perf-stat-content">
                                    <span className="perf-stat-label">Toplam Ameliyat</span>
                                    <span className="perf-stat-value">{performanceStats.totalSurgeries}</span>
                                </div>
                            </div>
                            <div className="perf-stat-card">
                                <div className="perf-stat-icon">🐾</div>
                                <div className="perf-stat-content">
                                    <span className="perf-stat-label">Tedavi Edilen Hayvan</span>
                                    <span className="perf-stat-value">{performanceStats.totalAnimals}</span>
                                </div>
                            </div>
                            <div className="perf-stat-card success">
                                <div className="perf-stat-icon">✅</div>
                                <div className="perf-stat-content">
                                    <span className="perf-stat-label">Başarı Oranı</span>
                                    <span className="perf-stat-value">{performanceStats.successRate}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Aylık Grafik */}
                        <div className="chart-section">
                            <h3>Aylık Performans Grafiği</h3>
                            <div className="simple-chart">
                                {performanceStats.monthlyData.map((data, index) => (
                                    <div key={index} className="chart-bar-group">
                                        <div className="chart-bars">
                                            <div
                                                className="chart-bar examinations"
                                                style={{ height: `${(data.examinations / 125) * 100}%` }}
                                                title={`Muayene: ${data.examinations}`}
                                            ></div>
                                            <div
                                                className="chart-bar surgeries"
                                                style={{ height: `${(data.surgeries / 10) * 100}%` }}
                                                title={`Ameliyat: ${data.surgeries}`}
                                            ></div>
                                        </div>
                                        <div className="chart-label">{data.month.substring(0, 3)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="legend-color examinations"></span>
                                    <span>Muayeneler</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color surgeries"></span>
                                    <span>Ameliyatlar</span>
                                </div>
                            </div>
                        </div>

                        {/* En Çok Yapılan İşlemler */}
                        <div className="top-procedures">
                            <h3>En Çok Yapılan İşlemler</h3>
                            <div className="procedures-list">
                                {performanceStats.topProcedures.map((proc, index) => (
                                    <div key={index} className="procedure-item">
                                        <div className="procedure-info">
                                            <span className="procedure-rank">#{index + 1}</span>
                                            <span className="procedure-name">{proc.name}</span>
                                        </div>
                                        <div className="procedure-count">{proc.count} adet</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Çalışma Saatleri & Vardiya Tab */}
                {activeTab === 'schedule' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Çalışma Saatleri & Vardiya</h2>
                        </div>

                        {/* Mevcut Durum */}
                        <div className="schedule-status">
                            <div className="status-card current-shift">
                                <div className="status-icon">🕐</div>
                                <div className="status-info">
                                    <span className="status-label">Mevcut Vardiya</span>
                                    <span className="status-value">{workSchedule.currentShift}</span>
                                </div>
                            </div>
                            <div className="status-card next-shift">
                                <div className="status-icon">📅</div>
                                <div className="status-info">
                                    <span className="status-label">Sonraki Vardiya</span>
                                    <span className="status-value">{workSchedule.nextShift}</span>
                                </div>
                            </div>
                            <div className="status-card availability">
                                <div className="status-icon">✅</div>
                                <div className="status-info">
                                    <span className="status-label">Müsaitlik Durumu</span>
                                    <span className="status-value">{workSchedule.availability}</span>
                                </div>
                            </div>
                        </div>

                        {/* Haftalık Takvim */}
                        <div className="weekly-schedule">
                            <h3>Haftalık Çalışma Takvimi</h3>
                            <div className="schedule-table">
                                {workSchedule.weekly.map((day, index) => (
                                    <div key={index} className={`schedule-row ${!day.isWorkDay ? 'off-day' : ''}`}>
                                        <div className="day-name">{day.day}</div>
                                        <div className="day-hours">
                                            {day.isWorkDay ? (
                                                <>
                                                    <span className="time">{day.startTime}</span>
                                                    <span className="separator">-</span>
                                                    <span className="time">{day.endTime}</span>
                                                </>
                                            ) : (
                                                <span className="off-label">Tatil</span>
                                            )}
                                        </div>
                                        <div className="day-duration">
                                            {day.isWorkDay && day.startTime && day.endTime && (
                                                <span>
                                                    {(() => {
                                                        const start = parseInt(day.startTime.split(':')[0]);
                                                        const end = parseInt(day.endTime.split(':')[0]);
                                                        return `${end - start} saat`;
                                                    })()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* İzin Günleri */}
                        <div className="vacation-section">
                            <h3>Planlanan İzinler</h3>
                            <div className="vacation-list">
                                {workSchedule.vacationDays.map((vacation, index) => (
                                    <div key={index} className="vacation-card">
                                        <div className="vacation-icon">🏖️</div>
                                        <div className="vacation-info">
                                            <div className="vacation-dates">
                                                {new Date(vacation.start).toLocaleDateString('tr-TR')} - {new Date(vacation.end).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="vacation-reason">{vacation.reason}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Aktivite Geçmişi Tab */}
                {activeTab === 'activity' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Aktivite Geçmişi</h2>
                        </div>

                        <div className="activity-timeline">
                            {activityHistory.map((activity) => (
                                <div key={activity.id} className="timeline-item">
                                    <div className="timeline-icon" style={{ backgroundColor: activity.color }}>
                                        {activity.icon}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <h4>{activity.title}</h4>
                                            <span className="timeline-time">
                                                {(() => {
                                                    const diff = Date.now() - activity.timestamp.getTime();
                                                    const hours = Math.floor(diff / (1000 * 60 * 60));
                                                    if (hours < 1) return 'Az önce';
                                                    if (hours < 24) return `${hours} saat önce`;
                                                    const days = Math.floor(hours / 24);
                                                    return `${days} gün önce`;
                                                })()}
                                            </span>
                                        </div>
                                        <p className="timeline-description">{activity.description}</p>
                                        <div className="timeline-meta">
                                            <span className="activity-type">{activity.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bildirim Merkezi Tab */}
                {activeTab === 'notifications' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Bildirim Merkezi</h2>
                        </div>

                        {/* Bildirim Tercihleri */}
                        <div className="notification-preferences">
                            <h3>Bildirim Tercihleri</h3>

                            <div className="notification-category">
                                <div className="category-header">
                                    <span className="category-icon">📅</span>
                                    <span className="category-name">Randevu Bildirimleri</span>
                                </div>
                                <div className="notification-toggles">
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.appointments.email} onChange={() => { }} />
                                        <span>E-posta</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.appointments.push} onChange={() => { }} />
                                        <span>Push</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.appointments.desktop} onChange={() => { }} />
                                        <span>Masaüstü</span>
                                    </label>
                                </div>
                            </div>

                            <div className="notification-category">
                                <div className="category-header">
                                    <span className="category-icon">📦</span>
                                    <span className="category-name">Kritik Stok Uyarıları</span>
                                </div>
                                <div className="notification-toggles">
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.stockAlerts.email} onChange={() => { }} />
                                        <span>E-posta</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.stockAlerts.push} onChange={() => { }} />
                                        <span>Push</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.stockAlerts.desktop} onChange={() => { }} />
                                        <span>Masaüstü</span>
                                    </label>
                                </div>
                            </div>

                            <div className="notification-category">
                                <div className="category-header">
                                    <span className="category-icon">💉</span>
                                    <span className="category-name">Aşı Hatırlatıcıları</span>
                                </div>
                                <div className="notification-toggles">
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.vaccineReminders.email} onChange={() => { }} />
                                        <span>E-posta</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.vaccineReminders.push} onChange={() => { }} />
                                        <span>Push</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.vaccineReminders.desktop} onChange={() => { }} />
                                        <span>Masaüstü</span>
                                    </label>
                                </div>
                            </div>

                            <div className="notification-category">
                                <div className="category-header">
                                    <span className="category-icon">⚠️</span>
                                    <span className="category-name">Sistem Bildirimleri</span>
                                </div>
                                <div className="notification-toggles">
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.systemAlerts.email} onChange={() => { }} />
                                        <span>E-posta</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.systemAlerts.push} onChange={() => { }} />
                                        <span>Push</span>
                                    </label>
                                    <label className="toggle-label">
                                        <input type="checkbox" checked={notificationSettings.systemAlerts.desktop} onChange={() => { }} />
                                        <span>Masaüstü</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Sessiz Saatler */}
                        <div className="quiet-hours">
                            <h3>Sessiz Saatler</h3>
                            <div className="quiet-hours-settings">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.quietHoursEnabled}
                                        onChange={() => { }}
                                    />
                                    <span>Sessiz saatleri etkinleştir</span>
                                </label>
                                <div className="time-range">
                                    <input type="time" value={notificationSettings.quietHoursStart} onChange={() => { }} />
                                    <span>-</span>
                                    <input type="time" value={notificationSettings.quietHoursEnd} onChange={() => { }} />
                                </div>
                            </div>
                        </div>

                        {/* Bildirim Geçmişi */}
                        <div className="notification-history">
                            <h3>Son Bildirimler</h3>
                            <div className="notifications-list">
                                {notificationHistory.map((notif) => (
                                    <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                                        <div className={`notif-icon ${notif.type}`}>
                                            {notif.type === 'stock' && '📦'}
                                            {notif.type === 'vaccine' && '💉'}
                                            {notif.type === 'appointment' && '📅'}
                                        </div>
                                        <div className="notif-content">
                                            <h4>{notif.title}</h4>
                                            <p>{notif.message}</p>
                                            <span className="notif-time">
                                                {(() => {
                                                    const diff = Date.now() - notif.timestamp.getTime();
                                                    const hours = Math.floor(diff / (1000 * 60 * 60));
                                                    return hours < 1 ? 'Az önce' : `${hours} saat önce`;
                                                })()}
                                            </span>
                                        </div>
                                        {!notif.read && <div className="unread-indicator"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Kısayollar & Favoriler Tab */}
                {activeTab === 'shortcuts' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Kısayollar & Favoriler</h2>
                        </div>

                        {/* Sık Kullanılan Sayfalar */}
                        <div className="shortcuts-section">
                            <h3>Sık Kullanılan Sayfalar</h3>
                            <div className="shortcuts-grid">
                                {shortcuts.map((shortcut) => (
                                    <a
                                        key={shortcut.id}
                                        href={shortcut.path}
                                        className="shortcut-card"
                                        style={{ borderColor: shortcut.color }}
                                    >
                                        <div className="shortcut-icon" style={{ backgroundColor: shortcut.color }}>
                                            {shortcut.icon}
                                        </div>
                                        <span className="shortcut-name">{shortcut.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Favori Raporlar */}
                        <div className="favorites-section">
                            <h3>Favori Raporlar</h3>
                            <div className="favorites-list">
                                {favoriteReports.map((report) => (
                                    <div key={report.id} className="favorite-item">
                                        <div className="favorite-icon">📊</div>
                                        <div className="favorite-info">
                                            <span className="favorite-name">{report.name}</span>
                                            <span className="favorite-date">
                                                Son oluşturulma: {new Date(report.lastGenerated).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <button className="btn-generate">Oluştur</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Widget Tercihleri */}
                        <div className="widgets-section">
                            <h3>Dashboard Widget'ları</h3>
                            <p className="section-description">
                                Dashboard'unuzda görüntülemek istediğiniz widget'ları seçin
                            </p>
                            <div className="widgets-grid">
                                <label className="widget-card">
                                    <input type="checkbox" defaultChecked />
                                    <div className="widget-preview">
                                        <span className="widget-icon">📊</span>
                                        <span className="widget-name">İstatistikler</span>
                                    </div>
                                </label>
                                <label className="widget-card">
                                    <input type="checkbox" defaultChecked />
                                    <div className="widget-preview">
                                        <span className="widget-icon">📅</span>
                                        <span className="widget-name">Randevular</span>
                                    </div>
                                </label>
                                <label className="widget-card">
                                    <input type="checkbox" defaultChecked />
                                    <div className="widget-preview">
                                        <span className="widget-icon">🐾</span>
                                        <span className="widget-name">Son Hastalar</span>
                                    </div>
                                </label>
                                <label className="widget-card">
                                    <input type="checkbox" />
                                    <div className="widget-preview">
                                        <span className="widget-icon">📦</span>
                                        <span className="widget-name">Stok Uyarıları</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Oturumlar Tab */}
                {activeTab === 'sessions' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Aktif Oturumlar</h2>
                        </div>

                        <div className="sessions-list">
                            {mockSessions.map((session) => (
                                <div key={session.id} className={`session-card ${session.isCurrent ? 'current' : ''}`}>
                                    <div className="session-icon">
                                        {session.device.includes('Windows') ? '💻' : '📱'}
                                    </div>
                                    <div className="session-info">
                                        <div className="session-device">
                                            {session.device}
                                            {session.isCurrent && <span className="current-badge">Mevcut Oturum</span>}
                                        </div>
                                        <div className="session-details">
                                            <span>📍 {session.location}</span>
                                            <span>🌐 {session.ip}</span>
                                            <span>🕒 {session.lastActive}</span>
                                        </div>
                                    </div>
                                    {!session.isCurrent && (
                                        <button className="btn-terminate">
                                            Sonlandır
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="danger-zone">
                            <h3>Tehlikeli Bölge</h3>
                            <p>Tüm oturumları sonlandırarak hesabınızı diğer cihazlardan çıkış yapabilirsiniz.</p>
                            <button className="btn-danger">
                                Tüm Diğer Oturumları Sonlandır
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

