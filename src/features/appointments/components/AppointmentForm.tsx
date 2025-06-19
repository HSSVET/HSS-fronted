import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Clock } from 'lucide-react';
import '../styles/AppointmentForm.css';
import { LegacyAppointment, AppointmentFormData } from '../types/appointment';

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        onSave(formData);
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