import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppointmentService } from '../services/appointmentService';
import { CalendarEvent } from '../types/appointment';
import '../styles/CalendarEvents.css';

interface CalendarEventsProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  veterinarianId?: string;
  showControls?: boolean;
}

const CalendarEvents: React.FC<CalendarEventsProps> = ({ 
  selectedDate = new Date(), 
  onDateSelect,
  veterinarianId,
  showControls = true
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  useEffect(() => {
    loadEvents();
  }, [currentDate, veterinarianId]);

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const response = await AppointmentService.getMonthlyCalendarEvents(
        year, 
        month, 
        veterinarianId
      );
      
      if (response.success) {
        setEvents(response.data || []);
      } else {
        setError('Etkinlikler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Etkinlikler yüklenirken bir hata oluştu');
      console.error('Error loading calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Pazartesi'den başla

    const days = [];
    
    // Önceki ayın son günleri
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }

    // Bu ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }

    // Sonraki ayın ilk günleri (6 hafta tamamlamak için)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const renderMonthView = () => {
    const days = getDaysInMonth();

    return (
      <div className="calendar-events-month">
        <div className="calendar-grid-header">
          {dayNames.map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            
            return (
              <div
                key={index}
                className={`calendar-day-cell ${
                  !day.isCurrentMonth ? 'other-month' : ''
                } ${isToday(day.date) ? 'today' : ''} ${
                  isSelected(day.date) ? 'selected' : ''
                }`}
                onClick={() => handleDateSelect(day.date)}
              >
                <div className="day-number">
                  {day.date.getDate()}
                </div>
                
                <div className="day-events">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="calendar-event"
                      style={{
                        backgroundColor: event.backgroundColor,
                        color: event.textColor
                      }}
                      title={`${formatTime(event.start)} - ${event.title}`}
                    >
                      <span className="event-time">
                        {formatTime(event.start)}
                      </span>
                      <span className="event-title">
                        {event.title}
                      </span>
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="more-events">
                      +{dayEvents.length - 3} daha
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="calendar-events-day">
        <div className="day-view-header">
          <h3>{selectedDate.toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h3>
        </div>
        
        <div className="day-events-list">
          {dayEvents.length === 0 ? (
            <div className="no-events">
              <Calendar size={48} className="no-events-icon" />
              <p>Bu tarihte randevu bulunmuyor</p>
            </div>
          ) : (
            dayEvents.map(event => (
              <div
                key={event.id}
                className="day-event-card"
                style={{ borderLeftColor: event.backgroundColor }}
              >
                <div className="event-header">
                  <h4 className="event-title">{event.title}</h4>
                  <div className="event-time">
                    <Clock size={16} />
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </div>
                
                {event.extendedProps && (
                  <div className="event-details">
                    <div className="event-detail">
                      <User size={16} />
                      <span>{event.extendedProps.ownerName}</span>
                    </div>
                    
                    {event.extendedProps.veterinarianName && (
                      <div className="event-detail">
                        <MapPin size={16} />
                        <span>Dr. {event.extendedProps.veterinarianName}</span>
                      </div>
                    )}
                    
                    {event.extendedProps.subject && (
                      <div className="event-subject">
                        {event.extendedProps.subject}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-events-container">
      {showControls && (
        <div className="calendar-controls">
          <div className="calendar-navigation">
            <button 
              onClick={goToPreviousMonth}
              className="nav-button"
              disabled={loading}
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="current-month">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button 
              onClick={goToNextMonth}
              className="nav-button"
              disabled={loading}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="calendar-actions">
            <button 
              onClick={goToToday}
              className="today-button"
              disabled={loading}
            >
              Bugün
            </button>
            
            <div className="view-switcher">
              <button
                className={`view-button ${view === 'month' ? 'active' : ''}`}
                onClick={() => setView('month')}
              >
                Ay
              </button>
              <button
                className={`view-button ${view === 'day' ? 'active' : ''}`}
                onClick={() => setView('day')}
              >
                Gün
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="calendar-loading">
          <div className="loading-spinner"></div>
          <p>Etkinlikler yükleniyor...</p>
        </div>
      )}

      {error && (
        <div className="calendar-error">
          <p>{error}</p>
          <button onClick={loadEvents} className="retry-button">
            Tekrar Dene
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="calendar-content">
          {view === 'month' && renderMonthView()}
          {view === 'day' && renderDayView()}
        </div>
      )}
    </div>
  );
};

export default CalendarEvents;
