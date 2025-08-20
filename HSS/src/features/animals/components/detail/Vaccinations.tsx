import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VaccinesIcon from '@mui/icons-material/Vaccines';

interface Vaccine {
  name: string;
  note?: string;
}

interface VaccinationAppointment {
  id: string;
  date: string;
  status: 'planned' | 'completed' | 'cancelled';
  vaccines: Vaccine[];
  applicationNote?: string;
}

// Mock data
const mockVaccinations: VaccinationAppointment[] = [
  {
    id: '1',
    date: '28.11.2023',
    status: 'planned',
    vaccines: [
      { name: 'Lyme Hastalığı Aşısı' },
    ],
    applicationNote: 'İlk kez uygulanacak',
  },
  {
    id: '2',
    date: '15.12.2023',
    status: 'planned',
    vaccines: [
      { name: 'Bordetella Aşısı' },
      { name: 'Kennel Cough (Köpek Öksürüğü) için' },
    ],
  },
];

const Vaccinations: React.FC = () => {
  const handleNewVaccination = () => {
    // TODO: Implement new vaccination functionality
    console.log('New vaccination clicked');
  };

  const handlePrint = (vaccinationId: string) => {
    console.log('Print vaccination:', vaccinationId);
  };

  const handleDetails = (vaccinationId: string) => {
    console.log('View details:', vaccinationId);
  };

  const handleRenew = (vaccinationId: string) => {
    console.log('Renew vaccination:', vaccinationId);
  };

  const getStatusColor = (status: VaccinationAppointment['status']) => {
    switch (status) {
      case 'planned':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: VaccinationAppointment['status']) => {
    switch (status) {
      case 'planned':
        return 'Planlanmış';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Aşı Takip Sistemi</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewVaccination}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
        >
          Yeni Aşı Ekle
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mockVaccinations.map((vaccination) => (
          <Card
            key={vaccination.id}
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderTop: '4px solid #FFA726',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    component="span"
                    sx={{
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    📝 {vaccination.date}
                  </Typography>
                </Box>
                <Chip
                  icon={<VaccinesIcon />}
                  label={getStatusText(vaccination.status)}
                  sx={{
                    backgroundColor: `${getStatusColor(vaccination.status)}15`,
                    color: getStatusColor(vaccination.status),
                    '& .MuiChip-icon': {
                      color: getStatusColor(vaccination.status),
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Aşılar</Typography>
                {vaccination.vaccines.map((vaccine, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      p: 1,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '1.2rem' }}>💉</Typography>
                    <Typography sx={{ flex: 1 }}>{vaccine.name}</Typography>
                  </Box>
                ))}
                {vaccination.applicationNote && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1,
                      backgroundColor: 'rgba(255,167,38,0.1)',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '1.2rem' }}>📝</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vaccination.applicationNote}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  pt: 2,
                }}
              >
                <Tooltip title="Yazdır">
                  <IconButton
                    size="small"
                    onClick={() => handlePrint(vaccination.id)}
                    sx={{ color: '#666' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Detaylar">
                  <IconButton
                    size="small"
                    onClick={() => handleDetails(vaccination.id)}
                    sx={{ color: '#4caf50' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Yenile">
                  <IconButton
                    size="small"
                    onClick={() => handleRenew(vaccination.id)}
                    sx={{ color: '#ff9800' }}
                  >
                    <AutorenewIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Vaccinations; 