import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const initialAnimals: AnimalListItem[] = [
  { id: '1', name: 'Pamuk', species: 'Kedi', breed: 'Tekir', health: 'İyi', lastCheckup: '2024-03-15', owner: 'Ayşe', nextVaccine: '2024-05-20' },
  { id: '2', name: 'Karabaş', species: 'Köpek', breed: 'Golden', health: 'Kontrol Gerekli', lastCheckup: '2024-02-20', owner: 'Mehmet', nextVaccine: '2024-04-15' },
  { id: '3', name: 'Boncuk', species: 'Kuş', breed: 'Muhabbet', health: 'İyi', lastCheckup: '2024-03-10', owner: 'Zeynep', nextVaccine: '2024-06-01' },
  { id: '4', name: 'Max', species: 'Köpek', breed: 'Labrador', health: 'Tedavi Altında', lastCheckup: '2024-03-01', owner: 'Ali', nextVaccine: '2024-05-10' },
  { id: '5', name: 'Minnoş', species: 'Kedi', breed: 'Van', health: 'İyi', lastCheckup: '2024-03-18', owner: 'Elif', nextVaccine: '2024-06-18' },
  { id: '6', name: 'Karabaş', species: 'Köpek', breed: 'Kangal', health: 'Kontrol Gerekli', lastCheckup: '2024-02-25', owner: 'Murat', nextVaccine: '2024-05-25' },
  { id: '7', name: 'Sütlaç', species: 'İnek', breed: 'Holstein', health: 'İyi', lastCheckup: '2024-03-05', owner: 'Fatma', nextVaccine: '2024-06-05' },
  { id: '8', name: 'Zilli', species: 'Kedi', breed: 'Scottish', health: 'Tedavi Altında', lastCheckup: '2024-03-12', owner: 'Can', nextVaccine: '2024-06-12' },
  { id: '9', name: 'Paşa', species: 'Köpek', breed: 'Pug', health: 'İyi', lastCheckup: '2024-03-20', owner: 'Derya', nextVaccine: '2024-06-20' },
  { id: '10', name: 'Kırıntı', species: 'Kedi', breed: 'Tekir', health: 'İyi', lastCheckup: '2024-03-20', owner: 'Begüm', nextVaccine: '2024-06-20' },
];

const AnimalList: React.FC<AnimalListProps> = ({ onAddAnimal }) => {
  const navigate = useNavigate();
  const [animals] = useState<AnimalListItem[]>(initialAnimals);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [filters, setFilters] = useState({
    species: [] as string[],
    breed: [] as string[],
    health: [] as string[],
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });

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

  const sortAnimals = (animals: AnimalListItem[]) => {
    return [...animals].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'nextVaccine':
          return new Date(a.nextVaccine).getTime() - new Date(b.nextVaccine).getTime();
        case 'nextVaccine-desc':
          return new Date(b.nextVaccine).getTime() - new Date(a.nextVaccine).getTime();
        case 'health':
          return a.health.localeCompare(b.health);
        case 'health-desc':
          return b.health.localeCompare(a.health);
        case 'lastCheckup':
          return new Date(b.lastCheckup).getTime() - new Date(a.lastCheckup).getTime();
        case 'lastCheckup-desc':
          return new Date(a.lastCheckup).getTime() - new Date(b.lastCheckup).getTime();
        default:
          return 0;
      }
    });
  };

  const filterAnimals = (animals: AnimalListItem[]) => {
    return animals.filter(animal => {
      const matchesSearch = (
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.health.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesSpecies = filters.species.length === 0 || filters.species.includes(animal.species);
      const matchesBreed = filters.breed.length === 0 || (animal.breed && filters.breed.includes(animal.breed));
      const matchesHealth = filters.health.length === 0 || filters.health.includes(animal.health);
      const checkupDate = new Date(animal.lastCheckup);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      const matchesDateRange = checkupDate >= startDate && checkupDate <= endDate;
      return matchesSearch && matchesSpecies && matchesBreed && matchesHealth && matchesDateRange;
    });
  };

  const filteredAndSortedAnimals = sortAnimals(filterAnimals(animals));

  const uniqueSpecies = Array.from(new Set(animals.map(a => a.species)));
  const uniqueBreeds = Array.from(new Set(animals.map(a => a.breed).filter(breed => breed !== undefined))) as string[];
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

  return (
    <div className="animal-list-container">
      {/* Filter Panel */}
      <div className="filter-panel">
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
          <h2 className="animal-list-title">Hayvan Listesi</h2>
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
                  fullWidth
                >
                  İsim (A-Z)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'name-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'name-desc' ? 'active' : ''}`}
                  fullWidth
                >
                  İsim (Z-A)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'nextVaccine' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'nextVaccine' ? 'active' : ''}`}
                  fullWidth
                >
                  Sonraki Aşı (Yakın-Uzak)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'nextVaccine-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'nextVaccine-desc' ? 'active' : ''}`}
                  fullWidth
                >
                  Sonraki Aşı (Uzak-Yakın)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'health' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'health' ? 'active' : ''}`}
                  fullWidth
                >
                  Sağlık Durumu (A-Z)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'health-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'health-desc' ? 'active' : ''}`}
                  fullWidth
                >
                  Sağlık Durumu (Z-A)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'lastCheckup' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'lastCheckup' ? 'active' : ''}`}
                  fullWidth
                >
                  Son Kontrol (Yeni-Eski)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'lastCheckup-desc' } } as SelectChangeEvent)}
                  className={`sort-option ${sortBy === 'lastCheckup-desc' ? 'active' : ''}`}
                  fullWidth
                >
                  Son Kontrol (Eski-Yeni)
                </Button>
              </div>
            </div>
          </Popover>
        </div>
        
        <Paper className="animal-table">
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
                <span className={getHealthChipClass(animal.health)}>
                  {animal.health}
                </span>
              </div>
              <div className="animal-table-cell date">{animal.lastCheckup}</div>
              <div className="animal-table-cell date">
                <span className="vaccine-chip">
                  {animal.nextVaccine}
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