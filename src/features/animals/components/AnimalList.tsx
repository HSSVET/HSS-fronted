import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  Event as EventIcon,
  Search as SearchIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Popover,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from 'react-window';
import { AnimalService, type AnimalRecord } from '../services/animalService';
import { useError } from '../../../context/ErrorContext';
import { useLoading } from '../../../hooks/useLoading';
import LoadingSpinner from '../../../components/LoadingSpinner';
import '../styles/AnimalList.css';
import { AnimalListItem } from '../types/animal';

interface AnimalListProps {
  onAddAnimal?: (animal: AnimalListItem) => void;
}

type FilterFields = 'species' | 'breed' | 'health';

type NullableDate = Date | null;

const parseDate = (value?: string | null): NullableDate => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateValue = (value?: string | null) => {
  const date = parseDate(value);
  return date ? date.toISOString() : new Date().toISOString();
};

const formatDisplayDate = (value: string) => {
  const date = parseDate(value);
  return date ? date.toLocaleDateString('tr-TR') : '—';
};

const mapToAnimalListItem = (animal: AnimalRecord): AnimalListItem => {
  // Mock verilerden health status'u belirle
  let healthStatus: AnimalListItem['health'] = 'İyi';
  if (animal.hasChronicDiseases) {
    healthStatus = 'Tedavi Altında';
  } else if (animal.hasAllergies) {
    healthStatus = 'Kontrol Gerekli';
  }

  return {
    id: animal.id ? animal.id.toString() : '0',
    name: animal.name || 'İsimsiz',
    species: (animal.species?.name as AnimalListItem['species']) || 'Diğer',
    breed: animal.breed?.name || 'Bilinmiyor',
    health: healthStatus,
    lastCheckup: animal.lastVisitDate || formatDateValue(animal.birthDate),
    owner: animal.owner?.fullName || animal.owner?.name || 'Bilinmiyor',
    nextVaccine: animal.nextVaccinationDate || formatDateValue(animal.birthDate),
  };
};

// Memoized Animal Row Component for Virtualization (react-window 2.x API)
interface AnimalRowProps {
  index: number;
  style: React.CSSProperties;
  animals: AnimalListItem[];
  onAnimalClick: (id: string) => void;
  getHealthChipClass: (health: string) => string;
}

// Props that will be passed via rowProps (index and style are added automatically by react-window)
type AnimalRowCustomProps = Omit<AnimalRowProps, 'index' | 'style'>;

