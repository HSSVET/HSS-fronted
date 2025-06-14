import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Button } from '@mui/material';
import AnimalList from './AnimalList';
import AddAnimalDialog from './AddAnimalDialog';
import '../../styles/components/AnimalSystem.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#23232b', // koyu gri
      light: '#ffe066', // sarımsı vurgu
      dark: '#bdbdbd',
    },
    secondary: {
      main: '#ffe066', // sarı vurgu
      light: '#fffbe6',
      dark: '#ffd700',
    },
    background: {
      default: '#ece7e1', // ana arka plan bej
      paper: '#f6f4f1', // kutu/kart arka planı
    },
    text: {
      primary: '#23232b',
      secondary: '#7c7c7c',
    },
    info: {
      main: '#fff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 700,
      color: '#23232b',
    },
    body1: {
      color: '#23232b',
    },
    body2: {
      color: '#7c7c7c',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 18,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#f6f4f1',
        },
      },
    },
  },
});

function AnimalSystem(): React.ReactElement {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddAnimal = (animal: {
    name: string;
    species: string;
    breed: string;
    health: string;
    lastCheckup: string;
    owner: string;
    nextVaccine: string;
  }) => {
    // Yeni hayvan eklendi, dialog'u kapat
    setIsAddDialogOpen(false);
    console.log('Yeni hayvan eklendi:', animal);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="animal-system">
        <div className="animal-system-container">
          <div className="animal-system-header">
            <h1 className="animal-system-title">Hayvan Listesi</h1>
            <p className="animal-system-subtitle">Hasta hayvanları yönetin ve kayıtlarını takip edin</p>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ borderRadius: 2, fontWeight: 600, color: 'primary.main', boxShadow: 'none' }}
                onClick={() => setIsAddDialogOpen(true)}
              >
                Yeni Hayvan
              </Button>
            </Box>
          </div>
          
          <div className="content-section">
            <AnimalList />
          </div>
        </div>
        
        <AddAnimalDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddAnimal}
        />
      </div>
    </ThemeProvider>
  );
}

export default AnimalSystem; 