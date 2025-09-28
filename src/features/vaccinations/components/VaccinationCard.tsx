import React, { useState, useEffect } from 'react';
import { AnimalVaccinationCard, VaccinationRecord } from '../types/vaccination';
import { vaccinationService } from '../services/vaccinationService';
import { AnimalService, type AnimalRecord } from '../../animals/services/animalService';
import AddVaccinationModal from './AddVaccinationModal';
import '../styles/Vaccination.css';

const VaccinationCard: React.FC = () => {
    const [animals, setAnimals] = useState<AnimalRecord[]>([]);
    const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');
    const [vaccinationCard, setVaccinationCard] = useState<AnimalVaccinationCard | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadAnimals();
    }, []);

    useEffect(() => {
        if (selectedAnimalId) {
            loadVaccinationCard(selectedAnimalId);
        }
    }, [selectedAnimalId]);

    const loadAnimals = async () => {
        try {
            setLoading(true);
            const response = await AnimalService.getAllAnimals();
            if (response.success && response.data) {
                setAnimals(response.data);
            } else {
                setAnimals([]);
            }
        } catch (error) {
            console.error('Hayvanlar yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadVaccinationCard = async (animalId: string) => {
        try {
            setLoading(true);
            const response = await vaccinationService.getAnimalVaccinationCard(animalId);
            setVaccinationCard(response.data);
        } catch (error) {
            console.error('Aşı karnesi yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintCard = () => {
        window.print();
    };

    const handleExportPDF = async () => {
        if (!vaccinationCard) return;

        try {
            const pdfBlob = await vaccinationService.exportVaccinationCardPDF(vaccinationCard.animalId);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${vaccinationCard.animalName}-asi-karnesi.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF oluşturulurken hata:', error);
        }
    };

    const handleAddVaccination = async (vaccinationData: Partial<VaccinationRecord>) => {
        if (!selectedAnimalId) return;

        try {
            await vaccinationService.addVaccinationRecord(selectedAnimalId, vaccinationData);
            await loadVaccinationCard(selectedAnimalId);
            setShowAddModal(false);
        } catch (error) {
            console.error('Aşı kaydı eklenirken hata:', error);
        }
    };

    const getVaccinationStatus = (record: VaccinationRecord) => {
        if (!record.nextDueDate) return 'completed';

        const now = new Date();
        const dueDate = new Date(record.nextDueDate);
        const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'overdue';
        if (diffDays <= 30) return 'due-soon';
        return 'current';
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('tr-TR');
    };

    if (loading && !vaccinationCard) {
        return (
            <div className="vaccination-card-container">
                <div className="loading-state">
                    <div>Veriler yükleniyor...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="vaccination-card-container">
            {/* Header with Animal Selection */}
            <div className="card-header">
                <div className="animal-selection">
                    <label htmlFor="animal-select">Hasta Seçiniz:</label>
                    <select
                        id="animal-select"
                        value={selectedAnimalId}
                        onChange={(e) => setSelectedAnimalId(e.target.value)}
                        className="animal-select"
                    >
                        <option value="">-- Hayvan Seçiniz --</option>
                        {animals.map((animal) => (
                            <option key={animal.id} value={animal.id}>
                                {animal.name} - {animal.species?.name || 'Tür Bilinmiyor'} ({animal.owner?.name || 'Bilinmiyor'})
                            </option>
                        ))}
                    </select>
                </div>

                {vaccinationCard && (
                    <div className="card-actions">
                        <button
                            className="action-btn add-vaccination"
                            onClick={() => setShowAddModal(true)}
                        >
                            ➕ Aşı Ekle
                        </button>
                        <button
                            className="action-btn print-card"
                            onClick={handlePrintCard}
                        >
                            🖨️ Yazdır
                        </button>
                        <button
                            className="action-btn export-pdf"
                            onClick={handleExportPDF}
                        >
                            📄 PDF İndir
                        </button>
                    </div>
                )}
            </div>

            {/* Vaccination Card */}
            {vaccinationCard ? (
                <div className="vaccination-card-content" id="vaccination-card-print">
                    {/* Card Header */}
                    <div className="card-header-print">
                        <div className="clinic-info">
                            <h2>🏥 {vaccinationCard.clinicInfo.name}</h2>
                            <p>{vaccinationCard.clinicInfo.address}</p>
                            <p>📞 {vaccinationCard.clinicInfo.phone}</p>
                            <p>Lisans No: {vaccinationCard.clinicInfo.license}</p>
                        </div>
                        <div className="card-title">
                            <h1>🐾 AŞI KARNESİ</h1>
                            <p>Karne No: {vaccinationCard.animalId}</p>
                        </div>
                    </div>

                    {/* Animal Information */}
                    <div className="animal-info-section">
                        <h3>🐕 Hayvan Bilgileri</h3>
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="label">Adı:</span>
                                <span className="value">{vaccinationCard.animalName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Türü:</span>
                                <span className="value">{vaccinationCard.animalSpecies}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Irkı:</span>
                                <span className="value">{vaccinationCard.animalBreed || 'Belirtilmemiş'}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Yaşı:</span>
                                <span className="value">{vaccinationCard.animalAge} yaş</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Cinsiyeti:</span>
                                <span className="value">{vaccinationCard.animalGender}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Ağırlığı:</span>
                                <span className="value">{vaccinationCard.animalWeight ? `${vaccinationCard.animalWeight} kg` : 'Belirtilmemiş'}</span>
                            </div>
                            {vaccinationCard.microchipId && (
                                <div className="info-row">
                                    <span className="label">Mikroçip:</span>
                                    <span className="value">{vaccinationCard.microchipId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className="owner-info-section">
                        <h3>👤 Sahip Bilgileri</h3>
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="label">Adı:</span>
                                <span className="value">{vaccinationCard.ownerName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Telefon:</span>
                                <span className="value">{vaccinationCard.ownerPhone}</span>
                            </div>
                            {vaccinationCard.ownerEmail && (
                                <div className="info-row">
                                    <span className="label">E-posta:</span>
                                    <span className="value">{vaccinationCard.ownerEmail}</span>
                                </div>
                            )}
                            {vaccinationCard.ownerAddress && (
                                <div className="info-row">
                                    <span className="label">Adres:</span>
                                    <span className="value">{vaccinationCard.ownerAddress}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vaccination History */}
                    <div className="vaccination-history-section">
                        <h3>💉 Aşı Geçmişi</h3>
                        {vaccinationCard.vaccinationHistory.length > 0 ? (
                            <div className="vaccination-table-wrapper">
                                <table className="vaccination-history-table">
                                    <thead>
                                        <tr>
                                            <th>Tarih</th>
                                            <th>Aşı Adı</th>
                                            <th>Üretici</th>
                                            <th>Doz</th>
                                            <th>Veteriner</th>
                                            <th>Sonraki Aşı</th>
                                            <th>Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vaccinationCard.vaccinationHistory
                                            .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
                                            .map((record) => (
                                                <tr key={record.id}>
                                                    <td>{formatDate(record.applicationDate)}</td>
                                                    <td className="vaccine-name">{record.vaccineName}</td>
                                                    <td>{record.manufacturer}</td>
                                                    <td>{record.dose}</td>
                                                    <td>{record.veterinarianName}</td>
                                                    <td>{record.nextDueDate ? formatDate(record.nextDueDate) : '-'}</td>
                                                    <td>
                                                        <span className={`status-badge ${getVaccinationStatus(record)}`}>
                                                            {getVaccinationStatus(record) === 'completed' && '✅ Tamamlandı'}
                                                            {getVaccinationStatus(record) === 'current' && '🟢 Geçerli'}
                                                            {getVaccinationStatus(record) === 'due-soon' && '🟡 Yaklaşıyor'}
                                                            {getVaccinationStatus(record) === 'overdue' && '🔴 Gecikti'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Henüz aşı kaydı bulunmamaktadır.</p>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Vaccinations */}
                    {vaccinationCard.upcomingVaccinations.length > 0 && (
                        <div className="upcoming-vaccinations-section">
                            <h3>📅 Yaklaşan Aşılar</h3>
                            <div className="upcoming-list">
                                {vaccinationCard.upcomingVaccinations.map((upcoming) => (
                                    <div key={upcoming.vaccineId} className={`upcoming-item ${upcoming.priority}`}>
                                        <div className="upcoming-vaccine">{upcoming.vaccineName}</div>
                                        <div className="upcoming-date">{formatDate(upcoming.scheduledDate)}</div>
                                        <div className="upcoming-priority">
                                            {upcoming.isOverdue ? '🔴 Gecikti' :
                                                upcoming.priority === 'high' ? '🟡 Acil' :
                                                    upcoming.priority === 'medium' ? '🟠 Orta' : '🟢 Normal'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Card Footer */}
                    <div className="card-footer">
                        <div className="signature-section">
                            <div className="signature-box">
                                <p>Veteriner Hekim:</p>
                                <div className="signature-line"></div>
                                <p>{vaccinationCard.clinicInfo.veterinarianName}</p>
                                <p>Lisans No: {vaccinationCard.clinicInfo.veterinarianLicense}</p>
                            </div>
                            <div className="stamp-box">
                                <p>Kaşe ve İmza</p>
                                <div className="stamp-area"></div>
                            </div>
                        </div>
                        <div className="card-info">
                            <p>Karne Oluşturulma: {formatDate(vaccinationCard.cardCreatedDate)}</p>
                            <p>Son Güncelleme: {formatDate(vaccinationCard.lastUpdatedDate)}</p>
                            {vaccinationCard.qrCode && (
                                <div className="qr-code">
                                    <p>QR Kod ile Doğrula</p>
                                    <div className="qr-placeholder">📱</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : selectedAnimalId ? (
                <div className="empty-state">
                    <h3>Aşı karnesi bulunamadı</h3>
                    <p>Seçilen hayvan için aşı karnesi oluşturuluyor...</p>
                </div>
            ) : (
                <div className="empty-state">
                    <h3>Aşı Karnesi Görüntüleme</h3>
                    <p>Aşı karnesini görüntülemek için yukarıdan bir hayvan seçiniz.</p>
                </div>
            )}

            {/* Add Vaccination Modal */}
            {showAddModal && (
                <AddVaccinationModal
                    animalId={selectedAnimalId}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddVaccination}
                />
            )}
        </div>
    );
};

export default VaccinationCard; 
