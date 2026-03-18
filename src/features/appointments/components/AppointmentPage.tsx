import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Dialog, Button, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AppointmentService } from '../services/appointmentService';
import '../styles/AppointmentSystem.css';
import type { AppointmentFormData, LegacyAppointment } from '../types/appointment';
import { mapCalendarPayloadToLegacy } from '../utils/calendarMapping';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import Calendar from './Calendar';

const AppointmentPage: React.FC = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<LegacyAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<LegacyAppointment | null>(null);

  const monthKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;

  useEffect(() => {
    let isMounted = true;

    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const loadAppointments = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('📅 Loading appointments for:', startOfMonth, 'to', endOfMonth);
        const appointmentService = new AppointmentService();
        const response = await appointmentService.getCalendarAppointments(startOfMonth, endOfMonth);
        console.log('📅 Calendar appointments response:', response);

        if (!isMounted) {
          return;
        }

        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data
            .map(mapCalendarPayloadToLegacy)
            .filter((item): item is LegacyAppointment => item !== null)
            .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
          setAppointments(mapped);
        } else {
          setAppointments([]);
          setError('Randevu verileri alınamadı.');
        }
      } catch (err) {
        console.error('Randevular yüklenirken hata oluştu:', err);
        if (isMounted) {
          setAppointments([]);
          setError(`Randevular yüklenirken bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [monthKey]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateString = formatDate(selectedDate);
  const todayAppointments = appointments.filter(
    appointment => appointment.date === selectedDateString
  );

  const addAppointment = (appointmentData: AppointmentFormData): void => {
    const newAppointment: LegacyAppointment = {
      ...appointmentData,
      id: Date.now().toString(),
      date: selectedDateString
    };
    setAppointments([...appointments, newAppointment]);
    setShowForm(false);
  };

  const updateAppointment = (appointmentData: AppointmentFormData): void => {
    if (!editingAppointment) return;

    setAppointments(appointments.map(app =>
      app.id === editingAppointment.id
        ? { ...appointmentData, id: editingAppointment.id, date: selectedDateString }
        : app
    ));
    setEditingAppointment(null);
    setShowForm(false);
  };

  const deleteAppointment = (id: string): void => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  const editAppointment = (appointment: LegacyAppointment): void => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleNewAppointment = (): void => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  const handleCancelForm = (): void => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, md: 2.75 },
          mb: { xs: 2, md: 2.5 },
          borderRadius: 4,
          background:
            'radial-gradient(circle at 15% 25%, rgba(140, 169, 154, 0.30) 0%, rgba(140, 169, 154, 0) 55%), radial-gradient(circle at 85% 25%, rgba(134, 200, 181, 0.22) 0%, rgba(134, 200, 181, 0) 55%), linear-gradient(135deg, rgba(250,253,255,0.92) 0%, rgba(240,248,252,0.86) 100%)',
          color: 'text.primary',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(90,140,180,0.22)',
          boxShadow: '0 12px 30px rgba(40, 70, 90, 0.14)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={900}
              gutterBottom
              sx={{ letterSpacing: '-0.6px', color: 'rgba(31, 43, 38, 0.92)' }}
            >
            Randevu Sistemi
          </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(31, 43, 38, 0.62)' }}>
            Veteriner Hekim Randevu Yönetimi
          </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewAppointment}
            sx={{
              mt: 0.25,
              borderRadius: 3,
              px: 2,
              py: 1.1,
              fontWeight: 900,
              textTransform: 'none',
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
        {/* Decorative circle */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(140, 169, 154, 0.22) 0%, rgba(140, 169, 154, 0) 60%)',
          }}
        />
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Left Column: Calendar */}
        <Box sx={{ width: { xs: '100%', md: 320, lg: 360 }, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid rgba(90,140,180,0.22)',
              background: 'linear-gradient(180deg, rgba(250,253,255,0.90), rgba(240,248,252,0.82))',
              backdropFilter: 'saturate(1.18) blur(14px)',
              WebkitBackdropFilter: 'saturate(1.18) blur(14px)',
              boxShadow: '0 12px 28px rgba(40, 70, 90, 0.14)',
              height: '100%'
            }}
          >
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              appointments={appointments}
            />
            {isLoading && (
              <Box p={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Randevular yükleniyor...
                </Typography>
              </Box>
            )}
            {error && !isLoading && (
              <Box p={2}>
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Right Column: Appointment List */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 4,
              border: '1px solid rgba(90,140,180,0.22)',
              background: 'linear-gradient(180deg, rgba(250,253,255,0.90), rgba(240,248,252,0.82))',
              backdropFilter: 'saturate(1.18) blur(14px)',
              WebkitBackdropFilter: 'saturate(1.18) blur(14px)',
              boxShadow: '0 12px 28px rgba(40, 70, 90, 0.14)',
              minHeight: 600
            }}
          >
            <AppointmentList
              appointments={todayAppointments}
              selectedDate={selectedDate}
              onEdit={editAppointment}
              onDelete={deleteAppointment}
              onNewAppointment={handleNewAppointment}
              isLoading={isLoading}
              errorMessage={!isLoading ? error : null}
            />
          </Paper>

          {showForm && (
            <Dialog
              open={showForm}
              onClose={handleCancelForm}
              maxWidth="sm"
              fullWidth
            >
              <Paper elevation={0}>
                <AppointmentForm
                  appointment={editingAppointment}
                  selectedDate={selectedDate}
                  onSave={editingAppointment ? updateAppointment : addAppointment}
                  onCancel={handleCancelForm}
                />
              </Paper>
            </Dialog>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AppointmentPage; 
