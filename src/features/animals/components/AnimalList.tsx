import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimalService, type AnimalRecord } from '../services/animalService';
import {
  Paper,
  TextField,
  SelectChangeEvent,
  Typography,
  IconButton,
  Button,
  Popover,
  Divider,
  Checkbox
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Event as EventIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { AnimalListItem } from '../types/animal';
import '../styles/AnimalList.css';

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

const mapToAnimalListItem = (animal: AnimalRecord): AnimalListItem => ({
  id: animal.id ? animal.id.toString() : '0',
  name: animal.name || 'İsimsiz',
  species: (animal.species?.name as AnimalListItem['species']) || 'Diğer',
  breed: animal.breed?.name || 'Bilinmiyor',
  health: 'İyi',
  lastCheckup: formatDateValue(animal.birthDate),
  owner: animal.owner?.fullName || animal.owner?.name || 'Bilinmiyor',
  nextVaccine: formatDateValue(animal.birthDate),
});

const AnimalList: React.FC<AnimalListProps> = ({ onAddAnimal }) => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🐶 Animals API çağrısı yapılıyor...');
        const response = await AnimalService.getAnimals(0, 20);
        console.log('🐶 Animals API response:', response);

        if (response.success && response.data) {
          const formattedAnimals = response.data.items.map(mapToAnimalListItem);
          setAnimals(formattedAnimals);
          console.log('🐶 Formatted animals:', formattedAnimals);
        } else {
          setError(response.error || 'Hayvan listesi alınamadı.');
          setAnimals([]);
        }
      } catch (err) {
        console.error('🐶 Animals API error:', err);
        setError('Hayvan listesi alınırken bir hata oluştu.');
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

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

  const filteredAndSortedAnimals = sortAnimals(filterAnimals(animals));

  const uniqueSpecies = Array.from(new Set(animals.map(a => a.species)));
  const uniqueBreeds = Array.from(new Set(animals.map(a => a.breed).filter(Boolean))) as string[];
  const uniqueHealth = Array.from(new Set(animals.map(a => a.health)));

  const getHealthChipClass = (health: string) => {
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
  };

  const handleAnimalClick = (animalId: string) => {
    navigate(`/animals/${animalId}`);
  };

  if (loading) {
    return (
      <div className="animal-list-container">
        <div className="ui-card panel" style={{ padding: '20px', textAlign: 'center' }}>
          <Typography>Animals API'dan veriler yükleniyor...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animal-list-container">
        <div className="ui-card panel" style={{ padding: '20px', textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </div>
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
          {filteredAndSortedAnimals.map((animal) => (
            <div key={animal.id} className="animal-table-row" onClick={() => handleAnimalClick(animal.id)} style={{ cursor: 'pointer' }}>
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
                <IconButton size="small" className="action-icon-button" onClick={() => handleAnimalClick(animal.id)}>
                  <DescriptionIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </Paper>
      </div>
    </div>
  );
};

export default AnimalList;
