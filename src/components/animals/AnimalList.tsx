import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Box,
  SelectChangeEvent,
  Typography,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Button,
  Popover,
  Stack,
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
import { Animal } from '../../types';

interface AnimalListProps {
  onAddAnimal?: (animal: Animal) => void;
}

type FilterFields = 'species' | 'breed' | 'health';

const initialAnimals: Animal[] = [
  { id: 1, name: 'Pamuk', species: 'Kedi', breed: 'Tekir', health: 'İyi', lastCheckup: '2024-03-15', owner: 'Ayşe', nextVaccine: '2024-05-20' },
  { id: 2, name: 'Karabaş', species: 'Köpek', breed: 'Golden', health: 'Kontrol Gerekli', lastCheckup: '2024-02-20', owner: 'Mehmet', nextVaccine: '2024-04-15' },
  { id: 3, name: 'Boncuk', species: 'Kuş', breed: 'Muhabbet', health: 'İyi', lastCheckup: '2024-03-10', owner: 'Zeynep', nextVaccine: '2024-06-01' },
  { id: 4, name: 'Max', species: 'Köpek', breed: 'Labrador', health: 'Tedavi Altında', lastCheckup: '2024-03-01', owner: 'Ali', nextVaccine: '2024-05-10' },
  { id: 5, name: 'Minnoş', species: 'Kedi', breed: 'Van', health: 'İyi', lastCheckup: '2024-03-18', owner: 'Elif', nextVaccine: '2024-06-18' },
  { id: 6, name: 'Karabaş', species: 'Köpek', breed: 'Kangal', health: 'Kontrol Gerekli', lastCheckup: '2024-02-25', owner: 'Murat', nextVaccine: '2024-05-25' },
  { id: 7, name: 'Sütlaç', species: 'İnek', breed: 'Holstein', health: 'İyi', lastCheckup: '2024-03-05', owner: 'Fatma', nextVaccine: '2024-06-05' },
  { id: 8, name: 'Zilli', species: 'Kedi', breed: 'Scottish', health: 'Tedavi Altında', lastCheckup: '2024-03-12', owner: 'Can', nextVaccine: '2024-06-12' },
  { id: 9, name: 'Paşa', species: 'Köpek', breed: 'Pug', health: 'İyi', lastCheckup: '2024-03-20', owner: 'Derya', nextVaccine: '2024-06-20' },
  { id: 10, name: 'Kırıntı', species: 'Kedi', breed: 'Tekir', health: 'İyi', lastCheckup: '2024-03-20', owner: 'Begüm', nextVaccine: '2024-06-20' },
];

