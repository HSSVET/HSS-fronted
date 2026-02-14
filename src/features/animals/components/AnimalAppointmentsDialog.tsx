import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { useLoading } from '../../../hooks/useLoading';
import { useNotifications } from '../../../hooks/useNotifications';

interface AnimalAppointmentsDialogProps {
  open: boolean;
  onClose: () => void;
  animalId: string;
  animalName: string;
}

interface Appointment {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  veterinarianName: string;
  status: string;
  notes?: string;
  reason?: string;
}

const AnimalAppointmentsDialog: React.FC<AnimalAppointmentsDialogProps> = ({
  open,
  onClose,
  animalId,
  animalName,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { addError } = useNotifications();

  useEffect(() => {
    if (open && animalId) {
      fetchAppointments();
    }
  }, [open, animalId]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { apiClient } = await import('../../../services/api');
      const response = await apiClient.get<any>(`/api/appointments/animal/${animalId}`);
      
      if (response.success && response.data) {
        // Sort by date descending (most recent first)
        const sortedAppointments = response.data.sort((a: any, b: any) => {
          const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateB.getTime() - dateA.getTime();
        });
        setAppointments(sortedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      addError('Randevular yüklenirken hata oluştu', 'error');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'CANCELLED':
        return 'İptal Edildi';
      case 'PENDING':
        return 'Beklemede';
      case 'CONFIRMED':
        return 'Onaylandı';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon color="primary" />
            <Typography variant="h6">Geçmiş Randevular - {animalName}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : appointments.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight={200}
            gap={2}
          >
            <EventIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="body1" color="text.secondary">
              Bu hayvan için henüz randevu kaydı bulunmuyor.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Saat</TableCell>
                  <TableCell>Veteriner</TableCell>
                  <TableCell>Sebep</TableCell>
                  <TableCell>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EventIcon fontSize="small" color="action" />
                        {formatDate(appointment.appointmentDate)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        {appointment.appointmentTime}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon fontSize="small" color="action" />
                        {appointment.veterinarianName || 'Belirtilmemiş'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {appointment.reason || appointment.notes || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnimalAppointmentsDialog;
