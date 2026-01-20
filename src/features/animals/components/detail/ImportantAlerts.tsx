import React from 'react';
import { Box, Typography, Alert, Stack } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HealingIcon from '@mui/icons-material/Healing';
import MedicationIcon from '@mui/icons-material/Medication';

import { Animal } from '../../types/animal';

interface Props {
  animal: any; // Using any temporarily to avoid strict type checks with extended fields
}

const ImportantAlerts: React.FC<Props> = ({ animal }) => {
  // Filter active allergies
  const allergies = animal.conditions?.filter((c: any) => c.type === 'ALLERGY' && c.status === 'ACTIVE') || [];

  // Filter active chronic conditions
  const chronicConditions = animal.conditions?.filter((c: any) => c.type === 'CHRONIC_CONDITION' && c.status !== 'RESOLVED') || [];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ color: '#92A78C', mb: 2, fontWeight: 600 }}>
        Önemli Bilgiler ve Hatırlatmalar
      </Typography>
      <Stack spacing={2}>
        {allergies.length > 0 && allergies.map((allergy: any) => (
          <Alert
            key={allergy.id}
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
            {allergy.name} alerjisi bulunmaktadır! ({allergy.severity})
          </Alert>
        ))}

        {chronicConditions.length > 0 && chronicConditions.map((condition: any) => (
          <Alert
            key={condition.id}
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
            {condition.name} - {condition.status === 'MANAGED' ? 'Kontrol altında' : 'Takip gerekli'}
          </Alert>
        ))}

        {/* Static alerts for demo/example (could be dynamic based on logs) */}
        {!allergies.length && !chronicConditions.length && (
          <Alert
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
            Şu an için aktif bir uyarı bulunmamaktadır.
          </Alert>
        )}

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