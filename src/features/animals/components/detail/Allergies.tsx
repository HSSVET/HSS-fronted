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
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Treatment {
  name: string;
  type: 'medication' | 'diet' | 'drops' | 'other';
}

interface Condition {
  id: string;
  name: string;
  severity: 'Hafif' | 'Orta' | 'Ciddi';
  diagnosisDate: string;
  diagnosedBy: string;
  status: 'Aktif' | 'Mevsimsel' | 'İnaktif';
  symptoms: string[];
  treatments: Treatment[];
  notes?: string;
}

// Mock data
const mockConditions: Condition[] = [
  {
    id: '1',
    name: 'Tavuk proteini',
    severity: 'Orta',
    diagnosisDate: '15.06.2022',
    diagnosedBy: 'Dr. Mehmet Yılmaz',
    status: 'Aktif',
    symptoms: ['Kaşıntı', 'kızarıklık', 'deri tahrişi', 'hafif şişlik'],
    treatments: [
      { name: 'Hipoalerjenik diyet', type: 'diet' },
      { name: 'Antihistamin (gerektiğinde)', type: 'medication' },
    ],
    notes: 'Gıda alerjisi, tavuk içeren mamalardan kaçınılmalı. Sığır ve kuzu proteini içeren diyetler tercih edilmeli.',
  },
  {
    id: '2',
    name: 'Polen',
    severity: 'Hafif',
    diagnosisDate: '20.04.2023',
    diagnosedBy: 'Dr. Ayşe Demir',
    status: 'Mevsimsel',
    symptoms: ['Hapşırma', 'gözlerde sulanma', 'burun akıntısı'],
    treatments: [
      { name: 'Antihistamin (mevsimsel)', type: 'medication' },
      { name: 'Göz damlaları', type: 'drops' },
    ],
    notes: 'Mevsimsel alerji, bahar aylarında belirgir. Semptomlar görüldüğünde ilaç tedavisi başlanmalı.',
  },
];

const Allergies: React.FC<{ animal: any }> = ({ animal }) => {
  const conditions = animal.conditions || [];

  const handleNewCondition = () => {
    // TODO: Implement new condition functionality
    console.log('New condition clicked');
  };

  const handlePrint = (conditionId: string) => {
    console.log('Print condition:', conditionId);
  };

  const handleDetails = (conditionId: string) => {
    console.log('View details:', conditionId);
  };

  const handleCopy = (conditionId: string) => {
    console.log('Copy condition:', conditionId);
  };

  const handleUpdate = (conditionId: string) => {
    console.log('Update condition:', conditionId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'MILD':
        return '#4caf50';
      case 'MODERATE':
        return '#ff9800';
      case 'SEVERE':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CircleIcon sx={{ color: '#4caf50', fontSize: '0.8rem' }} />;
      case 'MANAGED':
        return <CalendarTodayIcon sx={{ color: '#2196f3', fontSize: '0.8rem' }} />;
      case 'RESOLVED':
        return <CircleIcon sx={{ color: '#757575', fontSize: '0.8rem' }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Alerjiler / Kronik Rahatsızlıklar</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewCondition}
          sx={{
            backgroundColor: '#2196f3',
            '&:hover': {
              backgroundColor: '#1976d2',
            },
          }}
        >
          Yeni Durum Ekle
        </Button>
      </Box>

      {conditions.length === 0 ? (
        <Typography color="text.secondary">Kayıtlı alerji veya kronik rahatsızlık bulunmamaktadır.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {conditions.map((condition: any) => (
            <Card
              key={condition.id}
              sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Box
                sx={{
                  backgroundColor: condition.type === 'ALLERGY' ? '#ef5350' : '#ffa726',
                  color: 'white',
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ErrorOutlineIcon />
                  <Typography variant="h6">{condition.name}</Typography>
                </Box>
                <Chip
                  label={condition.severity}
                  sx={{
                    backgroundColor: 'white',
                    color: getSeverityColor(condition.severity),
                    fontWeight: 'bold',
                  }}
                />
              </Box>

              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Bilgiler</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: '#666' }} />
                    <Typography>Tanı Tarihi: {condition.diagnosisDate}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: '#666' }} />
                    <Typography>Tanı Koyan: {condition.diagnosedBy || 'Belirtilmemiş'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(condition.status)}
                    <Typography>Durum: {condition.status}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Treatment section placeholder as basic text for now as backend doesn't support complex treatment list yet */}

                {condition.notes && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>Notlar</Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: 'rgba(255,167,38,0.1)',
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2">{condition.notes}</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Yazdır">
                    <IconButton
                      size="small"
                      onClick={() => handlePrint(condition.id)}
                      sx={{ color: '#666' }}
                    >
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Detaylar">
                    <IconButton
                      size="small"
                      onClick={() => handleDetails(condition.id)}
                      sx={{ color: '#4caf50' }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Kopyala">
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(condition.id)}
                      sx={{ color: '#2196f3' }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Güncelle">
                    <IconButton
                      size="small"
                      onClick={() => handleUpdate(condition.id)}
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
      )}
    </Box>
  );
};

export default Allergies; 