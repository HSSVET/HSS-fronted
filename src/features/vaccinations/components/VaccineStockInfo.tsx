import React, { useState, useEffect } from 'react';
import { vaccinationService } from '../services/vaccinationService';
import { Vaccine, VaccineStock, VaccinationFilters, AnimalType, ApplicationMethod } from '../types/vaccination';

const VaccineStockInfo: React.FC = () => {
    const [vaccines, setVaccines] = useState<Array<Vaccine & { stock: VaccineStock[] }>>([]);
    const [filteredVaccines, setFilteredVaccines] = useState<Array<Vaccine & { stock: VaccineStock[] }>>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<VaccinationFilters>({
        search: '',
        animalType: '',
        breed: '',
        stockStatus: ''
    });
    const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [newVaccine, setNewVaccine] = useState({
        name: '',
        manufacturer: '',
        diseaseType: '',
        animalType: '' as AnimalType | '',
        animalBreeds: [] as string[],
        dose: '',
        applicationMethod: '' as ApplicationMethod | '',
        protectionPeriod: '',
        minimumAge: '',
        sideEffects: '',
        notes: '',
        // Stok bilgileri
        serialNumber: '',
        batchNumber: '',
        expiryDate: '',
        quantity: 0,
        unitPrice: 0,
        supplier: '',
        receivedDate: new Date().toISOString().split('T')[0] // Bugünün tarihi
    });

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                setLoading(true);
                const vaccineData = await vaccinationService.getVaccineWithStock();
                setVaccines(vaccineData);
                setFilteredVaccines(vaccineData);
            } catch (error) {
                console.error('Aşı verileri yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVaccines();
    }, []);

    // Hayvan türü değiştiğinde ırkları güncelle
    useEffect(() => {
        if (filters.animalType) {
            const breeds = vaccinationService.getBreedsByAnimalType(filters.animalType);
            setAvailableBreeds(breeds);
            // Mevcut ırk seçimi geçerli değilse temizle
            if (filters.breed && !breeds.includes(filters.breed)) {
                setFilters(prev => ({ ...prev, breed: undefined }));
            }
        } else {
            setAvailableBreeds([]);
            setFilters(prev => ({ ...prev, breed: undefined }));
        }
    }, [filters.animalType, filters.breed]);

    useEffect(() => {
        let filtered = [...vaccines];

        // Arama filtresi - genişletildi
        if (searchTerm) {
            filtered = filtered.filter(vaccine =>
                vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vaccine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (vaccine.diseaseType || vaccine.diseaseTargets?.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (vaccine.animalType ? getAnimalTypeText(vaccine.animalType).toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
                (vaccine.animalBreeds || vaccine.breeds || []).some((breed: string) => breed.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Hayvan türü filtresi
        if (filters.animalType) {
            filtered = filtered.filter(vaccine =>
                vaccine.animalType === filters.animalType ||
                (filters.animalType && vaccine.animalTypes?.includes(filters.animalType))
            );
        }

        // Hayvan ırkı filtresi
        if (filters.breed) {
            filtered = filtered.filter(vaccine =>
                (vaccine.animalBreeds || vaccine.breeds || []).includes(filters.breed!) ||
                (vaccine.animalBreeds || vaccine.breeds || []).includes('Tüm ırklar')
            );
        }

        // Üretici filtresi
        if (filters.manufacturer) {
            filtered = filtered.filter(vaccine =>
                vaccine.manufacturer.toLowerCase().includes(filters.manufacturer!.toLowerCase())
            );
        }

        // Stok durumu filtresi
        if (filters.stockStatus) {
            filtered = filtered.filter(vaccine => {
                const totalStock = vaccine.stock.reduce((sum, stock) => sum + stock.quantity, 0);
                switch (filters.stockStatus) {
                    case 'available':
                        return totalStock > 10;
                    case 'low':
                        return totalStock > 0 && totalStock <= 10;
                    case 'out_of_stock':
                        return totalStock === 0;
                    default:
                        return true;
                }
            });
        }

        setFilteredVaccines(filtered);
    }, [vaccines, searchTerm, filters]);

    const getStockStatus = (stock: VaccineStock[]) => {
        const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
        if (totalStock === 0) return { status: 'critical', text: 'Stokta Yok', color: '#dc3545' };
        if (totalStock <= 5) return { status: 'low', text: `${totalStock} Adet`, color: '#ffc107' };
        return { status: 'available', text: `${totalStock} Adet`, color: '#28a745' };
    };

    const getApplicationMethodText = (method: ApplicationMethod) => {
        const methods: Record<ApplicationMethod, string> = {
            injection: 'Enjeksiyon',
            oral: 'Ağızdan',
            nasal: 'Burun İçi',
            subcutaneous: 'Deri Altı',
            intramuscular: 'Kas İçi',
            intranasal: 'Burun İçi',
            intradermal: 'Deri İçi'
        };
        return methods[method] || method;
    };

    const getAnimalTypeText = (type: AnimalType) => {
        const types = {
            dog: 'Köpek',
            cat: 'Kedi',
            bird: 'Kuş',
            rabbit: 'Tavşan',
            hamster: 'Hamster',
            other: 'Diğer'
        };
        return types[type] || type;
    };

    const handleAnimalTypeChange = (animalType: string) => {
        setFilters({
            ...filters,
            animalType: animalType as AnimalType || undefined,
            breed: undefined // Tür değiştiğinde ırkı sıfırla
        });
    };

    // Form için hayvan türü değişikliği
    const handleNewVaccineAnimalTypeChange = (animalType: string) => {
        setNewVaccine({
            ...newVaccine,
            animalType: animalType as AnimalType || '',
            animalBreeds: [] // Tür değiştiğinde ırkları sıfırla
        });
    };

    // İrk seçimi toggle
    const handleBreedToggle = (breed: string) => {
        const updatedBreeds = newVaccine.animalBreeds.includes(breed)
            ? newVaccine.animalBreeds.filter(b => b !== breed)
            : [...newVaccine.animalBreeds, breed];

        setNewVaccine({
            ...newVaccine,
            animalBreeds: updatedBreeds
        });
    };

    // Form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newVaccine.name || !newVaccine.animalType || !newVaccine.serialNumber) {
            alert('Lütfen gerekli alanları doldurun!');
            return;
        }

        try {
            setIsSubmitting(true);

            // Aşı bilgilerini hazırla
            const vaccineData = {
                name: newVaccine.name,
                manufacturer: newVaccine.manufacturer,
                diseaseType: newVaccine.diseaseType,
                animalType: newVaccine.animalType as AnimalType,
                animalBreeds: newVaccine.animalBreeds.length > 0 ? newVaccine.animalBreeds : ['Tüm ırklar'],
                dose: newVaccine.dose,
                applicationMethod: newVaccine.applicationMethod as ApplicationMethod,
                protectionPeriod: newVaccine.protectionPeriod,
                minimumAge: newVaccine.minimumAge,
                sideEffects: newVaccine.sideEffects,
                notes: newVaccine.notes,
                isActive: true
            };

            // Stok bilgilerini hazırla
            const stockData = {
                serialNumber: newVaccine.serialNumber,
                batchNumber: newVaccine.batchNumber,
                expiryDate: newVaccine.expiryDate,
                quantity: newVaccine.quantity,
                unitPrice: newVaccine.unitPrice,
                supplier: newVaccine.supplier,
                receivedDate: newVaccine.receivedDate
            };

            // Aşı ve stok bilgilerini birlikte kaydet
            await vaccinationService.addVaccineWithStock(vaccineData, stockData);

            // Listeyi yenile
            const updatedVaccines = await vaccinationService.getVaccineWithStock();
            setVaccines(updatedVaccines);
            setFilteredVaccines(updatedVaccines);

            // Modalı kapat ve formu sıfırla
            setShowAddModal(false);
            setNewVaccine({
                name: '',
                manufacturer: '',
                diseaseType: '',
                animalType: '',
                animalBreeds: [],
                dose: '',
                applicationMethod: '',
                protectionPeriod: '',
                minimumAge: '',
                sideEffects: '',
                notes: '',
                serialNumber: '',
                batchNumber: '',
                expiryDate: '',
                quantity: 0,
                unitPrice: 0,
                supplier: '',
                receivedDate: new Date().toISOString().split('T')[0]
            });

            alert('Aşı ve stok bilgileri başarıyla eklendi!');
        } catch (error) {
            console.error('Aşı eklenirken hata:', error);
            alert('Aşı eklenirken bir hata oluştu!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div>Aşı stok bilgileri yükleniyor...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header ve Yeni Aşı Ekle Butonu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '20px' }}>
                <h3>Aşı Stok Bilgileri</h3>
                <button
                    className="add-vaccine-btn"
                    onClick={() => setShowAddModal(true)}
                >
                    ➕ Yeni Aşı Ekle
                </button>
            </div>

            {/* Filtreleme Bölümü */}
            <div className="filters-section">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Aşı adı, üretici, hastalık türü veya hayvan türü ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="filter-group">
                    <span className="filter-label">Hayvan Türü:</span>
                    <select
                        className="filter-select"
                        value={filters.animalType || ''}
                        onChange={(e) => handleAnimalTypeChange(e.target.value)}
                    >
                        <option value="">Tümü</option>
                        <option value="dog">Köpek</option>
                        <option value="cat">Kedi</option>
                        <option value="bird">Kuş</option>
                        <option value="rabbit">Tavşan</option>
                        <option value="hamster">Hamster</option>
                        <option value="other">Diğer</option>
                    </select>
                </div>

                {/* Hayvan türü seçilince ırk filtresi göster */}
                {filters.animalType && availableBreeds.length > 0 && (
                    <div className="filter-group">
                        <span className="filter-label">Hayvan Irkı:</span>
                        <select
                            className="filter-select"
                            value={filters.breed || ''}
                            onChange={(e) => setFilters({ ...filters, breed: e.target.value || undefined })}
                        >
                            <option value="">Tüm Irklar</option>
                            {availableBreeds.map((breed) => (
                                <option key={breed} value={breed}>
                                    {breed}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="filter-group">
                    <span className="filter-label">Stok Durumu:</span>
                    <select
                        className="filter-select"
                        value={filters.stockStatus || ''}
                        onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value as any || undefined })}
                    >
                        <option value="">Tümü</option>
                        <option value="available">Mevcut</option>
                        <option value="low">Düşük</option>
                        <option value="out_of_stock">Stokta Yok</option>
                    </select>
                </div>
            </div>

            {/* Aşı Tablosu */}
            <div style={{ padding: '20px' }}>
                {filteredVaccines.length === 0 ? (
                    <div className="empty-state">
                        <h3>Aşı bulunamadı</h3>
                        <p>Arama kriterlerinize uygun aşı bulunamadı.</p>
                    </div>
                ) : (
                    <table className="vaccine-table">
                        <thead>
                            <tr>
                                <th>Aşı Adı</th>
                                <th>Üretici</th>
                                <th>Uygun Türler</th>
                                <th>Son Kullanma</th>
                                <th>Doz</th>
                                <th>Koruma Sağladığı Hastalıklar</th>
                                <th>Yan Etkiler</th>
                                <th>Stok Durumu</th>
                                <th>Toplam Stok</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVaccines.map((vaccine) => {
                                const stockStatus = getStockStatus(vaccine.stock);
                                const latestStock = vaccine.stock.sort((a, b) =>
                                    new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
                                )[0];

                                return (
                                    <tr key={vaccine.id}>
                                        <td>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {vaccine.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                {getApplicationMethodText(vaccine.applicationMethod)}
                                            </div>
                                        </td>
                                        <td>{vaccine.manufacturer}</td>
                                        <td>
                                            <div>{vaccine.animalType ? getAnimalTypeText(vaccine.animalType) : (vaccine.animalTypes?.join(', ') || '-')}</div>
                                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                {(vaccine.animalBreeds || vaccine.breeds || []).slice(0, 2).join(', ')}
                                                {(vaccine.animalBreeds || vaccine.breeds || []).length > 2 && '...'}
                                            </div>
                                        </td>
                                        <td>
                                            {latestStock ? (
                                                <div style={{ fontSize: '13px' }}>
                                                    {new Date(latestStock.expiryDate).toLocaleDateString('tr-TR')}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#6c757d' }}>-</span>
                                            )}
                                        </td>
                                        <td>{vaccine.dose}</td>
                                        <td>
                                            <div style={{ maxWidth: '200px', fontSize: '13px' }}>
                                                {vaccine.diseaseType || vaccine.diseaseTargets?.join(', ') || '-'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '150px', fontSize: '12px', color: '#6c757d' }}>
                                                {Array.isArray(vaccine.sideEffects) ? vaccine.sideEffects.join(', ') : (vaccine.sideEffects || '-')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`stock-status ${stockStatus.status}`}>
                                                <span style={{ marginRight: '5px' }}>●</span>
                                                {stockStatus.text}
                                            </div>
                                            {vaccine.stock.length > 0 && (
                                                <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '2px' }}>
                                                    Seri: {vaccine.stock[0].serialNumber}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <span style={{ color: '#6c757d', fontSize: '13px' }}>
                                                    Stok: {vaccine.stock.reduce((sum, s) => sum + s.quantity, 0)} adet
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Yeni Aşı Ekleme Modalı */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Yeni Aşı Ekle</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="vaccine-form">
                            <div className="form-section">
                                <h4>Aşı Bilgileri</h4>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Aşı Adı *</label>
                                        <input
                                            type="text"
                                            value={newVaccine.name}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Üretici</label>
                                        <input
                                            type="text"
                                            value={newVaccine.manufacturer}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, manufacturer: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Koruma Sağladığı Hastalıklar</label>
                                        <input
                                            type="text"
                                            value={newVaccine.diseaseType}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, diseaseType: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Hayvan Türü *</label>
                                        <select
                                            value={newVaccine.animalType}
                                            onChange={(e) => handleNewVaccineAnimalTypeChange(e.target.value)}
                                            required
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value="dog">Köpek</option>
                                            <option value="cat">Kedi</option>
                                            <option value="bird">Kuş</option>
                                            <option value="rabbit">Tavşan</option>
                                            <option value="hamster">Hamster</option>
                                            <option value="other">Diğer</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Hayvan Irkları Seçimi */}
                                {newVaccine.animalType && (
                                    <div className="form-group">
                                        <label>Uygun Hayvan Irkları</label>
                                        <div className="breeds-selection">
                                            {vaccinationService.getBreedsByAnimalType(newVaccine.animalType as AnimalType).map((breed) => (
                                                <label key={breed} className="breed-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={newVaccine.animalBreeds.includes(breed)}
                                                        onChange={() => handleBreedToggle(breed)}
                                                    />
                                                    {breed}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Doz</label>
                                        <input
                                            type="text"
                                            value={newVaccine.dose}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, dose: e.target.value })}
                                            placeholder="örn: 1 ml"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Uygulama Yöntemi</label>
                                        <select
                                            value={newVaccine.applicationMethod}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, applicationMethod: e.target.value as ApplicationMethod })}
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value="subcutaneous">Deri Altı</option>
                                            <option value="intramuscular">Kas İçi</option>
                                            <option value="intranasal">Burun İçi</option>
                                            <option value="oral">Ağızdan</option>
                                            <option value="intradermal">Deri İçi</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Koruma Süresi</label>
                                        <input
                                            type="text"
                                            value={newVaccine.protectionPeriod}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, protectionPeriod: e.target.value })}
                                            placeholder="örn: 12 ay"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Minimum Yaş</label>
                                        <input
                                            type="text"
                                            value={newVaccine.minimumAge}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, minimumAge: e.target.value })}
                                            placeholder="örn: 6 hafta"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Yan Etkiler</label>
                                    <textarea
                                        value={newVaccine.sideEffects}
                                        onChange={(e) => setNewVaccine({ ...newVaccine, sideEffects: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Notlar</label>
                                    <textarea
                                        value={newVaccine.notes}
                                        onChange={(e) => setNewVaccine({ ...newVaccine, notes: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h4>Stok Bilgileri</h4>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Seri Numarası *</label>
                                        <input
                                            type="text"
                                            value={newVaccine.serialNumber}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, serialNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Batch Numarası</label>
                                        <input
                                            type="text"
                                            value={newVaccine.batchNumber}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, batchNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Son Kullanma Tarihi</label>
                                        <input
                                            type="date"
                                            value={newVaccine.expiryDate}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, expiryDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Miktar</label>
                                        <input
                                            type="number"
                                            value={newVaccine.quantity}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, quantity: parseInt(e.target.value) || 0 })}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Birim Fiyat (₺)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newVaccine.unitPrice}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, unitPrice: parseFloat(e.target.value) || 0 })}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tedarikçi</label>
                                        <input
                                            type="text"
                                            value={newVaccine.supplier}
                                            onChange={(e) => setNewVaccine({ ...newVaccine, supplier: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Alım Tarihi</label>
                                    <input
                                        type="date"
                                        value={newVaccine.receivedDate}
                                        onChange={(e) => setNewVaccine({ ...newVaccine, receivedDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
                                    İptal
                                </button>
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Ekleniyor...' : 'Aşıyı Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VaccineStockInfo; 