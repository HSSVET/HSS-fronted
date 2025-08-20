import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MedicationIcon from '@mui/icons-material/Medication';

interface Medication {
  name: string;
  dosage: string;
}

interface Prescription {
  id: string;
  date: string;
  duration: number;
  medications: Medication[];
}

// Mock data
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    date: '15.08.2023',
    duration: 7,
    medications: [
      { name: 'Amoksisilin 250mg Tablet', dosage: '2x1' },
      { name: 'Probiyotik Süspansiyon', dosage: '1x1' },
    ],
  },
  {
    id: '2',
    date: '22.10.2023',
    duration: 14,
    medications: [
      { name: 'Prednol 5mg Tablet', dosage: '1x1' },
      { name: 'Dermatin Merhem', dosage: '2x1' },
    ],
  },
];

const Prescriptions: React.FC = () => {
  const handleNewPrescription = () => {
    // TODO: Implement new prescription functionality
    console.log('New prescription clicked');
  };

  const handlePrint = (prescriptionId: string) => {
    console.log('Print prescription:', prescriptionId);
  };

  const handleDetails = (prescriptionId: string) => {
    console.log('View details:', prescriptionId);
  };

  const handleCopy = (prescriptionId: string) => {
    console.log('Copy prescription:', prescriptionId);
  };

  const handleRenew = (prescriptionId: string) => {
    console.log('Renew prescription:', prescriptionId);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Geçmiş Reçeteler</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewPrescription}
          sx={{
            backgroundColor: '#2196f3',
            '&:hover': {
              backgroundColor: '#1976d2',
            },
          }}
        >
          Yeni Reçete Ekle
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mockPrescriptions.map((prescription) => (
          <Card
            key={prescription.id}
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                    📝 {prescription.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    component="span"
                    sx={{
                      color: '#2196f3',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      padding: '4px 8px',
                      borderRadius: 1,
                    }}
                  >
                    ⏱️ {prescription.duration} gün
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>İlaçlar</Typography>
                {prescription.medications.map((medication, index) => (
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
                    <MedicationIcon sx={{ color: '#ff4444' }} />
                    <Typography sx={{ flex: 1 }}>{medication.name}</Typography>
                    <Typography sx={{ color: '#666' }}>({medication.dosage})</Typography>
                  </Box>
                ))}
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
                    onClick={() => handlePrint(prescription.id)}
                    sx={{ color: '#666' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Detaylar">
                  <IconButton
                    size="small"
                    onClick={() => handleDetails(prescription.id)}
                    sx={{ color: '#4caf50' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Kopyala">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(prescription.id)}
                    sx={{ color: '#2196f3' }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Yenile">
                  <IconButton
                    size="small"
                    onClick={() => handleRenew(prescription.id)}
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

export default Prescriptions; 