import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/components/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Appointment {
  id: number;
  time: string;
  patientName: string;
  ownerName: string;
  reason: string;
}

interface DayAppointments {
  date: Date;
  count: number;
  appointments: Appointment[];
}

const CalendarWidget: React.FC = () => {
    const today = new Date();
  const [value, onChange] = useState<Value>(today);
  const [selectedDay, setSelectedDay] = useState<Date | null>(today); // Initialize with today
  const [showAppointmentForm, setShowAppointmentForm] = useState<boolean>(false);

  // Güncel tarih bilgisi
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Örnek randevular - gerçek uygulamada API'den gelecektir
  const appointmentData: DayAppointments[] = [
    // Bugün için randevular ekleyelim
    { 
      date: new Date(currentYear, currentMonth, currentDay), 
      count: 3,
      appointments: [
        { id: 101, time: "09:30", patientName: "Maviş (Kedi)", ownerName: "Hakan Yılmaz", reason: "Aşı Kontrolü" },
        { id: 102, time: "11:45", patientName: "Cesur (Köpek)", ownerName: "Ayşe Demir", reason: "Yıllık Kontrol" },
        { id: 103, time: "15:00", patientName: "Şeker (Hamster)", ownerName: "Elif Kaya", reason: "Tırnak Kesimi" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 1), 
      count: 3,
      appointments: [
        { id: 1, time: "09:00", patientName: "Max (Köpek)", ownerName: "Ahmet Yılmaz", reason: "Yıllık Kontrol" },
        { id: 2, time: "11:30", patientName: "Bıdık (Kedi)", ownerName: "Ayşe Kaya", reason: "Aşılama" },
        { id: 3, time: "14:45", patientName: "Karabaş (Köpek)", ownerName: "Mehmet Demir", reason: "Cilt Sorunu" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 3), 
      count: 2,
      appointments: [
        { id: 4, time: "10:15", patientName: "Pamuk (Tavşan)", ownerName: "Zeynep Öztürk", reason: "Diş Kontrolü" },
        { id: 5, time: "13:00", patientName: "Minnoş (Kedi)", ownerName: "Ali Yıldız", reason: "Aşılama" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 5), 
      count: 2,
      appointments: [
        { id: 6, time: "09:30", patientName: "Çomar (Köpek)", ownerName: "Fatma Şahin", reason: "Yara Kontrolü" },
        { id: 7, time: "15:15", patientName: "Luna (Kedi)", ownerName: "Can Demir", reason: "Genel Kontrol" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 8), 
      count: 1,
      appointments: [
        { id: 8, time: "11:00", patientName: "Rocky (Köpek)", ownerName: "Seda Yılmaz", reason: "Aşılama" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 10), 
      count: 1,
      appointments: [
        { id: 9, time: "14:30", patientName: "Tekir (Kedi)", ownerName: "Murat Kaya", reason: "Kısırlaştırma Kontrolü" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 12), 
      count: 4,
      appointments: [
        { id: 10, time: "08:45", patientName: "Paşa (Köpek)", ownerName: "Deniz Yılmaz", reason: "Göz Muayenesi" },
        { id: 11, time: "10:30", patientName: "Sarman (Kedi)", ownerName: "Elif Demir", reason: "Aşı Kontrolü" },
        { id: 12, time: "13:15", patientName: "Boncuk (Tavşan)", ownerName: "Kemal Öztürk", reason: "Diş Kontrolü" },
        { id: 13, time: "16:00", patientName: "Fındık (Hamster)", ownerName: "Selin Kaya", reason: "Genel Kontrol" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 15), 
      count: 2,
      appointments: [
        { id: 14, time: "09:15", patientName: "Zeytin (Kedi)", ownerName: "Burak Şahin", reason: "Kısırlaştırma" },
        { id: 15, time: "14:00", patientName: "Duman (Köpek)", ownerName: "Gizem Yıldız", reason: "Aşılama" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 18), 
      count: 3,
      appointments: [
        { id: 16, time: "10:00", patientName: "Mia (Kedi)", ownerName: "Canan Demir", reason: "Ultrason" },
        { id: 17, time: "12:30", patientName: "Çakıl (Köpek)", ownerName: "Serkan Öztürk", reason: "Tırnak Kesimi" },
        { id: 18, time: "15:45", patientName: "Şanslı (Köpek)", ownerName: "Aylin Kaya", reason: "Kulak Enfeksiyonu" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 22), 
      count: 2,
      appointments: [
        { id: 19, time: "11:30", patientName: "Pati (Kedi)", ownerName: "Okan Yılmaz", reason: "Aşılama" },
        { id: 20, time: "14:15", patientName: "Karamel (Köpek)", ownerName: "Sevgi Demir", reason: "Diş Taşı Temizliği" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 25), 
      count: 1,
      appointments: [
        { id: 21, time: "13:00", patientName: "Tarçın (Kedi)", ownerName: "Mert Öztürk", reason: "Yıllık Kontrol" }
      ]
    },
    { 
      date: new Date(currentYear, currentMonth, 28), 
      count: 3,
      appointments: [
        { id: 22, time: "09:45", patientName: "Kömür (Köpek)", ownerName: "Zehra Kaya", reason: "Aşılama" },
        { id: 23, time: "12:00", patientName: "Bulut (Kedi)", ownerName: "Emre Yıldız", reason: "Göz Enfeksiyonu" },
        { id: 24, time: "16:30", patientName: "Lokum (Tavşan)", ownerName: "Nazlı Demir", reason: "Diş Kontrolü" }
      ]
    }
  ];

  // Belirli bir tarihte randevu olup olmadığını kontrol eden fonksiyon
  const hasAppointment = (date: Date) => {
    return appointmentData.some(appointment => 
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
    );
  };

  // Belirli bir tarihteki randevu sayısını bulan fonksiyon
  const getAppointmentCount = (date: Date) => {
    const appointment = appointmentData.find(appointment => 
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
    );
    return appointment ? appointment.count : 0;
  };

  // Belirli bir tarihteki randevuları bulan fonksiyon
  const getDayAppointments = (date: Date) => {
    const dayData = appointmentData.find(appointment => 
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
    );
    return dayData ? dayData.appointments : [];
  };

  // Takvim tile'ları için özel içerik
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasAppointment(date)) {
      return (
        <div className="appointment-indicator">
          <span className="appointment-count">{getAppointmentCount(date)}</span>
        </div>
      );
    }
    return null;
  };

  // Takvim tile'ları için özel class
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasAppointment(date)) {
      return 'has-appointment';
    }
    return null;
  };

  // Gün tıklandığında çalışacak fonksiyon
  const handleDayClick = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDay(value);
      setShowAppointmentForm(false); // Yeni gün seçildiğinde form kapansın
    }
  };

  // Randevu form durumunu değiştiren fonksiyon
  const toggleAppointmentForm = () => {
    setShowAppointmentForm(!showAppointmentForm);
  };

  // Kompakt randevu listesi
  const renderCompactAppointmentList = (appointments: Appointment[]) => {
    return (
      <div className="compact-appointments">
        {appointments.map(appointment => (
          <div key={appointment.id} className="compact-appointment-item">
            <div className="appointment-time">{appointment.time}</div>
            <div className="appointment-details">
              <div className="appointment-patient">{appointment.patientName}</div>
              <div className="appointment-reason">{appointment.reason}</div>
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
            
            {hasAppointment(selectedDay) ? (
              <div className="day-appointments">
                <h4>Günün Randevuları</h4>
                {renderCompactAppointmentList(getDayAppointments(selectedDay))}
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