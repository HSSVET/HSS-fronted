import React, { useState, useEffect } from 'react';
import { vaccinationService } from '../services/vaccinationService';
import { Vaccine, AnimalType, ApplicationMethod } from '../types/vaccination';

const VaccineApplicationGuide: React.FC = () => {
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [filteredVaccines, setFilteredVaccines] = useState<Vaccine[]>([]);
    const [selectedAnimalType, setSelectedAnimalType] = useState<AnimalType | ''>('');
    const [selectedBreed, setSelectedBreed] = useState<string>('');
    const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                setLoading(true);
                const vaccineData = await vaccinationService.getVaccines();
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

    useEffect(() => {
        if (selectedAnimalType) {
            const breeds = vaccinationService.getBreedsByAnimalType(selectedAnimalType);
            setAvailableBreeds(breeds);
            setSelectedBreed('');
        } else {
            setAvailableBreeds([]);
            setSelectedBreed('');
        }
    }, [selectedAnimalType]);

    useEffect(() => {
        let filtered = [...vaccines];

        if (selectedAnimalType) {
            filtered = filtered.filter(v => v.animalType === selectedAnimalType);
        }

        if (selectedBreed) {
            filtered = filtered.filter(v =>
                v.animalBreeds.includes(selectedBreed) || v.animalBreeds.includes('Tüm ırklar')
            );
        }

        setFilteredVaccines(filtered);
    }, [vaccines, selectedAnimalType, selectedBreed]);

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
        setSelectedAnimalType(animalType as AnimalType || '');
        setSelectedBreed('');
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div>Aşı uygulama rehberi yükleniyor...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Filtreleme */}
            <div className="filters-section">
                <div className="filter-group">
                    <span className="filter-label">Hayvan Türü:</span>
                    <select
                        className="filter-select"
                        value={selectedAnimalType}
                        onChange={(e) => handleAnimalTypeChange(e.target.value)}
                    >
                        <option value="">Tüm Hayvan Türleri</option>
                        <option value="dog">Köpek</option>
                        <option value="cat">Kedi</option>
                        <option value="bird">Kuş</option>
                        <option value="rabbit">Tavşan</option>
                        <option value="hamster">Hamster</option>
                        <option value="other">Diğer</option>
                    </select>
                </div>

                {/* Hayvan türü seçilince ırk filtresi göster */}
                {selectedAnimalType && availableBreeds.length > 0 && (
                    <div className="filter-group">
                        <span className="filter-label">Hayvan Irkı:</span>
                        <select
                            className="filter-select"
                            value={selectedBreed}
                            onChange={(e) => setSelectedBreed(e.target.value)}
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
            </div>

            {/* Rehber Tablosu */}
            <div style={{ padding: '20px' }}>
                {filteredVaccines.length === 0 ? (
                    <div className="empty-state">
                        <h3>Aşı rehberi bulunamadı</h3>
                        <p>Seçilen kriterlere uygun aşı rehberi bulunamadı.</p>
                    </div>
                ) : (
                    <div className="vaccine-table-wrapper">
                        <table className="vaccine-table">
                            <thead>
                                <tr>
                                    <th>Aşı Adı</th>
                                    <th>Koruma Sağladığı Hastalıklar</th>
                                    <th>Uygun Türler</th>
                                    <th>Uygun İrklar</th>
                                    <th>Minimum Yaş</th>
                                    <th>Doz</th>
                                    <th>Yan Etkiler</th>
                                    <th>Notlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVaccines.map((vaccine) => (
                                    <tr key={vaccine.id}>
                                        <td>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {vaccine.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                {getApplicationMethodText(vaccine.applicationMethod)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '14px' }}>
                                                {vaccine.diseaseType}
                                            </div>
                                        </td>
                                        <td>{getAnimalTypeText(vaccine.animalType)}</td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>
                                                {vaccine.animalBreeds.join(', ')}
                                            </div>
                                        </td>
                                        <td>{vaccine.minimumAge}</td>
                                        <td>{vaccine.dose}</td>
                                        <td>
                                            <div style={{ fontSize: '12px', color: '#6c757d', maxWidth: '200px' }}>
                                                {vaccine.sideEffects}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '12px', color: '#6c757d', maxWidth: '200px' }}>
                                                {vaccine.notes}
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

export default VaccineApplicationGuide; 