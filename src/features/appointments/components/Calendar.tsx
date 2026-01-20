import React, { useState } from 'react';
import { Box, Button, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { ChevronLeft, ChevronRight, KeyboardArrowDown } from '@mui/icons-material';
import { LegacyAppointment } from '../types/appointment';

interface CalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    appointments: LegacyAppointment[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, appointments }) => {
    const [monthAnchorEl, setMonthAnchorEl] = useState<null | HTMLElement>(null);
    const [yearAnchorEl, setYearAnchorEl] = useState<null | HTMLElement>(null);

    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const monthNames: string[] = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Pazartesi ilk gün (Monday=1, Sunday=0 -> Adjusted: Monday=0, Sunday=6)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Yıl aralığı
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

    const handleMonthClick = (event: React.MouseEvent<HTMLElement>) => {
        setMonthAnchorEl(event.currentTarget);
    };

    const handleMonthClose = (index?: number) => {
        if (typeof index === 'number') {
            const newDate = new Date(selectedDate);
            newDate.setMonth(index);
            onDateSelect(newDate);
        }
        setMonthAnchorEl(null);
    };

    const handleYearClick = (event: React.MouseEvent<HTMLElement>) => {
        setYearAnchorEl(event.currentTarget);
    };

    const handleYearClose = (year?: number) => {
        if (typeof year === 'number') {
            const newDate = new Date(selectedDate);
            newDate.setFullYear(year);
            onDateSelect(newDate);
        }
        setYearAnchorEl(null);
    };

    const goToToday = (): void => {
        onDateSelect(new Date());
    };

    const renderCalendarDays = (): React.ReactElement[] => {
        const days: React.ReactElement[] = [];

        // Empty slots for previous month
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(
                <Box key={`empty-${i}`} sx={{ height: 40 }} />
            );
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;
            const isToday = today.getDate() === day &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear;
            const hasAppts = hasAppointments(day);

            days.push(
                <Box key={day} sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Box
                        onClick={() => selectDate(day)}
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: isSelected || isToday ? 'bold' : 'normal',
                            backgroundColor: isSelected
                                ? 'primary.main'
                                : isToday
                                    ? 'secondary.light'
                                    : 'transparent',
                            color: isSelected
                                ? 'white'
                                : isToday
                                    ? 'secondary.contrastText'
                                    : 'text.primary',
                            border: hasAppts && !isSelected ? '1px solid' : 'none',
                            borderColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                            }
                        }}
                    >
                        {day}
                    </Box>
                </Box>
            );
        }

        return days;
    };

    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <IconButton onClick={goToPreviousMonth} size="small">
                    <ChevronLeft />
                </IconButton>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        endIcon={<KeyboardArrowDown />}
                        onClick={handleMonthClick}
                        color="inherit"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        {monthNames[currentMonth]}
                    </Button>
                    <Menu
                        anchorEl={monthAnchorEl}
                        open={Boolean(monthAnchorEl)}
                        onClose={() => handleMonthClose()}
                    >
                        {monthNames.map((month, index) => (
                            <MenuItem
                                key={index}
                                selected={index === currentMonth}
                                onClick={() => handleMonthClose(index)}
                            >
                                {month}
                            </MenuItem>
                        ))}
                    </Menu>

                    <Button
                        size="small"
                        endIcon={<KeyboardArrowDown />}
                        onClick={handleYearClick}
                        color="inherit"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        {currentYear}
                    </Button>
                    <Menu
                        anchorEl={yearAnchorEl}
                        open={Boolean(yearAnchorEl)}
                        onClose={() => handleYearClose()}
                    >
                        {years.map((year) => (
                            <MenuItem
                                key={year}
                                selected={year === currentYear}
                                onClick={() => handleYearClose(year)}
                            >
                                {year}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                <IconButton onClick={goToNextMonth} size="small">
                    <ChevronRight />
                </IconButton>
            </Box>

            {/* Today Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={goToToday}
                    sx={{ borderRadius: 4, textTransform: 'none', px: 3 }}
                >
                    Bugün
                </Button>
            </Box>

            {/* Weekdays */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
                    <Box key={day} sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            {day}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Days Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
                {renderCalendarDays()}
            </Box>
        </Box>
    );
};

export default Calendar; 