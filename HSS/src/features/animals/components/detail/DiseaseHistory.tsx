import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface DiseaseHistoryProps {
  onAddClick?: () => void;
}

const DiseaseHistory: React.FC<DiseaseHistoryProps> = ({ onAddClick }) => {
  // Mock data - will be replaced with real data from API
  const diseaseHistory = [
    {
      id: 1,
      condition: 'Akut Gastroenterit',
      status: 'İyileşti',
      diagnosisDate: '05.06.2022',
      recoveryDate: '15.06.2022',
      details: 'Şiddetli kusma ve ishal ile başvurdu. Kan testlerinde hafif elektrolitik dengesizlik tespit edildi.',
      treatment: 'Antibiyotik tedavisi (Amoksisilin), diyet düzenlemesi, IV sıvı tedavisi uygulandı.',
      hospitalization: '3 gün'
    },
    {
      id: 2,
      condition: 'Otit',
      status: 'İyileşti',
      diagnosisDate: '20.03.2023',
      recoveryDate: '25.03.2023',
      details: 'Sol kulakta kaşıntı ve kızarıklık şikayeti. Kulak salgısı örneği alındı, malassezia tespit edildi.',
      treatment: 'Topikal antifungal tedavi, kulak temizliği',
      hospitalization: 'Ayaktan'
    },
    {
      id: 3,
      condition: 'Kronik Böbrek Yetmezliği',
      status: 'Devam Ediyor',
      diagnosisDate: '10.05.2023',
      recoveryDate: '-',
      details: 'Rutin kontrol sırasında kan değerlerinde bozukluk tespit edildi. İleri tetkik sonrası KBY tanısı konuldu.',
      treatment: 'Özel diyet, periyodik kontrol',
      hospitalization: 'Ayaktan'
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#92A78C', fontWeight: 600 }}>
          Hastalık Geçmişi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{
            bgcolor: '#92A78C',
            '&:hover': {
              bgcolor: '#7B8B76'
            }
          }}
        >
          Yeni Hastalık Geçmişi
        </Button>
      </Box>

      {diseaseHistory.map((record) => (
        <Paper
          key={record.id}
          elevation={1}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 2,
            border: '1px solid #E0E0E0'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospitalIcon sx={{ color: '#92A78C', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                  {record.condition}
                </Typography>
                <Box
                  sx={{
                    ml: 2,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: record.status === 'İyileşti' ? '#E8F5E9' : '#FFF3E0',
                    color: record.status === 'İyileşti' ? '#2E7D32' : '#E65100'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {record.status}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    Tanı:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {record.diagnosisDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    İyileşme:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {record.recoveryDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    Hastanede yatış:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {record.hospitalization}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon sx={{ color: '#92A78C', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Detaylar:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {record.details}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MedicationIcon sx={{ color: '#92A78C', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Tedavi:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {record.treatment}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: '#92A78C',
                  borderColor: '#92A78C',
                  '&:hover': {
                    borderColor: '#7B8B76',
                    bgcolor: 'rgba(146, 167, 140, 0.04)'
                  }
                }}
              >
                Düzenle
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: '#d32f2f',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    borderColor: '#b71c1c',
                    bgcolor: 'rgba(211, 47, 47, 0.04)'
                  }
                }}
              >
                Sil
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default DiseaseHistory; 