import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Dialog } from '@mui/material';
import { AppointmentService } from '../services/appointmentService';
import '../styles/AppointmentSystem.css';
import type { AppointmentFormData, LegacyAppointment } from '../types/appointment';
import { mapCalendarPayloadToLegacy } from '../utils/calendarMapping';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import Calendar from './Calendar';

const AppointmentPage: React.FC = () => {
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', // Example modern gradient
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Randevu Sistemi
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Veteriner Hekim Randevu Yönetimi
          </Typography>
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
            backgroundColor: 'rgba(255,255,255,0.1)'
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
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
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
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
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
        </Box>
      </Box>

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
    </Container>
  );
};

export default AppointmentPage;
