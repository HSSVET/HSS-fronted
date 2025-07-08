import React, { useState } from 'react';

const VaccineHistory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock aşı geçmiş verileri
    const vaccineHistory = [
        {
            id: '1',
            animalName: 'Max',
            animalType: 'Köpek',
            breed: 'Golden Retriever',
            vaccineName: 'Kuduz Aşısı',
            applicationDate: '2024-06-15',
            nextDueDate: '2025-06-15',
            veterinarian: 'Dr. Mehmet Yılmaz',
            serialNumber: 'VBT-KDZ-2024-001',
            status: 'completed'
        },
        {
            id: '2',
            animalName: 'Luna',
            animalType: 'Kedi',
            breed: 'Persian',
            vaccineName: 'Karma Aşı',
            applicationDate: '2024-05-20',
            nextDueDate: '2024-08-20',
            veterinarian: 'Dr. Ayşe Demir',
            serialNumber: 'PV-DHPP-2024-002',
            status: 'completed'
        },
        {
            id: '3',
            animalName: 'Rocky',
            animalType: 'Köpek',
            breed: 'German Shepherd',
            vaccineName: 'Parvovirus Aşısı',
            applicationDate: '2024-07-01',
            nextDueDate: '2024-09-01',
            veterinarian: 'Dr. Can Özkan',
            serialNumber: 'PV-PRV-2024-003',
            status: 'completed'
        }
    ];

    const getStatusText = (status: string) => {
        const statuses = {
            completed: 'Tamamlandı',
            scheduled: 'Planlandı',
            overdue: 'Gecikti',
            cancelled: 'İptal Edildi'
        };
        return (statuses as any)[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors = {
            completed: '#28a745',
            scheduled: '#007bff',
            overdue: '#dc3545',
            cancelled: '#6c757d'
        };
        return (colors as any)[status] || '#6c757d';
    };

    const filteredHistory = vaccineHistory.filter(record =>
        record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Arama */}
            <div className="filters-section">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Hayvan adı, aşı adı veya ırk ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Aşı Geçmişi Tablosu */}
            <div style={{ padding: '20px' }}>
                {filteredHistory.length === 0 ? (
                    <div className="empty-state">
                        <h3>Aşı geçmişi bulunamadı</h3>
                        <p>Arama kriterlerinize uygun aşı kaydı bulunamadı.</p>
                    </div>
                ) : (
                    <div className="vaccine-table-wrapper">
                        <table className="vaccine-table">
                            <thead>
                                <tr>
                                    <th>Hayvan</th>
                                    <th>Aşı</th>
                                    <th>Uygulama Tarihi</th>
                                    <th>Sonraki Aşı</th>
                                    <th>Veteriner</th>
                                    <th>Seri No</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((record) => (
                                    <tr key={record.id}>
                                        <td>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {record.animalName}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                {record.animalType} - {record.breed}
                                            </div>
                                        </td>
                                        <td>{record.vaccineName}</td>
                                        <td>
                                            {new Date(record.applicationDate).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>
                                                {new Date(record.nextDueDate).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#6c757d' }}>
                                                {Math.ceil((new Date(record.nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün kaldı
                                            </div>
                                        </td>
                                        <td>{record.veterinarian}</td>
                                        <td>
                                            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                                                {record.serialNumber}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: getStatusColor(record.status) + '20',
                                                    color: getStatusColor(record.status)
                                                }}
                                            >
                                                {getStatusText(record.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn view">
                                                    📄 Detay
                                                </button>
                                                <button className="action-btn edit">
                                                    🖨️ Yazdır
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaccineHistory; 