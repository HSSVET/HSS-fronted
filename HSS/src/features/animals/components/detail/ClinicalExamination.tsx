import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PrintIcon from '@mui/icons-material/Print';

interface ClinicalExaminationProps {
  onAddClick?: () => void;
}

const ClinicalExamination: React.FC<ClinicalExaminationProps> = ({ onAddClick }) => {
  // Mock data - will be replaced with real data from API
  const examinations = [
    {
      id: 1,
      date: '10.07.2023',
      doctor: 'Dr. Mehmet Yılmaz',
      anamnesis: 'Sahibi 3 gündür iştahsızlık ve enerji düşüklüğü olduğunu belirtti.',
      complaints: 'İştahsızlık, halsizlik, aşırı su tüketimi',
      findings: 'Hafif dehidrasyon belirtileri. Solunum ve nabız normal. Ateş yok. Oral mukozada hafif solukluk.',
      primaryDiagnosis: 'Gastroenterit',
      secondaryDiagnosis: 'Dehidrasyon',
      procedures: 'Subkutan sıvı tedavisi, antiemetik enjeksiyon, probiotic verildi.'
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#92A78C', fontWeight: 600 }}>
          Klinik İncelemeler
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
          Yeni İnceleme Ekle
        </Button>
      </Box>

      {examinations.map((exam) => (
        <Paper
          key={exam.id}
          elevation={1}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 2,
            border: '1px solid #E0E0E0'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 500 }}>
                  {exam.date}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {exam.doctor}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PrintIcon />}
                  sx={{
                    color: '#92A78C',
                    borderColor: '#92A78C',
                    '&:hover': {
                      borderColor: '#7B8B76',
                      bgcolor: 'rgba(146, 167, 140, 0.04)'
                    }
                  }}
                >
                  Yazdır
                </Button>
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MedicalInformationIcon sx={{ color: '#92A78C', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    Anamnez:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {exam.anamnesis}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MonitorHeartIcon sx={{ color: '#92A78C', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    Şikayetler:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {exam.complaints}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalHospitalIcon sx={{ color: '#92A78C', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    Bulgular:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {exam.findings}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                    Birincil Tanı:
                  </Typography>
                  <Typography variant="body1">
                    {exam.primaryDiagnosis}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                    İkincil Tanı:
                  </Typography>
                  <Typography variant="body1">
                    {exam.secondaryDiagnosis}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                  Yapılan İşlemler:
                </Typography>
                <Typography variant="body1">
                  {exam.procedures}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ClinicalExamination; 