const AnimalRowComponent = React.memo<AnimalRowProps>(({ index, style, animals, onAnimalClick, getHealthChipClass }) => {
  const animal = animals[index];

  if (!animal) {
    return <div style={style} />;
  }

  return (
    <div style={style}>
      <div className="animal-table-row" onClick={() => onAnimalClick(animal.id)} style={{ cursor: 'pointer' }}>
        <div className="animal-table-cell id">#{animal.id}</div>
        <div className="animal-table-cell name">{animal.name}</div>
        <div className="animal-table-cell species">
          <div className="species-info">
            <div className="species-name">{animal.species}</div>
            <div className="breed-name">{animal.breed}</div>
          </div>
        </div>
        <div className="animal-table-cell owner">{animal.owner}</div>
        <div className="animal-table-cell health">
          <span className={`badge ${getHealthChipClass(animal.health).includes('good') ? 'badge--ok' : getHealthChipClass(animal.health).includes('treatment') ? 'badge--danger' : 'badge--warning'}`}>
            {animal.health}
          </span>
        </div>
        <div className="animal-table-cell date">{formatDisplayDate(animal.lastCheckup)}</div>
        <div className="animal-table-cell date">
          <span className="vaccine-chip">
            {formatDisplayDate(animal.nextVaccine)}
          </span>
        </div>
        <div className="animal-table-cell actions" onClick={(e) => e.stopPropagation()}>
          <IconButton size="small" className="action-icon-button">
            <EventIcon />
          </IconButton>
          <IconButton size="small" className="action-icon-button">
            <EditIcon />
          </IconButton>
          <IconButton size="small" className="action-icon-button" onClick={() => onAnimalClick(animal.id)}>
            <DescriptionIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
});

AnimalRowComponent.displayName = 'AnimalRow';

// Wrapper function for react-window compatibility
const AnimalRow = (props: AnimalRowProps): React.ReactElement => {
  return <AnimalRowComponent {...props} />;
};

const AnimalList: React.FC<AnimalListProps> = ({ onAddAnimal }) => {
  const navigate = useNavigate();
  const { addError, showSuccess } = useError();
  const { loading, startLoading, stopLoading } = useLoading();
  
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [filters, setFilters] = useState({
    species: [] as string[],
    breed: [] as string[],
    health: [] as string[],
    startDate: '',
    endDate: ''
  });

  const fetchAnimals = React.useCallback(async () => {
    try {
      startLoading('Hayvan listesi yükleniyor...');
      console.log('🐶 Animals API çağrısı yapılıyor...');
      console.log('🐶 OFFLINE_MODE:', process.env.NODE_ENV);

      const animalService = new AnimalService();
      
      // İlk çağrı ile total sayısını öğren
      const firstResponse = await animalService.getAnimals(0, 20);
      console.log('🐶 First API response:', firstResponse);

      if (firstResponse.success && firstResponse.data) {
        const total = firstResponse.data.total;
        console.log('🐶 Total animals:', total);
        
        if (total === 0) {
          console.warn('🐶 No animals in database!');
          setAnimals([]);
          addError('Hayvan bulunamadı', 'warning', 'Veritabanında hayvan kaydı bulunamadı');
          return;
        }

        // Tüm hayvanları getirmek için tüm sayfaları çek
        let allAnimals = [...firstResponse.data.items];
        const totalPages = firstResponse.data.totalPages;
        
        console.log(`🐶 Fetching ${totalPages} pages...`);
        
        // Eğer birden fazla sayfa varsa, diğer sayfaları da çek
        if (totalPages > 1) {
          const remainingPages = [];
          for (let page = 1; page < totalPages; page++) {
            remainingPages.push(animalService.getAnimals(page, 20));
          }
          
          const remainingResponses = await Promise.all(remainingPages);
          remainingResponses.forEach((response) => {
            if (response.success && response.data && response.data.items) {
              allAnimals = [...allAnimals, ...response.data.items];
            }
          });
        }
        
        console.log('🐶 All animals fetched:', allAnimals.length);
        console.log('🐶 All animals data:', allAnimals);
        
        const formattedAnimals = allAnimals.map(mapToAnimalListItem);
        console.log('🐶 Formatted animals:', formattedAnimals);
        setAnimals(formattedAnimals);
        showSuccess(`${total} hayvan başarıyla yüklendi`);
      } else {
        console.error('🐶 First API response failed:', firstResponse);
        addError(
          'Hayvan listesi alınamadı',
          'error',
          firstResponse.error || 'API yanıtı başarısız',
          {
            label: 'Tekrar Dene',
            onClick: () => fetchAnimals(),
          }
        );
        setAnimals([]);
      }
    } catch (err) {
      console.error('🐶 Animals API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      addError(
        'Hayvan listesi alınırken bir hata oluştu',
        'error',
        errorMessage,
        {
          label: 'Tekrar Dene',
          onClick: () => fetchAnimals(),
        }
      );
      setAnimals([]);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, addError, showSuccess]);

  useEffect(() => {
    fetchAnimals();
    
    // Custom event listener - hayvan eklendiğinde listeyi yenile
    const handleAnimalAdded = () => {
      fetchAnimals();
    };
    
    window.addEventListener('animalAdded', handleAnimalAdded);
    
    return () => {
      window.removeEventListener('animalAdded', handleAnimalAdded);
    };
  }, [fetchAnimals]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    handleSortClose();
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: FilterFields, value: string) => {
    setFilters(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value]
      };
    });
  };

  const sortAnimals = (list: AnimalListItem[]) => {
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'nextVaccine':
          return (parseDate(a.nextVaccine)?.getTime() || 0) - (parseDate(b.nextVaccine)?.getTime() || 0);
        case 'nextVaccine-desc':
          return (parseDate(b.nextVaccine)?.getTime() || 0) - (parseDate(a.nextVaccine)?.getTime() || 0);
        case 'health':
          return a.health.localeCompare(b.health);
        case 'health-desc':
          return b.health.localeCompare(a.health);
        case 'lastCheckup':
          return (parseDate(b.lastCheckup)?.getTime() || 0) - (parseDate(a.lastCheckup)?.getTime() || 0);
        case 'lastCheckup-desc':
          return (parseDate(a.lastCheckup)?.getTime() || 0) - (parseDate(b.lastCheckup)?.getTime() || 0);
        default:
          return 0;
      }
    });
  };

  const filterAnimals = (list: AnimalListItem[]) => {
    const startDate = filters.startDate ? parseDate(filters.startDate) : null;
    const endDate = filters.endDate ? parseDate(filters.endDate) : null;

    return list.filter(animal => {
      const matchesSearch = (
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.health.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesSpecies = filters.species.length === 0 || filters.species.includes(animal.species);
      const matchesBreed = filters.breed.length === 0 || (animal.breed && filters.breed.includes(animal.breed));
      const matchesHealth = filters.health.length === 0 || filters.health.includes(animal.health);

      const checkupDate = parseDate(animal.lastCheckup);
      const matchesDateRange = !checkupDate || (!startDate && !endDate)
        ? true
        : (
          (!startDate || (checkupDate && checkupDate >= startDate)) &&
          (!endDate || (checkupDate && checkupDate <= endDate))
        );

      return matchesSearch && matchesSpecies && matchesBreed && matchesHealth && matchesDateRange;
    });
  };

  const filteredAndSortedAnimals = useMemo(
    () => sortAnimals(filterAnimals(animals)),
    [animals, sortBy, searchTerm, filters]
  );

  const uniqueSpecies = useMemo(
    () => Array.from(new Set(animals.map(a => a.species))),
    [animals]
  );
  const uniqueBreeds = useMemo(
    () => Array.from(new Set(animals.map(a => a.breed).filter(Boolean))) as string[],
    [animals]
  );
  const uniqueHealth = useMemo(
    () => Array.from(new Set(animals.map(a => a.health))),
    [animals]
  );

  const getHealthChipClass = useCallback((health: string) => {
    switch (health) {
      case 'İyi':
        return 'health-chip good';
      case 'Tedavi Altında':
        return 'health-chip treatment';
      case 'Kontrol Gerekli':
        return 'health-chip monitor';
      default:
        return 'health-chip';
    }
  }, []);

  const handleAnimalClick = useCallback((animalId: string) => {
    navigate(`/animals/${animalId}`);
  }, [navigate]);

  if (loading.isLoading) {
    return (
      <div className="animal-list-container">
        <LoadingSpinner 
          isLoading={loading.isLoading}
          message={loading.loadingMessage || 'Hayvan listesi yükleniyor...'}
          variant="backdrop"
        />
      </div>
    );
  }

  return (
    <div className="animal-list-container">
      {/* Filter Panel */}
      <div className="filter-panel ui-card panel ui-card--hover">
        <h2>Filtreler</h2>

        <TextField
          placeholder="Hayvan adı, sahibi..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          className="filter-search"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'var(--primary-color)', mr: 1 }} />
          }}
        />

        <div className="filter-section">
          <h3>Hayvan Türü</h3>
          <div className="filter-options">
            {uniqueSpecies.map(species => (
              <div key={species} className="filter-checkbox-item">
                <Checkbox
                  checked={filters.species.includes(species)}
                  onChange={() => handleCheckboxChange('species', species)}
                  sx={{ color: 'var(--primary-color)' }}
                />
                <Typography>{species}</Typography>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Irk</h3>
          <div className="filter-options scrollable">
            {uniqueBreeds.map(breed => (
              <div key={breed} className="filter-checkbox-item">
                <Checkbox
                  checked={filters.breed.includes(breed)}
                  onChange={() => handleCheckboxChange('breed', breed)}
                  sx={{ color: 'var(--primary-color)' }}
                />
                <Typography>{breed}</Typography>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Sağlık Durumu</h3>
          <div className="filter-options">
            {uniqueHealth.map(health => (
              <div key={health} className="filter-checkbox-item">
                <Checkbox
                  checked={filters.health.includes(health)}
                  onChange={() => handleCheckboxChange('health', health)}
                  sx={{ color: 'var(--primary-color)' }}
                />
                <Typography>{health}</Typography>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Son Kontrol Tarihi</h3>
          <div className="date-filter-inputs">
            <TextField
              label="Başlangıç Tarihi"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Bitiş Tarihi"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="animal-list-main">
        <div className="animal-list-header">
          <h2 className="animal-list-title ui-section-title">Hayvan Listesi</h2>
          <Button
            variant="outlined"
            onClick={handleSortClick}
            startIcon={<SortIcon />}
            className="sort-button"
          >
            Sırala
          </Button>
          <Popover
            open={Boolean(sortAnchorEl)}
            anchorEl={sortAnchorEl}
            onClose={handleSortClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className="sort-popover">
              <h3>Sıralama Seçenekleri</h3>
              <div className="sort-options">
                <Button
                  onClick={() => handleSortChange({ target: { value: 'name' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'name' ? 'active' : ''}`}
                >
                  İsim (A-Z)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'name-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'name-desc' ? 'active' : ''}`}
                >
                  İsim (Z-A)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'nextVaccine' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'nextVaccine' ? 'active' : ''}`}
                >
                  Sonraki Aşı (Yakın-Uzak)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'nextVaccine-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'nextVaccine-desc' ? 'active' : ''}`}
                >
                  Sonraki Aşı (Uzak-Yakın)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'health' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'health' ? 'active' : ''}`}
                >
                  Sağlık Durumu (A-Z)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'health-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'health-desc' ? 'active' : ''}`}
                >
                  Sağlık Durumu (Z-A)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'lastCheckup' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'lastCheckup' ? 'active' : ''}`}
                >
                  Son Kontrol (Yeni-Eski)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'lastCheckup-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'lastCheckup-desc' ? 'active' : ''}`}
                >
                  Son Kontrol (Eski-Yeni)
                </Button>
              </div>
            </div>
          </Popover>
        </div>

        <Paper className="animal-table ui-card panel">
          <div className="animal-table-header">
            <div className="animal-table-cell id">ID</div>
            <div className="animal-table-cell name">Hayvan Adı</div>
            <div className="animal-table-cell species">Tür/Irk</div>
            <div className="animal-table-cell owner">Sahibi</div>
            <div className="animal-table-cell health">Sağlık Durumu</div>
            <div className="animal-table-cell date">Son Kontrol</div>
            <div className="animal-table-cell date">Sonraki Aşı</div>
            <div className="animal-table-cell actions">İşlemler</div>
          </div>
          {filteredAndSortedAnimals.length > 0 ? (
            <List<AnimalRowCustomProps>
              rowCount={filteredAndSortedAnimals.length}
              rowHeight={60}
              defaultHeight={Math.min(600, filteredAndSortedAnimals.length * 60)}
              style={{ height: Math.min(600, filteredAndSortedAnimals.length * 60), width: '100%' }}
              rowComponent={AnimalRow}
              rowProps={{
                animals: filteredAndSortedAnimals,
                onAnimalClick: handleAnimalClick,
                getHealthChipClass: getHealthChipClass,
              }}
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'text.secondary' }}>
              Hayvan bulunamadı
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default AnimalList;
