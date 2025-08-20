import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Grid } from 'lucide-react';
import Calendar from './Calendar';
import CalendarEvents from './CalendarEvents';
import AppointmentList from './AppointmentList';
import AppointmentForm from './AppointmentForm';
import { LegacyAppointment, AppointmentFormData, CalendarEvent } from '../types/appointment';
import '../styles/AppointmentSystem.css';

const AppointmentPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<LegacyAppointment[]>([
    {
      id: '1',
      date: '2024-01-15',
      time: '09:00',
      patientName: 'Max',
      ownerName: 'Ahmet Yılmaz',
      patientId: '12345678901',
      phone: '0555 123 4567',
      chipNumber: 'TR123456789',
      breed: 'Golden Retriever',
      petType: 'Köpek',
      description: 'Rutin kontrol ve aşı'
    },
    {
      id: '2',
      date: '2024-01-15',
      time: '10:30',
      patientName: 'Luna',
      ownerName: 'Ayşe Demir',
      patientId: '09876543210',
      phone: '0532 987 6543',
      chipNumber: 'TR987654321',
      breed: 'British Shorthair',
      petType: 'Kedi',
      description: 'Kısırlaştırma operasyonu'
    },
    {
      id: '3',
      date: '2024-01-15',
      time: '14:00',
      patientName: 'Rocky',
      ownerName: 'Mehmet Kaya',
      patientId: '55512345678',
      phone: '0505 555 1234',
      chipNumber: 'TR555123456',
      breed: 'German Shepherd',
      petType: 'Köpek',
      description: 'Topallik şikayeti'
    }
  ]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<LegacyAppointment | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'events'>('calendar');
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<string>('');

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

  const handleEventClick = (event: CalendarEvent): void => {
    // Event details'a tıklandığında detay gösterimi veya edit fonksiyonu
    console.log('Event clicked:', event);
    // Gelecekte: Modal ile event detayları gösterilebilir
  };

  return (
    <div className="appointment-system">
      <div className="appointment-system-header">
        <h1 className="appointment-system-title">🐾 Hayvan Sağlığı Randevu Sistemi</h1>
        <p className="appointment-system-subtitle">Veteriner Hekim Randevu Yönetim Platformu</p>
        
        {/* View Mode Switcher */}
        <div className="view-mode-switcher">
          <button
            className={`view-mode-button ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            <Grid size={18} />
            <span>Klasik Takvim</span>
          </button>
          <button
            className={`view-mode-button ${viewMode === 'events' ? 'active' : ''}`}
            onClick={() => setViewMode('events')}
          >
            <CalendarIcon size={18} />
            <span>Etkinlik Takvimi</span>
          </button>
        </div>
      </div>

      <div className="appointment-system-container">
        <div className="calendar-section">
          {viewMode === 'calendar' ? (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              appointments={appointments}
              showEvents={true}
              veterinarianId={selectedVeterinarian}
              onEventClick={handleEventClick}
            />
          ) : (
            <CalendarEvents
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              veterinarianId={selectedVeterinarian}
              showControls={true}
            />
          )}
        </div>

        <div className="content-section">
          <AppointmentList
            appointments={todayAppointments}
            selectedDate={selectedDate}
            onEdit={editAppointment}
            onDelete={deleteAppointment}
            onNewAppointment={handleNewAppointment}
          />

          {showForm && (
            <AppointmentForm
              appointment={editingAppointment}
              selectedDate={selectedDate}
              onSave={editingAppointment ? updateAppointment : addAppointment}
              onCancel={handleCancelForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage; 