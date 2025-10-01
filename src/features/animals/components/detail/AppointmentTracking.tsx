import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HealingIcon from '@mui/icons-material/Healing';
import SearchIcon from '@mui/icons-material/Search';
import NoteIcon from '@mui/icons-material/Note';
import CloseIcon from '@mui/icons-material/Close';

interface AppointmentTrackingProps {
  onAddClick?: () => void;
}

type AppointmentType = 'Muayene' | 'Aşı' | 'Tedavi';
type AppointmentStatus = 'Tamamlandı' | 'Planlandı';

interface Appointment {
  id: number;
  date: string;
  time: string;
  type: AppointmentType;
  title: string;
  description: string;
  status: AppointmentStatus;
}

const AppointmentTracking: React.FC<AppointmentTrackingProps> = ({ onAddClick }) => {
  const [selectedTypes, setSelectedTypes] = useState<AppointmentType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AppointmentStatus[]>([]);

  // Mock data - will be replaced with real data from API
  const upcomingAppointments: Appointment[] = [
    {
      id: 1,
      date: '20',
      time: '11:30',
      type: 'Aşı',
      title: 'Karma Aşı',
      description: 'Koruyucu karma aşı uygulaması',
      status: 'Planlandı'
    },
    {
      id: 2,
      date: '25',
      time: '09:15',
      type: 'Tedavi',
      title: 'Kan testi',
      description: 'Rutin kan değerleri kontrolü',
      status: 'Planlandı'
    }
  ];

  const pastAppointments: Appointment[] = [
    {
      id: 3,
      date: '17',
      time: '15:30',
      type: 'Tedavi',
      title: 'İlaç tedavisi - Final',
      description: 'Deri enfeksiyonu tedavisinin son aşaması',
      status: 'Tamamlandı'
    },
    {
      id: 4,
      date: '10',
      time: '13:00',
      type: 'Muayene',
      title: 'Diş kontrolü',
      description: 'Diş taşı kontrolü ve temizliği',
      status: 'Tamamlandı'
    },
    {
      id: 5,
      date: '5',
      time: '10:45',
      type: 'Aşı',
      title: 'Aşı - Köpek Gençlik Hastalığı',
      description: 'Yıllık aşı tekrarı',
      status: 'Tamamlandı'
    }
  ];

  const handleTypeToggle = (type: AppointmentType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleStatusToggle = (status: AppointmentStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'Muayene':
        return <MedicalInformationIcon />;
      case 'Aşı':
        return <VaccinesIcon />;
      case 'Tedavi':
        return <HealingIcon />;
    }
  };

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case 'Muayene':
        return '#92A78C';
      case 'Aşı':
        return '#F44336';
      case 'Tedavi':
        return '#2196F3';
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2,
        p: 2,
        borderLeft: '4px solid',
        borderLeftColor: getTypeColor(appointment.type),
        bgcolor: '#fff',
        borderRadius: 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <Box
        sx={{
          bgcolor: '#f5f5f5',
          p: 1,
          borderRadius: 1,
          textAlign: 'center',
          minWidth: 60
        }}
      >
        <Typography variant="h6" sx={{ color: '#666', fontWeight: 600 }}>
          {appointment.date}
        </Typography>
        <Typography variant="caption" sx={{ color: '#666' }}>
          KAS
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: getTypeColor(appointment.type),
              '& svg': { fontSize: 20 }
            }}
          >
            {getTypeIcon(appointment.type)}
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {appointment.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {appointment.time}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {appointment.description}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={appointment.status}
          size="small"
          sx={{
            bgcolor: appointment.status === 'Tamamlandı' ? '#E8F5E9' : '#E3F2FD',
            color: appointment.status === 'Tamamlandı' ? '#2E7D32' : '#1976D2'
          }}
        />
        {appointment.status === 'Tamamlandı' && (
          <>
            <Button
              size="small"
              sx={{ minWidth: 'auto', p: 0.5 }}
              onClick={() => console.log('View details')}
            >
              <SearchIcon sx={{ fontSize: 20, color: '#92A78C' }} />
            </Button>
            <Button
              size="small"
              sx={{ minWidth: 'auto', p: 0.5 }}
              onClick={() => console.log('View notes')}
            >
              <NoteIcon sx={{ fontSize: 20, color: '#92A78C' }} />
            </Button>
          </>
        )}
        {appointment.status === 'Planlandı' && (
          <>
            <Button
              size="small"
              sx={{ minWidth: 'auto', p: 0.5 }}
              onClick={() => console.log('Edit appointment')}
            >
              <NoteIcon sx={{ fontSize: 20, color: '#92A78C' }} />
            </Button>
            <Button
              size="small"
              sx={{ minWidth: 'auto', p: 0.5 }}
              onClick={() => console.log('Cancel appointment')}
            >
              <CloseIcon sx={{ fontSize: 20, color: '#d32f2f' }} />
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#92A78C', fontWeight: 600 }}>
          Randevu Takip Sistemi
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
          Yeni Randevu
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            icon={<MedicalInformationIcon />}
            label="Muayene"
            onClick={() => handleTypeToggle('Muayene')}
            sx={{
              bgcolor: selectedTypes.includes('Muayene') ? '#92A78C' : 'transparent',
              color: selectedTypes.includes('Muayene') ? '#fff' : '#666',
              border: '1px solid #92A78C',
              '& .MuiChip-icon': {
                color: selectedTypes.includes('Muayene') ? '#fff' : '#92A78C'
              }
            }}
          />
          <Chip
            icon={<VaccinesIcon />}
            label="Aşı"
            onClick={() => handleTypeToggle('Aşı')}
            sx={{
              bgcolor: selectedTypes.includes('Aşı') ? '#F44336' : 'transparent',
              color: selectedTypes.includes('Aşı') ? '#fff' : '#666',
              border: '1px solid #F44336',
              '& .MuiChip-icon': {
                color: selectedTypes.includes('Aşı') ? '#fff' : '#F44336'
              }
            }}
          />
          <Chip
            icon={<HealingIcon />}
            label="Tedavi"
            onClick={() => handleTypeToggle('Tedavi')}
            sx={{
              bgcolor: selectedTypes.includes('Tedavi') ? '#2196F3' : 'transparent',
              color: selectedTypes.includes('Tedavi') ? '#fff' : '#666',
              border: '1px solid #2196F3',
              '& .MuiChip-icon': {
                color: selectedTypes.includes('Tedavi') ? '#fff' : '#2196F3'
              }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="Tamamlandı"
            onClick={() => handleStatusToggle('Tamamlandı')}
            sx={{
              bgcolor: selectedStatuses.includes('Tamamlandı') ? '#4CAF50' : 'transparent',
              color: selectedStatuses.includes('Tamamlandı') ? '#fff' : '#666',
              border: '1px solid #4CAF50'
            }}
          />
          <Chip
            label="Planlandı"
            onClick={() => handleStatusToggle('Planlandı')}
            sx={{
              bgcolor: selectedStatuses.includes('Planlandı') ? '#2196F3' : 'transparent',
              color: selectedStatuses.includes('Planlandı') ? '#fff' : '#666',
              border: '1px solid #2196F3'
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Yaklaşan Randevular
        </Typography>
        {upcomingAppointments
          .filter(app =>
            (selectedTypes.length === 0 || selectedTypes.includes(app.type)) &&
            (selectedStatuses.length === 0 || selectedStatuses.includes(app.status))
          )
          .map(app => (
            <React.Fragment key={app.id}>
              {renderAppointmentCard(app)}
            </React.Fragment>
          ))}
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Geçmiş Randevular
        </Typography>
        {pastAppointments
          .filter(app =>
            (selectedTypes.length === 0 || selectedTypes.includes(app.type)) &&
            (selectedStatuses.length === 0 || selectedStatuses.includes(app.status))
          )
          .map(app => (
            <React.Fragment key={app.id}>
              {renderAppointmentCard(app)}
            </React.Fragment>
          ))}
      </Box>
    </Box>
  );
};

export default AppointmentTracking; 