import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Clock, Calendar } from 'lucide-react';
import '../styles/AppointmentForm.css';
import { LegacyAppointment, AppointmentFormData } from '../types/appointment';
import { googleCalendarService } from '../../../services/googleCalendarService';

interface AppointmentFormProps {
    appointment: LegacyAppointment | null;
    selectedDate: Date;
    onSave: (formData: AppointmentFormData) => void;
    onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
    appointment,
    selectedDate,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState<AppointmentFormData>({
        time: '',
        patientName: '',
        patientId: '',
        phone: '',
        ownerName: '',
        chipNumber: '',
        breed: '',
        petType: '',
        description: ''
    });

    // Google Calendar entegrasyonu için state
    const [addToGoogleCalendar, setAddToGoogleCalendar] = useState<boolean>(false);
    const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
    const [googleCalendarLoading, setGoogleCalendarLoading] = useState<boolean>(false);

    useEffect(() => {
        if (appointment) {
            setFormData({
                time: appointment.time || '',
                patientName: appointment.patientName || '',
                patientId: appointment.patientId || '',
                phone: appointment.phone || '',
                ownerName: appointment.ownerName || '',
                chipNumber: appointment.chipNumber || '',
                breed: appointment.breed || '',
                petType: appointment.petType || '',
                description: appointment.description || ''
            });
        }
    }, [appointment]);

    // Google Calendar bağlantı durumunu kontrol et
    useEffect(() => {
        const checkGoogleConnection = async () => {
            try {
                await googleCalendarService.initialize();
                const connected = googleCalendarService.isSignedIn();
                setIsGoogleConnected(connected);
            } catch (error) {
                console.error('Google Calendar connection check failed:', error);
                setIsGoogleConnected(false);
            }
        };

        checkGoogleConnection();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            // Önce randevuyu kaydet
            await onSave(formData);

            // Eğer Google Calendar'a ekleme seçildiyse
            if (addToGoogleCalendar && isGoogleConnected) {
                try {
                    // Randevu verilerini Google Calendar formatına dönüştür
                    const appointmentForGoogle: LegacyAppointment = {
                        id: Date.now().toString(), // Geçici ID
                        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD formatı
                        time: formData.time,
                        patientName: formData.patientName,
                        patientId: formData.patientId,
                        phone: formData.phone,
                        ownerName: formData.ownerName,
                        chipNumber: formData.chipNumber,
                        breed: formData.breed,
                        petType: formData.petType,
                        description: formData.description
                    };

                    // Google Calendar'a ekle
                    const eventId = await googleCalendarService.addAppointmentToCalendar(appointmentForGoogle);
                    console.log('Randevu Google Takvim\'e eklendi:', eventId);

                    // Başarı mesajı göster (bu kısım daha sonra toast notification ile geliştirilebilir)
                    alert('Randevu başarıyla Google Takvim\'e eklendi!');
                } catch (googleError) {
                    console.error('Google Calendar error:', googleError);
                    alert('Randevu kaydedildi ancak Google Takvim\'e eklenirken hata oluştu.');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Randevu kaydedilirken hata oluştu.');
        }
    };

    // Google Calendar bağlantı fonksiyonları
    const handleGoogleCalendarToggle = (e: ChangeEvent<HTMLInputElement>) => {
        setAddToGoogleCalendar(e.target.checked);
    };

    const handleGoogleCalendarConnect = async () => {
        setGoogleCalendarLoading(true);
        try {
            const success = await googleCalendarService.signIn();
            if (success) {
                setIsGoogleConnected(true);
                setAddToGoogleCalendar(true);
            }
        } catch (error) {
            console.error('Google Calendar connection failed:', error);
        } finally {
            setGoogleCalendarLoading(false);
        }
    };

    const handleGoogleCalendarDisconnect = async () => {
        try {
            await googleCalendarService.signOut();
            setIsGoogleConnected(false);
            setAddToGoogleCalendar(false);
        } catch (error) {
            console.error('Google Calendar disconnection failed:', error);
        }
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('tr-TR', options);
    };

    return (
        <div className="appointment-form-overlay">
            <div className="appointment-form">
                <div className="form-header">
                    <h2>{appointment ? 'Randevu Düzenle' : 'Randevu Al'}</h2>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Tarih</h3>
                        <div className="date-display">
                            {formatDate(selectedDate)}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Saat</h3>
                        <div className="time-input-container">
                            <Clock size={20} className="time-icon" />
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                required
                                className="time-input"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Hasta Sahibi Bilgileri</h3>
                        <div className="form-group">
                            <label>Hasta Sahibi Adı</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                placeholder="Hasta sahibi adı"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>TC Kimlik No</label>
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleInputChange}
                                placeholder="11 haneli TC kimlik no"
                                required
                                className="form-input"
                                maxLength={11}
                            />
                        </div>

                        <div className="form-group">
                            <label>Telefon</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Telefon numarası"
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Hayvan Bilgileri</h3>
                        <div className="form-group">
                            <label>Hayvan Adı</label>
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleInputChange}
                                placeholder="Hayvan adı"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Çip No</label>
                            <input
                                type="text"
                                name="chipNumber"
                                value={formData.chipNumber}
                                onChange={handleInputChange}
                                placeholder="Hayvan çip numarası"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Tür</label>
                            <input
                                type="text"
                                name="petType"
                                value={formData.petType}
                                onChange={handleInputChange}
                                placeholder="Hayvan türü"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Irk</label>
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                placeholder="Hayvan ırkı"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Açıklama</h3>
                        <div className="form-group">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Randevu açıklaması (isteğe bağlı)"
                                className="form-textarea"
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Google Calendar Entegrasyonu */}
                    <div className="form-section">
                        <h3>Google Takvim Entegrasyonu</h3>
                        <div className="form-group">
                            {!isGoogleConnected ? (
                                <div className="google-connect-section">
                                    <p className="google-info">
                                        Randevunuzu Google Takvim'e eklemek için Google hesabınızı bağlayın
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleGoogleCalendarConnect}
                                        disabled={googleCalendarLoading}
                                        className="google-connect-btn"
                                    >
                                        {googleCalendarLoading ? (
                                            'Bağlanıyor...'
                                        ) : (
                                            <>
                                                <Calendar size={16} />
                                                Google Hesabını Bağla
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="google-connected-section">
                                    <div className="google-status">
                                        <span className="google-status-text">
                                            ✅ Google hesabı bağlı
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleGoogleCalendarDisconnect}
                                            className="google-disconnect-btn"
                                        >
                                            Bağlantıyı Kes
                                        </button>
                                    </div>
                                    <div className="google-calendar-option">
                                        <label className="google-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={addToGoogleCalendar}
                                                onChange={handleGoogleCalendarToggle}
                                                className="google-checkbox"
                                            />
                                            <span className="google-checkbox-text">
                                                Bu randevuyu Google Takvim'e ekle
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            İptal
                        </button>
                        <button type="submit" className="save-btn">
                            {appointment ? 'Güncelle' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm; 