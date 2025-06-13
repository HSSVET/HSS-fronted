import React, { useState } from 'react';
import Calendar from './appointments/Calendar';
import AppointmentList from './appointments/AppointmentList';
import AppointmentForm from './appointments/AppointmentForm';
import { Appointment } from '../types/appointments';
import './AppointmentSystem.css';

function AppointmentSystem(): React.ReactElement {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: 1,
            date: '2024-05-12',
            time: '14:30',
            patientName: 'Karabaş',
            patientId: '434563989',
            phone: '05554384569',
            ownerName: 'Ahmet Yılmaz',
            chipNumber: 'CH10143',
            breed: 'Golden Retriever',
            petType: 'Köpek',
            description: 'Aşı kontrolü ve genel muayene'
        },
        {
            id: 2,
            date: '2024-05-12',
            time: '15:00',
            patientName: 'Minnoş',
            patientId: '983654210',
            phone: '05559654321',
            ownerName: 'Ayşe Kaya',
            chipNumber: 'CH10456',
            breed: 'Van Kedisi',
            petType: 'Kedi',
            description: 'Rutin muayene ve parazit kontrolü'
        }
    ]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

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

    const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'date'>): void => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: Date.now(),
            date: selectedDateString
        };
        setAppointments([...appointments, newAppointment]);
        setShowForm(false);
    };

    const updateAppointment = (appointmentData: Omit<Appointment, 'id' | 'date'>): void => {
        if (!editingAppointment) return;

        setAppointments(appointments.map(app =>
            app.id === editingAppointment.id
                ? { ...appointmentData, id: editingAppointment.id, date: selectedDateString }
                : app
        ));
        setEditingAppointment(null);
        setShowForm(false);
    };

    const deleteAppointment = (id: number): void => {
        setAppointments(appointments.filter(app => app.id !== id));
    };

    const editAppointment = (appointment: Appointment): void => {
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
            <div className="appointment-system-header">
                <h1 className="appointment-system-title">🐾 Hayvan Sağlığı Randevu Sistemi</h1>
                <p className="appointment-system-subtitle">Veteriner Hekim Randevu Yönetim Platformu</p>
            </div>

            <div className="appointment-system-container">
                <div className="calendar-section">
                    <Calendar
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        appointments={appointments}
                    />
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
}

export default AppointmentSystem; 