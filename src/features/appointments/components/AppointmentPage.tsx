import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import AppointmentList from './AppointmentList';
import AppointmentForm from './AppointmentForm';
import { AppointmentService } from '../services/appointmentService';
import type { LegacyAppointment, AppointmentFormData } from '../types/appointment';
import { mapCalendarPayloadToLegacy } from '../utils/calendarMapping';
import '../styles/AppointmentSystem.css';

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
        const response = await AppointmentService.getCalendarAppointments(startOfMonth, endOfMonth);

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
          setError('Randevular yüklenirken bir hata oluştu.');
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
    <div className="appointment-system">
      <div className="appointment-system-header ui-card panel ui-card--hover" style={{textAlign:'left'}}>
        <h1 className="appointment-system-title ui-section-title">Randevu Sistemi</h1>
        <p className="appointment-system-subtitle">Veteriner Hekim Randevu Yönetimi</p>
      </div>

      <div className="appointment-system-container grid gap-3" style={{gridTemplateColumns:'420px 1fr'}}>
        <div className="calendar-section ui-card panel">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            appointments={appointments}
          />
          {isLoading && (
            <p className="calendar-status">Randevular yükleniyor...</p>
          )}
          {error && !isLoading && (
            <p className="calendar-status error">{error}</p>
          )}
        </div>

        <div className="content-section">
          <div className="ui-card panel ui-card--hover">
            <AppointmentList
              appointments={todayAppointments}
              selectedDate={selectedDate}
              onEdit={editAppointment}
              onDelete={deleteAppointment}
              onNewAppointment={handleNewAppointment}
              isLoading={isLoading}
              errorMessage={!isLoading ? error : null}
            />
          </div>

          {showForm && (
            <div className="ui-card panel ui-card--hover">
              <AppointmentForm
                appointment={editingAppointment}
                selectedDate={selectedDate}
                onSave={editingAppointment ? updateAppointment : addAppointment}
                onCancel={handleCancelForm}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage; 
