import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import { LegacyAppointment } from '../types/appointment';

interface AppointmentListProps {
  appointments: LegacyAppointment[];
  selectedDate: Date;
  onEdit: (appointment: LegacyAppointment) => void;
  onDelete: (id: string) => void;
  onNewAppointment: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  selectedDate,
  onEdit,
  onDelete,
  onNewAppointment,
  isLoading = false,
  errorMessage = null
}) => {
  const theme = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState<LegacyAppointment | null>(null);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('tr-TR', options);
  };

  const handleDeleteClick = (appointment: LegacyAppointment): void => {
    setDeleteConfirm(appointment);
  };

  const confirmDelete = (): void => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = (): void => {
    setDeleteConfirm(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: '-0.3px', color: 'rgba(31, 43, 38, 0.92)' }}>
          {formatDate(selectedDate)} Randevuları
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewAppointment}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 900,
            background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: '0 10px 22px rgba(92, 122, 109, 0.25)',
            '&:hover': {
              background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              filter: 'brightness(1.03)',
              transform: 'translateY(-1px)',
            },
            transition: 'transform 200ms cubic-bezier(.2,.6,.2,1), filter 200ms cubic-bezier(.2,.6,.2,1)',
          }}
        >
          Yeni Randevu
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, color: 'error.contrastText' }}>
          <Typography>{errorMessage}</Typography>
        </Box>
      ) : appointments.length === 0 ? (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: 'rgba(255,255,255,0.70)',
          borderRadius: 4,
          border: '1px dashed rgba(90,140,180,0.28)',
        }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Bu tarih için henüz randevu bulunmuyor.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={onNewAppointment}
            sx={{ mt: 1, textTransform: 'none' }}
          >
            İlk randevuyu oluştur
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
          {appointments.map((appointment) => {
            return (
              <Card
                key={appointment.id}
                elevation={0}
                sx={{
                  border: '1px solid rgba(90,140,180,0.22)',
                  borderRadius: 4,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 200ms cubic-bezier(.2,.6,.2,1), box-shadow 200ms cubic-bezier(.2,.6,.2,1), border-color 200ms cubic-bezier(.2,.6,.2,1)',
                  '&:hover': {
                    borderColor: 'rgba(140,169,154,0.55)',
                    boxShadow: '0 18px 40px rgba(40, 70, 90, 0.16)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                      label={appointment.time}
                      color="default"
                      variant="filled"
                      size="small"
                      sx={{
                        fontWeight: 900,
                        borderRadius: 999,
                        color: '#fff',
                        background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        boxShadow: '0 10px 20px rgba(92, 122, 109, 0.20)',
                        '& .MuiChip-icon': { color: '#fff' },
                      }}
                    />
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(appointment)}
                        title="Düzenle"
                        sx={{
                          border: '1px solid rgba(90,140,180,0.18)',
                          bgcolor: 'rgba(255,255,255,0.55)',
                          mr: 0.75,
                          '&:hover': { bgcolor: 'rgba(140, 169, 154, 0.10)' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(appointment)}
                        title="Sil"
                        sx={{
                          border: '1px solid rgba(90,140,180,0.18)',
                          bgcolor: 'rgba(255,255,255,0.55)',
                          '&:hover': { bgcolor: 'rgba(229,127,115,0.12)' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 900, letterSpacing: '-0.2px' }}>
                    {appointment.patientName}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                      <PersonIcon fontSize="inherit" />
                      <Typography variant="body2">{appointment.ownerName}</Typography>
                    </Box>
                    {appointment.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                        <PhoneIcon fontSize="inherit" />
                        <Typography variant="body2">{appointment.phone}</Typography>
                      </Box>
                    )}
                    {(appointment.petType || appointment.breed) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                        <PetsIcon fontSize="inherit" />
                        <Typography variant="body2">
                          {[appointment.petType, appointment.breed].filter(Boolean).join(' / ')}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {appointment.description && (
                    <Box sx={{ pt: 2, borderTop: '1px solid rgba(90,140,180,0.14)' }}>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.description}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {deleteConfirm && (
        <Dialog open={Boolean(deleteConfirm)} onClose={cancelDelete}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <WarningIcon />
            Randevuyu Sil
          </DialogTitle>
          <DialogContent>
            <Typography>
              <strong>{deleteConfirm.patientName}</strong> adlı hayvanın
              <strong> {deleteConfirm.time}</strong> saatindeki randevusunu silmek istediğinizden emin misiniz?
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Bu işlem geri alınamaz.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} color="inherit">
              İptal
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Evet, Sil
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AppointmentList; 
