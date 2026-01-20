import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, Button, CircularProgress, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ProfileHeader from './detail/ProfileHeader';
import SidebarMenu from './detail/SidebarMenu';
import ImportantAlerts from './detail/ImportantAlerts';
import DiseaseHistory from './detail/DiseaseHistory';
import ClinicalExamination from './detail/ClinicalExamination';
import AppointmentTracking from './detail/AppointmentTracking';
import RadiologyImaging from './detail/RadiologyImaging';
import LaboratoryTests from './detail/LaboratoryTests';
import Prescriptions from './detail/Prescriptions';
import Vaccinations from './detail/Vaccinations';
import PathologyFindings from './detail/PathologyFindings';
import MaterialMedicationIcon from '@mui/icons-material/Medication';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryIcon from '@mui/icons-material/History';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BiotechIcon from '@mui/icons-material/Biotech';
import RadioIcon from '@mui/icons-material/Radio';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ScienceIcon from '@mui/icons-material/Science';
import Allergies from './detail/Allergies';
import Notes from './detail/Notes';
import NoteIcon from '@mui/icons-material/Note';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import SurgeryList from '../../surgery/components/SurgeryList';
import WeightHistory from './detail/WeightHistory';
import SurgeryForm from '../../surgery/components/SurgeryForm';
import HospitalizationList from '../../hospitalization/components/HospitalizationList';
import AdmissionForm from '../../hospitalization/components/AdmissionForm';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import '../styles/AnimalDetail.css';
import { animalService, AnimalRecord } from '../services/animalService';

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

const AnimalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [openSurgeryForm, setOpenSurgeryForm] = useState(false);
  const [openAdmissionForm, setOpenAdmissionForm] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const tabIndex = parseInt(tabParam, 10);
      if (!isNaN(tabIndex)) {
        setSelectedTab(tabIndex);
      }
    }

    // Check for edit action
    const actionParam = params.get('action');
    if (actionParam === 'edit') {
      // TODO: Open edit dialog or toggle edit mode
      console.log("Edit mode requested via URL");
    }
  }, [location.search]);

  const [animalData, setAnimalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await animalService.getAnimalById(id);
        if (response.success && response.data) {
          // Map backend response to the format expected by ProfileHeader if needed
          // Currently ProfileHeader likely expects specific fields. 
          // Let's ensure response.data has what we need or map it.
          // For now, assume response.data is close enough or extend it.
          // We might need to fetch active hospitalization to set 'hospitalStatus'.

          const animal = response.data;
          // Extended data for UI compatibility
          const detailedAnimal = {
            ...animal,
            // Derive display fields if missing in AnimalRecord but used in UI
            age: animal.ageInYears ? `${animal.ageInYears} yaş` : 'Bilinmiyor',
            height: animal.height ? `${animal.height} cm` : 'Bilinmiyor',
            hospitalStatus: 'Ayaktan', // Default, logic to be improved
            image: animal.profileImageUrl || (animal.species?.name === 'Kedi' ? '/assets/cat.jpg' : '/assets/golden-retriever.jpeg'),
            chip: animal.microchipNumber,
            neutered: animal.sterilized ? 'Evet' : 'Hayır'
          };
          setAnimalData(detailedAnimal);
        } else {
          setError('Animal not found');
        }
      } catch (err) {
        setError('Failed to fetch animal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  const menuItems = [
    {
      id: 'important-alerts',
      label: 'Önemli Uyarılar',
      icon: <WarningIcon />,
    },
    // ... items
    {
      id: 'disease-history',
      label: 'Hastalık Geçmişi',
      icon: <HistoryIcon />,
    },
    {
      id: 'clinical-examination',
      label: 'Klinik Muayene',
      icon: <MedicalInformationIcon />,
    },
    {
      id: 'appointment-tracking',
      label: 'Randevu Takibi',
      icon: <EventNoteIcon />,
    },
    {
      id: 'lab-tests',
      label: 'Lab Testleri/Sonuçları',
      icon: <BiotechIcon />,
    },
    {
      id: 'radiology',
      label: 'Radyoloji Görüntüleme',
      icon: <RadioIcon />,
    },
    {
      id: 'prescriptions',
      label: 'Reçeteler',
      icon: <MaterialMedicationIcon />,
    },
    {
      id: 'vaccinations',
      label: 'Aşılar',
      icon: <VaccinesIcon />,
    },
    {
      id: 'allergies',
      label: 'Alerjiler/Kronik Rahatsızlıklar',
      icon: <ErrorOutlineIcon />,
    },
    {
      id: 'pathology',
      label: 'Patoloji Bulguları',
      icon: <ScienceIcon />,
    },
    {
      id: 'notes',
      label: 'Notlar',
      icon: <NoteIcon />,
    },
    {
      id: 'surgery',
      label: 'Ameliyatlar',
      icon: <HealingIcon />,
    },
    {
      id: 'hospitalization',
      label: 'Yatış/Hospitalizasyon',
      icon: <LocalHospitalIcon />,
    },
    {
      id: 'weight',
      label: 'Kilo Takibi',
      icon: <MonitorWeightIcon />,
    },
  ];

  const renderContent = () => {
    if (!animalData) return null;

    switch (selectedTab) {
      case 0: // Önemli Uyarılar
        return <ImportantAlerts animal={animalData} />;
      case 1: // Hastalık Geçmişi
        return <DiseaseHistory />;
      case 2: // Klinik Muayene
        return <ClinicalExamination />;
      case 3: // Randevu Takibi
        return <AppointmentTracking />;
      case 4: // Lab Testleri/Sonuçları
        return <LaboratoryTests animalId={id} />;
      case 5: // Radyoloji Görüntüleme
        return <RadiologyImaging />;
      case 6: // Reçeteler
        return <Prescriptions />;
      case 7: // Aşılar
        return <Vaccinations />;
      case 8: // Alerjiler/Kronik Rahatsızlıklar
        return <Allergies animal={animalData} />;
      case 9: // Patoloji Bulguları
        return <PathologyFindings
          reportInfo={{
            reportNo: '2025-PAT-0142',
            date: '24.08.2035',
            pathologist: 'AHMET YILDIZ',
            sampleNo: 'S-2025-742'
          }}
          sampleInfo={{
            sampleType: 'DOKU BİYOPSİSİ',
            location: 'DERİ - SOL ÖN BACAK'
          }}
        />;
      case 10: // Notlar
        return <Notes onAddClick={() => console.log('Add new note')} />;
      case 11: // Ameliyatlar
        return (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<HealingIcon />} onClick={() => setOpenSurgeryForm(true)}>
                Yeni Ameliyat Planla
              </Button>
            </Box>
            <SurgeryList animalId={parseInt(id || '0')} />
            <Dialog open={openSurgeryForm} onClose={() => setOpenSurgeryForm(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Yeni Ameliyat Planla</DialogTitle>
              <DialogContent>
                <SurgeryForm animalId={parseInt(id || '0')} onSuccess={() => setOpenSurgeryForm(false)} />
              </DialogContent>
            </Dialog>
          </Box>
        );
      case 12: // Yatış/Hospitalizasyon
        return (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<LocalHospitalIcon />} onClick={() => setOpenAdmissionForm(true)}>
                Hasta Yatışı Yap
              </Button>
            </Box>
            <HospitalizationList animalId={parseInt(id || '0')} />
            <Dialog open={openAdmissionForm} onClose={() => setOpenAdmissionForm(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Hasta Yatışı</DialogTitle>
              <DialogContent>
                <AdmissionForm animalId={parseInt(id || '0')} onSuccess={() => setOpenAdmissionForm(false)} />
              </DialogContent>
            </Dialog>
          </Box>
        );
      case 13: // Kilo Takibi
        return <WeightHistory />;
      default:
        return <ImportantAlerts animal={animalData} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !animalData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'Animal not found'}</Typography>
        <Button onClick={() => navigate('..')}>Back to List</Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="animal-detail-page">
        <Container maxWidth="xl" sx={{ py: 2, minHeight: '100vh' }}>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('..')}
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
          <Box className="ui-card panel ui-card--hover" sx={{ mb: 3 }}>
            <ProfileHeader animalData={animalData} />
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box className="ui-card panel" sx={{ width: { xs: '100%', md: '25%', lg: '20%' } }}>
              <SidebarMenu
                items={menuItems}
                selectedIndex={selectedTab}
                onItemSelect={handleTabChange}
              />
            </Box>
            <Box className="ui-card panel ui-card--hover" sx={{ flex: 1, p: 3, minHeight: 400 }}>
              {renderContent()}
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default AnimalDetailPage; 