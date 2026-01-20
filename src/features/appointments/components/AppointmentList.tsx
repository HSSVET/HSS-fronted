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
  CircularProgress
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
        <Typography variant="h6" fontWeight="bold">
          {formatDate(selectedDate)} Randevuları
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewAppointment}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 2
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
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider'
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
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 2
                  }
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                      label={appointment.time}
                      color="primary"
                      variant="filled" // Changed from soft/outlined to filled for better visibility
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Box>
                      <IconButton size="small" onClick={() => onEdit(appointment)} title="Düzenle">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(appointment)} title="Sil">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
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
                    <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
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
