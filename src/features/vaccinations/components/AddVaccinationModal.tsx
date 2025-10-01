import React, { useState, useEffect } from 'react';
import { VaccinationRecord, Vaccine } from '../types/vaccination';
import { vaccinationService } from '../services/vaccinationService';

interface AddVaccinationModalProps {
    animalId: string;
    onClose: () => void;
    onSave: (vaccinationData: Partial<VaccinationRecord>) => void;
}

const AddVaccinationModal: React.FC<AddVaccinationModalProps> = ({
    animalId,
    onClose,
    onSave
}) => {
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [formData, setFormData] = useState<Partial<VaccinationRecord>>({
        animalId,
        applicationDate: new Date(),
        applicationMethod: 'injection',
        isCompleted: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadVaccines();
    }, []);

    const loadVaccines = async () => {
        try {
            const response = await vaccinationService.getVaccines();
            setVaccines(response.data);
        } catch (error) {
            console.error('Aşılar yüklenirken hata:', error);
        }
    };

    const handleVaccineChange = (vaccineId: string) => {
        const selectedVaccine = vaccines.find(v => v.id === vaccineId);
        if (selectedVaccine) {
            setFormData(prev => ({
                ...prev,
                vaccineId,
                vaccineName: selectedVaccine.name,
                manufacturer: selectedVaccine.manufacturer,
                dose: selectedVaccine.dose
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.vaccineId || !formData.applicationDate || !formData.veterinarianName) {
            alert('Lütfen tüm gerekli alanları doldurunuz.');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Aşı kaydı eklenirken hata:', error);
            alert('Aşı kaydı eklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof VaccinationRecord, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>🐾 Aşı Karnesi - Yeni Aşı Kaydı</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="vaccine-form">
                    <div className="form-section">
                        <h4>💉 Aşı Bilgileri</h4>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Aşı Türü *</label>
                                <select
                                    value={formData.vaccineId || ''}
                                    onChange={(e) => handleVaccineChange(e.target.value)}
                                    required
                                >
                                    <option value="">-- Aşı Seçiniz --</option>
                                    {vaccines.map((vaccine) => (
                                        <option key={vaccine.id} value={vaccine.id}>
                                            {vaccine.name} - {vaccine.manufacturer}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Uygulama Tarihi *</label>
                                <input
                                    type="date"
                                    value={formData.applicationDate ?
                                        new Date(formData.applicationDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleChange('applicationDate', new Date(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Doz</label>
                                <input
                                    type="text"
                                    value={formData.dose || ''}
                                    onChange={(e) => handleChange('dose', e.target.value)}
                                    placeholder="ör: 1 ml"
                                />
                            </div>

                            <div className="form-group">
                                <label>Uygulama Yöntemi</label>
                                <select
                                    value={formData.applicationMethod || 'injection'}
                                    onChange={(e) => handleChange('applicationMethod', e.target.value)}
                                >
                                    <option value="injection">Enjeksiyon</option>
                                    <option value="oral">Ağızdan</option>
                                    <option value="nasal">Burundan</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Uygulama Bölgesi</label>
                                <input
                                    type="text"
                                    value={formData.applicationSite || ''}
                                    onChange={(e) => handleChange('applicationSite', e.target.value)}
                                    placeholder="ör: Sol arka bacak"
                                />
                            </div>

                            <div className="form-group">
                                <label>Batch/Seri Numarası</label>
                                <input
                                    type="text"
                                    value={formData.batchNumber || ''}
                                    onChange={(e) => handleChange('batchNumber', e.target.value)}
                                    placeholder="ör: ABC123456"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>👨‍⚕️ Veteriner Bilgileri</h4>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Veteriner Hekim Adı *</label>
                                <input
                                    type="text"
                                    value={formData.veterinarianName || ''}
                                    onChange={(e) => handleChange('veterinarianName', e.target.value)}
                                    placeholder="Dr. Adı Soyadı"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Veteriner ID</label>
                                <input
                                    type="text"
                                    value={formData.veterinarianId || ''}
                                    onChange={(e) => handleChange('veterinarianId', e.target.value)}
                                    placeholder="Veteriner sistem ID"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>📅 Takip Bilgileri</h4>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Sonraki Aşı Tarihi</label>
                                <input
                                    type="date"
                                    value={formData.nextDueDate ?
                                        new Date(formData.nextDueDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleChange('nextDueDate',
                                        e.target.value ? new Date(e.target.value) : undefined)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Sertifika Numarası</label>
                                <input
                                    type="text"
                                    value={formData.certificateNumber || ''}
                                    onChange={(e) => handleChange('certificateNumber', e.target.value)}
                                    placeholder="Aşı sertifika numarası"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Notlar</label>
                            <textarea
                                value={formData.notes || ''}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                placeholder="Aşı uygulaması ile ilgili notlar, yan etkiler vb."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} disabled={loading}>
                            İptal
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVaccinationModal; 