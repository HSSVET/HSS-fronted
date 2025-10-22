import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/components/Calendar.css';
import { AppointmentService } from '../../features/appointments/services/appointmentService';
import { mapCalendarPayloadToLegacy } from '../../features/appointments/utils/calendarMapping';
import type { LegacyAppointment } from '../../features/appointments/types/appointment';
import { useError } from '../../context/ErrorContext';
import { useLoading } from '../../hooks/useLoading';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface WidgetAppointment {
  id: string;
  time: string;
  patientName: string;
  ownerName?: string;
  reason?: string;
}

interface CalendarWidgetProps {
  refreshKey?: number;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ refreshKey }) => {
  const { addError, showSuccess } = useError();
  const { loading, startLoading, stopLoading } = useLoading();
  
  const today = new Date();
  const [value, onChange] = useState<Value>(today);
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);
  const [showAppointmentForm, setShowAppointmentForm] = useState<boolean>(false);
  const [activeStartDate, setActiveStartDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [appointmentsMap, setAppointmentsMap] = useState<Record<string, LegacyAppointment[]>>({});

  const getDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let isMounted = true;

    const startDate = new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1);
    const endDate = new Date(
      activeStartDate.getFullYear(),
      activeStartDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const loadAppointments = async (): Promise<void> => {
      try {
        startLoading('Takvim randevuları yükleniyor...');
        setAppointmentsMap({});

        const appointmentService = new AppointmentService();
        const response = await appointmentService.getCalendarAppointments(startDate, endDate);

        if (!isMounted) {
          return;
        }

        if (response.success && Array.isArray(response.data)) {
          const grouped: Record<string, LegacyAppointment[]> = {};

          response.data
            .map(mapCalendarPayloadToLegacy)
            .filter((item): item is LegacyAppointment => item !== null)
            .forEach((appointment) => {
              const key = appointment.date;
              if (!grouped[key]) {
                grouped[key] = [];
              }
              grouped[key].push(appointment);
            });

          Object.values(grouped).forEach((appointments) => {
            appointments.sort((a, b) => a.time.localeCompare(b.time));
          });

          setAppointmentsMap(grouped);
          showSuccess('Takvim randevuları başarıyla yüklendi');
        } else {
          setAppointmentsMap({});
          addError('Takvim verileri alınamadı', 'warning');
        }
      } catch (err) {
        console.error('Takvim randevuları yüklenirken hata oluştu:', err);
        if (isMounted) {
          setAppointmentsMap({});
          const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
          addError(
            'Takvim randevuları yüklenirken bir hata oluştu',
            'error',
            errorMessage,
            {
              label: 'Tekrar Dene',
              onClick: () => loadAppointments(),
            }
          );
        }
      } finally {
        if (isMounted) {
          stopLoading();
        }
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [activeStartDate, refreshKey]);

  useEffect(() => {
    if (
      selectedDay &&
      (selectedDay.getFullYear() !== activeStartDate.getFullYear() ||
        selectedDay.getMonth() !== activeStartDate.getMonth())
    ) {
      const newSelectedDay = new Date(activeStartDate);
      setSelectedDay(newSelectedDay);
      onChange(newSelectedDay);
    }
  }, [activeStartDate, onChange, selectedDay]);

  const getAppointmentCount = (date: Date): number => {
    const key = getDateKey(date);
    return appointmentsMap[key]?.length ?? 0;
  };

  const getDayAppointments = (date: Date): WidgetAppointment[] => {
    const key = getDateKey(date);
    const items = appointmentsMap[key] ?? [];
    return items.map((appointment) => ({
      id: appointment.id,
      time: appointment.time,
      patientName: appointment.petType
        ? `${appointment.patientName} (${appointment.petType})`
        : appointment.patientName,
      ownerName: appointment.ownerName,
      reason: appointment.description,
    }));
  };

  const hasAppointment = (date: Date): boolean => getAppointmentCount(date) > 0;

  const selectedDayAppointments = useMemo(
    () => (selectedDay ? getDayAppointments(selectedDay) : []),
    [selectedDay, appointmentsMap]
  );

  // Takvim tile'ları için özel içerik
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') {
      return null;
    }

    const count = getAppointmentCount(date);
    if (count === 0) {
      return null;
    }

    return (
      <div className="appointment-indicator">
        <span className="appointment-count">{count}</span>
      </div>
    );
  };

  // Takvim tile'ları için özel class
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') {
      return null;
    }

    return hasAppointment(date) ? 'has-appointment' : null;
  };

  // Gün tıklandığında çalışacak fonksiyon
  const handleDayClick = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDay(value);
      setShowAppointmentForm(false); // Yeni gün seçildiğinde form kapansın
      if (
        value.getFullYear() !== activeStartDate.getFullYear() ||
        value.getMonth() !== activeStartDate.getMonth()
      ) {
        setActiveStartDate(new Date(value.getFullYear(), value.getMonth(), 1));
      }
    }
  };

  // Randevu form durumunu değiştiren fonksiyon
  const toggleAppointmentForm = () => {
    setShowAppointmentForm(!showAppointmentForm);
  };

  // Kompakt randevu listesi
  const renderCompactAppointmentList = (appointments: WidgetAppointment[]) => {
    return (
      <div className="compact-appointments">
        {appointments.map(appointment => (
          <div key={appointment.id} className="compact-appointment-item">
            <div className="appointment-time">{appointment.time}</div>
            <div className="appointment-details">
              <div className="appointment-patient">{appointment.patientName}</div>
              <div className="appointment-reason">{appointment.reason || 'Detay yok'}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Yeni randevu ekleme formu
  const renderAddAppointmentForm = () => {
    return (
      <div className="add-appointment-form">
        <div className="form-row">
          <input type="time" placeholder="Saat" className="time-input" />
          <input type="text" placeholder="Hasta Adı" className="patient-input" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Sahip Adı" className="owner-input" />
        </div>
        <div className="form-row">
          <input type="text" placeholder="Randevu Nedeni" className="reason-input" />
        </div>
        <div className="form-actions">
          <button className="cancel-button" onClick={toggleAppointmentForm}>İptal</button>
          <button className="add-button">Ekle</button>
        </div>
      </div>
    );
  };

  return (
    <div className="widget calendar-widget">
      <div className="widget-header">
        <h2> Takvim</h2>
      </div>
      <div className="widget-content with-horizontal-scroll">
        <div className="calendar-container">
          <Calendar 
            onChange={(value) => {
              onChange(value);
              handleDayClick(value);
            }} 
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) {
                setActiveStartDate(activeStartDate);
              }
            }}
            value={value}
            tileContent={tileContent}
            tileClassName={tileClassName}
            locale="tr-TR"
            showNeighboringMonth={false}
            formatShortWeekday={(locale, date) => 
              date.toLocaleDateString('tr-TR', {weekday: 'short'}).substring(0, 1)
            }
          />
        </div>
        
        {selectedDay && (
          <div className="day-details-inline">
            <div className="day-details-header">
              <h3>{selectedDay.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
              <button 
                className="create-appointment-button" 
                onClick={toggleAppointmentForm}
                title="Yeni Randevu Ekle"
              >
                +
              </button>
            </div>
            
            {loading.isLoading ? (
              <div className="no-appointments">
                <p>{loading.loadingMessage || 'Randevular yükleniyor...'}</p>
              </div>
            ) : selectedDayAppointments.length > 0 ? (
              <div className="day-appointments">
                <h4>Günün Randevuları</h4>
                {renderCompactAppointmentList(selectedDayAppointments)}
              </div>
            ) : (
              <div className="no-appointments">
                <p>Bu tarihte randevu bulunmamaktadır.</p>
              </div>
            )}
          </div>
        )}
        
        {showAppointmentForm && (
          <div className="appointment-modal-overlay">
            <div className="appointment-modal">
              <div className="modal-header">
                <h4>Yeni Randevu Ekle</h4>
                <span className="modal-close" onClick={toggleAppointmentForm}>&times;</span>
              </div>
              <div className="modal-body">
                <p className="selected-date">
                  {selectedDay?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                {renderAddAppointmentForm()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget; 
