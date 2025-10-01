import type { CalendarAppointmentPayload, LegacyAppointment } from '../types/appointment';

const formatIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

/**
 * Normalize backend calendar payload (CalendarView or Response DTO) into legacy appointment shape.
 */
export const mapCalendarPayloadToLegacy = (
  item: CalendarAppointmentPayload
): LegacyAppointment | null => {
  if ('dateTime' in item) {
    const startDate = new Date(item.dateTime);
    if (Number.isNaN(startDate.getTime())) {
      return null;
    }

    return {
      id: item.id != null ? item.id.toString() : `temp-${startDate.getTime()}`,
      date: formatIsoDate(startDate),
      time: formatTime(startDate),
      patientName: item.animal?.name || 'Randevu',
      patientId: item.animal?.microchipNumber || '',
      phone: item.owner?.phone || '',
      ownerName: item.owner?.fullName || item.animal?.ownerName || '',
      chipNumber: item.animal?.microchipNumber || '',
      breed: item.animal?.breedName || '',
      petType: item.animal?.speciesName || '',
      description: item.subject || '',
    };
  }

  if (!item.start) {
    return null;
  }

  const startDate = new Date(item.start);
  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const meta = item.extendedProps ?? {};

  return {
    id: item.id ? item.id.toString() : `temp-${startDate.getTime()}`,
    date: formatIsoDate(startDate),
    time: formatTime(startDate),
    patientName: meta.animalName || item.title || 'Randevu',
    patientId: '',
    phone: '',
    ownerName: meta.ownerName || '',
    chipNumber: '',
    breed: '',
    petType: meta.speciesName || '',
    description: meta.subject || '',
  };
};
