import React from 'react';
import { Box, Typography, Alert, Stack } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HealingIcon from '@mui/icons-material/Healing';
import MedicationIcon from '@mui/icons-material/Medication';

const ImportantAlerts: React.FC = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ color: '#92A78C', mb: 2, fontWeight: 600 }}>
        Önemli Bilgiler ve Hatırlatmalar
      </Typography>
      <Stack spacing={2}>
        <Alert 
          icon={<WarningAmberIcon />} 
          severity="error" 
          sx={{ 
            bgcolor: '#FFF3E6', 
            color: '#D57A4A', 
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: '#D57A4A'
            }
          }}
        >
          Tavuk proteinine karşı alerjisi bulunmaktadır!
        </Alert>
        <Alert 
          icon={<VaccinesIcon />} 
          severity="warning" 
          sx={{ 
            bgcolor: '#E6F3FF', 
            color: '#92A78C', 
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: '#F79E6B'
            }
          }}
        >
          Kuduz aşısı 15 gün içinde yapılmalıdır.
        </Alert>
        <Alert 
          icon={<HealingIcon />} 
          severity="warning" 
          sx={{ 
            bgcolor: '#E6F3FF', 
            color: '#92A78C', 
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: '#F79E6B'
            }
          }}
        >
          Kronik böbrek yetmezliği - Düzenli kontrol gerekli
        </Alert>
        <Alert 
          icon={<MedicationIcon />} 
          severity="info" 
          sx={{ 
            bgcolor: '#D6FFE6', 
            color: '#92A78C', 
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: '#92A78C'
            }
          }}
        >
          Antibiyotik tedavisi devam ediyor (5 gün kaldı).
        </Alert>
        <Alert 
          severity="info" 
          sx={{ 
            bgcolor: '#F9F9F9', 
            color: 'rgba(0, 0, 0, 0.6)', 
            fontStyle: 'italic',
            '& .MuiAlert-icon': {
              color: '#92A78C'
            }
          }}
        >
          Sol taraftaki menüden ilgili bölümü seçerek detaylı bilgileri görüntüleyebilirsiniz.
        </Alert>
      </Stack>
    </Box>
  );
};

export default ImportantAlerts; 