const AnimalList: React.FC<AnimalListProps> = ({ onAddAnimal }) => {
  const theme = useTheme();
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals);
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

  const sortAnimals = (animals: Animal[]) => {
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

  const filterAnimals = (animals: Animal[]) => {
    return animals.filter(animal => {
      const matchesSearch = (
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.health.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesSpecies = filters.species.length === 0 || filters.species.includes(animal.species);
      const matchesBreed = filters.breed.length === 0 || filters.breed.includes(animal.breed);
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
  const uniqueBreeds = Array.from(new Set(animals.map(a => a.breed)));
  const uniqueHealth = Array.from(new Set(animals.map(a => a.health)));

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', margin: '0 auto', p: 0, background: 'transparent', display: 'flex', minHeight: '80vh' }}>
      {/* Sol Filtre Paneli */}
      <Box sx={{ 
        width: 300, 
        minWidth: 240, 
        maxWidth: 340, 
        minHeight: '90vh',
        position: 'sticky', 
        top: 0, 
        background: '#e9dbc7',
        borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`, 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h5" sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: theme.palette.primary.main,
          fontWeight: 800,
          fontSize: 28
        }}>
          Filtreler
        </Typography>
        <TextField
          placeholder="Hayvan adı, sahibi..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{
            mb: 2,
            background: '#fff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.1),
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#bfa77a', mr: 1 }} />
          }}
        />
        <Typography sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Hayvan Türü</Typography>
        <Box sx={{ background: '#d6c6aa', p: 1.5, borderRadius: 2, mb: 2, width: '100%' }}>
          {uniqueSpecies.map(species => (
            <Box key={species} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={filters.species.includes(species)}
                onChange={() => handleCheckboxChange('species', species)}
                sx={{ color: '#bfa77a' }}
              />
              <Typography>{species}</Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Irk</Typography>
        <Box
          sx={{
            background: '#d6c6aa',
            p: 1.5,
            borderRadius: 2,
            mb: 2,
            width: '100%',
            minHeight: 96,
            maxHeight: 180,
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: 8,
              background: '#e9dbc7',
              borderRadius: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#a88c5f',
              borderRadius: 8,
              minHeight: 24,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#8d7346',
            },
            scrollbarColor: '#a88c5f #e9dbc7',
            scrollbarWidth: 'thin',
          }}
        >
          {uniqueBreeds.map(breed => (
            <Box key={breed} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={filters.breed.includes(breed)}
                onChange={() => handleCheckboxChange('breed', breed)}
                sx={{ color: '#bfa77a' }}
              />
              <Typography>{breed}</Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Sağlık Durumu</Typography>
        <Box sx={{ background: '#d6c6aa', p: 1.5, borderRadius: 2, mb: 2, width: '100%' }}>
          {uniqueHealth.map(health => (
            <Box key={health} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={filters.health.includes(health)}
                onChange={() => handleCheckboxChange('health', health)}
                sx={{ color: '#bfa77a' }}
              />
              <Typography>{health}</Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Son Kontrol Tarihi</Typography>
        <Box sx={{ background: '#d6c6aa', p: 1, borderRadius: 2, mb: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Başlangıç Tarihi"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ background: '#fff', borderRadius: 2 }}
          />
          <TextField
            label="Bitiş Tarihi"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ background: '#fff', borderRadius: 2 }}
          />
        </Box>
      </Box>
      
      {/* Sağ Liste ve Arama Paneli */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>Hayvan Listesi</Typography>
          <Button
            variant="outlined"
            onClick={handleSortClick}
            startIcon={<SortIcon />}
            sx={{
              borderColor: '#bfa77a',
              color: '#bfa77a',
              '&:hover': {
                borderColor: '#a88c5f',
                backgroundColor: 'rgba(191, 167, 122, 0.04)'
              }
            }}
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
            <Box sx={{ p: 2, minWidth: 200 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Sıralama Seçenekleri</Typography>
              <Stack spacing={1}>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'name' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'name' ? '#bfa77a' : 'inherit' }}
                >
                  İsim (A-Z)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'name-desc' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'name-desc' ? '#bfa77a' : 'inherit' }}
                >
                  İsim (Z-A)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'nextVaccine' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'nextVaccine' ? '#bfa77a' : 'inherit' }}
                >
                  Sonraki Aşı (Yakın-Uzak)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'nextVaccine-desc' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'nextVaccine-desc' ? '#bfa77a' : 'inherit' }}
                >
                  Sonraki Aşı (Uzak-Yakın)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'health' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'health' ? '#bfa77a' : 'inherit' }}
                >
                  Sağlık Durumu (A-Z)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'health-desc' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'health-desc' ? '#bfa77a' : 'inherit' }}
                >
                  Sağlık Durumu (Z-A)
                </Button>
                <Divider />
                <Button
                  onClick={() => handleSortChange({ target: { value: 'lastCheckup' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'lastCheckup' ? '#bfa77a' : 'inherit' }}
                >
                  Son Kontrol (Yeni-Eski)
                </Button>
                <Button
                  onClick={() => handleSortChange({ target: { value: 'lastCheckup-desc' } } as SelectChangeEvent)}
                  sx={{ justifyContent: 'flex-start', color: sortBy === 'lastCheckup-desc' ? '#bfa77a' : 'inherit' }}
                >
                  Son Kontrol (Eski-Yeni)
                </Button>
              </Stack>
            </Box>
          </Popover>
        </Box>
        
        <Paper sx={{ width: '100%', overflow: 'auto', borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', p: 0 }}>
          <Box sx={{ display: 'flex', fontWeight: 700, bgcolor: '#f6f4f1', borderBottom: '2px solid #e9dbc7', py: 1.5, px: 2 }}>
            <Box sx={{ flex: 0.5 }}>ID</Box>
            <Box sx={{ flex: 1.5 }}>Hayvan Adı</Box>
            <Box sx={{ flex: 1.5 }}>Tür/Irk</Box>
            <Box sx={{ flex: 1.5 }}>Sahibi</Box>
            <Box sx={{ flex: 1 }}>Sağlık Durumu</Box>
            <Box sx={{ flex: 1 }}>Son Kontrol</Box>
            <Box sx={{ flex: 1 }}>Sonraki Aşı</Box>
            <Box sx={{ flex: 1 }}>İşlemler</Box>
          </Box>
          {filteredAndSortedAnimals.map((animal) => (
            <Box key={animal.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0e6d2', py: 1.5, px: 2, '&:hover': { bgcolor: '#f9f6f1' } }}>
              <Box sx={{ flex: 0.5, color: '#bfa77a', fontWeight: 700 }}>#{animal.id}</Box>
              <Box sx={{ flex: 1.5, fontWeight: 700 }}>{animal.name}</Box>
              <Box sx={{ flex: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{animal.species}</Typography>
                <Typography variant="caption" color="text.secondary">{animal.breed}</Typography>
              </Box>
              <Box sx={{ flex: 1.5 }}>{animal.owner}</Box>
              <Box sx={{ flex: 1 }}>
                <Chip
                  label={animal.health}
                  size="small"
                  sx={{
                    bgcolor:
                      animal.health === 'İyi' ? '#e0f7e9' :
                      animal.health === 'Tedavi Altında' ? '#ffeaea' :
                      animal.health === 'Kontrol Gerekli' ? '#fff7e0' :
                      '#e0e0e0',
                    color:
                      animal.health === 'İyi' ? '#388e3c' :
                      animal.health === 'Tedavi Altında' ? '#d32f2f' :
                      animal.health === 'Kontrol Gerekli' ? '#fbc02d' :
                      '#757575',
                    fontWeight: 700
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>{animal.lastCheckup}</Box>
              <Box sx={{ flex: 1 }}>
                <Chip
                  label={animal.nextVaccine}
                  size="small"
                  sx={{
                    bgcolor: '#e3f2fd',
                    color: '#1976d2',
                    fontWeight: 700
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                <IconButton size="small"><EventIcon sx={{ color: '#bfa77a' }} /></IconButton>
                <IconButton size="small"><EditIcon sx={{ color: '#bfa77a' }} /></IconButton>
                <IconButton size="small"><DescriptionIcon sx={{ color: '#bfa77a' }} /></IconButton>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default AnimalList; 