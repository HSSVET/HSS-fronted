import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../../styles/components/Calendar.css';
import { Appointment } from '../../types';

interface CalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    appointments: Appointment[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, appointments }) => {
    const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false);
    const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);

    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const monthNames: string[] = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Türkçe için Pazartesi'yi haftanın ilk günü yapmak için
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Yıl aralığını belirle (geçmişten geleceğe)
    const startYear = 2020;
    const endYear = 2030;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const hasAppointments = (day: number): boolean => {
        const dateString = formatDate(new Date(currentYear, currentMonth, day));
        return appointments.some(appointment => appointment.date === dateString);
    };

    const goToPreviousMonth = (): void => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onDateSelect(newDate);
    };

    const goToNextMonth = (): void => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onDateSelect(newDate);
    };

    const selectDate = (day: number): void => {
        const newDate = new Date(currentYear, currentMonth, day);
        onDateSelect(newDate);
    };

    const selectMonth = (monthIndex: number): void => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(monthIndex);
        onDateSelect(newDate);
        setShowMonthDropdown(false);
    };

    const selectYear = (year: number): void => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(year);
        onDateSelect(newDate);
        setShowYearDropdown(false);
    };

    const goToToday = (): void => {
        onDateSelect(new Date());
    };

    const renderCalendarDays = (): React.ReactElement[] => {
        const days: React.ReactElement[] = [];

        // Önceki ayın boş günleri
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Ayın günleri
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;
            const isToday = today.getDate() === day &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear;
            const hasAppts = hasAppointments(day);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasAppts ? 'has-appointments' : ''}`}
                    onClick={() => selectDate(day)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={goToPreviousMonth} className="nav-button">‹</button>

                <div className="date-selectors">
                    {/* Ay Seçici */}
                    <div className="dropdown-container">
                        <button
                            className="dropdown-button"
                            onClick={() => {
                                setShowMonthDropdown(!showMonthDropdown);
                                setShowYearDropdown(false);
                            }}
                        >
                            {monthNames[currentMonth]}
                            <ChevronDown size={16} className={`dropdown-icon ${showMonthDropdown ? 'rotated' : ''}`} />
                        </button>

                        {showMonthDropdown && (
                            <div className="dropdown-menu month-dropdown">
                                {monthNames.map((month, index) => (
                                    <button
                                        key={index}
                                        className={`dropdown-item ${index === currentMonth ? 'active' : ''}`}
                                        onClick={() => selectMonth(index)}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Yıl Seçici */}
                    <div className="dropdown-container">
                        <button
                            className="dropdown-button"
                            onClick={() => {
                                setShowYearDropdown(!showYearDropdown);
                                setShowMonthDropdown(false);
                            }}
                        >
                            {currentYear}
                            <ChevronDown size={16} className={`dropdown-icon ${showYearDropdown ? 'rotated' : ''}`} />
                        </button>

                        {showYearDropdown && (
                            <div className="dropdown-menu year-dropdown">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        className={`dropdown-item ${year === currentYear ? 'active' : ''}`}
                                        onClick={() => selectYear(year)}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={goToNextMonth} className="nav-button">›</button>
            </div>

            {/* Bugüne Git Butonu */}
            <div className="calendar-actions">
                <button onClick={goToToday} className="today-button">
                    Bugün
                </button>
            </div>

            <div className="calendar-weekdays">
                <div className="weekday">Pzt</div>
                <div className="weekday">Sal</div>
                <div className="weekday">Çar</div>
                <div className="weekday">Per</div>
                <div className="weekday">Cum</div>
                <div className="weekday">Cmt</div>
                <div className="weekday">Paz</div>
            </div>

            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>

            {/* Dropdown'ları kapatmak için overlay */}
            {(showMonthDropdown || showYearDropdown) && (
                <div
                    className="dropdown-overlay"
                    onClick={() => {
                        setShowMonthDropdown(false);
                        setShowYearDropdown(false);
                    }}
                />
            )}
        </div>
    );
};

export default Calendar; 