import React, { useState } from 'react';

interface VaccineRecord {
    id: string;
    animalName: string;
    animalType: string;
    breed: string;
    vaccineName: string;
    applicationDate: string;
    nextDueDate: string;
    veterinarian: string;
    serialNumber: string;
    status: string;
}

const VaccineHistory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<VaccineRecord | null>(null);

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

    const handleViewDetail = (record: VaccineRecord) => {
        setSelectedRecord(record);
        setShowDetailDialog(true);
    };

    const handlePrint = (record: VaccineRecord) => {
        // Print window aç
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        // HTML içeriği oluştur
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Aşı Sertifikası - ${record.animalName}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    .certificate { border: 3px solid #000; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px; }
                    .header h1 { font-size: 32px; margin: 0 0 10px 0; }
                    .header p { font-size: 18px; color: #666; margin: 0; }
                    .info-section { margin: 30px 0; }
                    .info-section h2 { font-size: 20px; margin-bottom: 15px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                    .info-row { margin: 12px 0; padding: 8px; display: flex; }
                    .label { font-weight: bold; width: 200px; color: #555; }
                    .value { color: #000; }
                    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="header">
                        <h1>🐾 AŞI SERTİFİKASI</h1>
                        <p>Veteriner Kliniği</p>
                    </div>
                    
                    <div class="info-section">
                        <h2>Hayvan Bilgileri</h2>
                        <div class="info-row"><span class="label">Hayvan Adı:</span> <span class="value">${record.animalName}</span></div>
                        <div class="info-row"><span class="label">Tür:</span> <span class="value">${record.animalType}</span></div>
                        <div class="info-row"><span class="label">Irk:</span> <span class="value">${record.breed}</span></div>
                    </div>
                    
                    <div class="info-section">
                        <h2>Aşı Bilgileri</h2>
                        <div class="info-row"><span class="label">Aşı Adı:</span> <span class="value">${record.vaccineName}</span></div>
                        <div class="info-row"><span class="label">Uygulama Tarihi:</span> <span class="value">${new Date(record.applicationDate).toLocaleDateString('tr-TR')}</span></div>
                        <div class="info-row"><span class="label">Sonraki Aşı Tarihi:</span> <span class="value">${new Date(record.nextDueDate).toLocaleDateString('tr-TR')}</span></div>
                        <div class="info-row"><span class="label">Seri Numarası:</span> <span class="value">${record.serialNumber}</span></div>
                    </div>
                    
                    <div class="info-section">
                        <h2>Veteriner Bilgileri</h2>
                        <div class="info-row"><span class="label">Veteriner Hekim:</span> <span class="value">${record.veterinarian}</span></div>
                    </div>
                    
                    <div class="footer">
                        <p>Bu sertifika ${new Date().toLocaleDateString('tr-TR')} tarihinde otomatik olarak oluşturulmuştur.</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
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
                                            <button
                                                className="action-btn view"
                                                onClick={() => handleViewDetail(record)}
                                            >
                                                📄 Detay
                                            </button>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handlePrint(record)}
                                            >
                                                🖨️ Yazdır
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Dialog */}
            {showDetailDialog && selectedRecord && (
                <div className="modal-overlay" onClick={() => setShowDetailDialog(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>🐾 Aşı Detayları</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowDetailDialog(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #4CAF50', paddingBottom: '8px' }}>Hayvan Bilgileri</h4>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Hayvan Adı:</span>
                                        <span>{selectedRecord.animalName}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Tür:</span>
                                        <span>{selectedRecord.animalType}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Irk:</span>
                                        <span>{selectedRecord.breed}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #2196F3', paddingBottom: '8px' }}>Aşı Bilgileri</h4>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Aşı Adı:</span>
                                        <span>{selectedRecord.vaccineName}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Uygulama Tarihi:</span>
                                        <span>{new Date(selectedRecord.applicationDate).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Sonraki Aşı:</span>
                                        <span>{new Date(selectedRecord.nextDueDate).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Seri Numarası:</span>
                                        <span style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>{selectedRecord.serialNumber}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #FF9800', paddingBottom: '8px' }}>Veteriner Bilgileri</h4>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Veteriner Hekim:</span>
                                        <span>{selectedRecord.veterinarian}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ fontWeight: 'bold', width: '150px', color: '#555' }}>Durum:</span>
                                        <span>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: getStatusColor(selectedRecord.status) + '20',
                                                color: getStatusColor(selectedRecord.status)
                                            }}>
                                                {getStatusText(selectedRecord.status)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', padding: '15px 20px', borderTop: '1px solid #ddd', justifyContent: 'flex-end' }}>
                            <button
                                style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer' }}
                                onClick={() => setShowDetailDialog(false)}
                            >
                                Kapat
                            </button>
                            <button
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', background: '#4CAF50', color: 'white', cursor: 'pointer' }}
                                onClick={() => {
                                    handlePrint(selectedRecord);
                                    setShowDetailDialog(false);
                                }}
                            >
                                🖨️ Yazdır
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VaccineHistory; 