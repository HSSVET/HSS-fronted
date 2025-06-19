import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Paper, Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ProfileHeader from './detail/ProfileHeader';
import SidebarMenu from './detail/SidebarMenu';
import ImportantAlerts from './detail/ImportantAlerts';
import '../styles/AnimalDetail.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#92A78C', // Ana projede kullanılan primary color
    },
    secondary: {
      main: '#F7CD82', // Ana projede kullanılan secondary color
    },
    background: {
      default: '#F9F9F9', // Ana projede kullanılan background
      paper: '#FFFFFF', // Ana projede kullanılan surface color
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
});

// Mock data - gerçek uygulamada API'den gelecek
const mockAnimalData = {
  1: { id: 1, name: 'Pamuk', species: 'Kedi', breed: 'Tekir', age: '2 yaş', gender: 'Dişi', height: '25 cm', chip: '123456789012345', neutered: 'Kısırlaştırılmış', weight: '3.2 kg', hospitalStatus: 'Ayaktan', image: '/assets/cat.jpg' },
  2: { id: 2, name: 'Karabaş', species: 'Köpek', breed: 'Golden Retriever', age: '5 yaş', gender: 'Erkek', height: '65 cm', chip: '987654321098765', neutered: 'Kısırlaştırılmış', weight: '28.5 kg', hospitalStatus: 'Taburcu', image: '/assets/golden-retriever.jpeg' },
  3: { id: 3, name: 'Boncuk', species: 'Kuş', breed: 'Muhabbet Kuşu', age: '1 yaş', gender: 'Erkek', height: '18 cm', chip: '456789123456789', neutered: 'Uygulanmaz', weight: '0.035 kg', hospitalStatus: 'Ayaktan', image: '/assets/bird.jpg' },
  4: { id: 4, name: 'Max', species: 'Köpek', breed: 'Labrador', age: '3 yaş', gender: 'Erkek', height: '60 cm', chip: '123456789012345', neutered: 'Kısırlaştırılmış', weight: '32.5 kg', hospitalStatus: 'Taburcu', image: '/assets/golden-retriever.jpeg' },
};

const AnimalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(0);

  const animalId = id ? parseInt(id) : 1;
  const animalData = mockAnimalData[animalId as keyof typeof mockAnimalData] || mockAnimalData[1];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="animal-detail-page">
        <Container maxWidth="xl" sx={{ py: 2, bgcolor: 'background.default', minHeight: '100vh' }}>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/animals')}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(146, 167, 140, 0.04)',
                },
              }}
            >
              Hayvan Listesine Dön
            </Button>
          </Box>
          <ProfileHeader animalData={animalData} />
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ width: { xs: '100%', md: '25%', lg: '20%' } }}>
              <SidebarMenu selectedIndex={selectedMenu} onSelect={setSelectedMenu} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Paper elevation={3} sx={{ p: 3, minHeight: 400, bgcolor: 'background.paper' }}>
                {/* Menüye göre içerik değişecek. Şimdilik sadece önemli uyarılar gösteriliyor. */}
                <ImportantAlerts />
              </Paper>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default AnimalDetailPage; 