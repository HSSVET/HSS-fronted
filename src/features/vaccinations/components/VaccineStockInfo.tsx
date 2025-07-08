import React, { useState, useEffect } from 'react';
import { vaccinationService } from '../services/vaccinationService';
import { Vaccine, VaccineStock, VaccinationFilters, AnimalType, ApplicationMethod } from '../types/vaccination';

const VaccineStockInfo: React.FC = () => {
    const [vaccines, setVaccines] = useState<Array<Vaccine & { stock: VaccineStock[] }>>([]);
    const [filteredVaccines, setFilteredVaccines] = useState<Array<Vaccine & { stock: VaccineStock[] }>>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<VaccinationFilters>({});
    const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);

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
    }, [filters.animalType]);

    useEffect(() => {
        let filtered = [...vaccines];

        // Arama filtresi - genişletildi
        if (searchTerm) {
            filtered = filtered.filter(vaccine =>
                vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vaccine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vaccine.diseaseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getAnimalTypeText(vaccine.animalType).toLowerCase().includes(searchTerm.toLowerCase()) ||
                vaccine.animalBreeds.some(breed => breed.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Hayvan türü filtresi
        if (filters.animalType) {
            filtered = filtered.filter(vaccine => vaccine.animalType === filters.animalType);
        }

        // Hayvan ırkı filtresi
        if (filters.breed) {
            filtered = filtered.filter(vaccine =>
                vaccine.animalBreeds.includes(filters.breed!) || vaccine.animalBreeds.includes('Tüm ırklar')
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
        const methods = {
            subcutaneous: 'Deri Altı',
            intramuscular: 'Kas İçi',
            intranasal: 'Burun İçi',
            oral: 'Ağızdan',
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

    if (loading) {
        return (
            <div className="loading-state">
                <div>Aşı stok bilgileri yükleniyor...</div>
            </div>
        );
    }

    return (
        <div>
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
                                <th>İşlemler</th>
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
                                            <div>{getAnimalTypeText(vaccine.animalType)}</div>
                                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                {vaccine.animalBreeds.slice(0, 2).join(', ')}
                                                {vaccine.animalBreeds.length > 2 && '...'}
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
                                                {vaccine.diseaseType}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '150px', fontSize: '12px', color: '#6c757d' }}>
                                                {vaccine.sideEffects}
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
                                                <button className="action-btn view">
                                                    👁️ Görüntüle
                                                </button>
                                                <button className="action-btn edit">
                                                    ✏️ Düzenle
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VaccineStockInfo; 