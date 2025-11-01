import React, { useEffect, useMemo, useState } from 'react';
import { AnimalService, type BasicAnimalRecord } from '../../animals/services/animalService';
import { VeterinarianService, type VeterinarianRecord } from '../../veterinarians/services/veterinarianService';
import { AppointmentService } from '../../appointments/services/appointmentService';
import type { CreateAppointmentRequest } from '../../appointments/types/appointment';
import '../styles/FastAppointmentModal.css';

interface FastAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

const FastAppointmentModal: React.FC<FastAppointmentModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [animalId, setAnimalId] = useState<string>('');
  const [animals, setAnimals] = useState<BasicAnimalRecord[]>([]);
  const [veterinarians, setVeterinarians] = useState<VeterinarianRecord[]>([]);
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<VeterinarianRecord | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Otomatik hekim seçimi: En az randevusu olan hekimi seç
  const selectBestVeterinarian = async (): Promise<VeterinarianRecord | null> => {
    if (veterinarians.length === 0) {
      return null;
    }

    try {
      const appointmentService = new AppointmentService();
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 7); // Önümüzdeki 7 gün

      // Her hekim için randevu sayısını hesapla
      const vetAppointmentCounts = await Promise.all(
        veterinarians.map(async (vet) => {
          try {
            const response = await appointmentService.getAppointmentsByDateRange(now, tomorrow, vet.id.toString());
            const count = response.success && response.data ? response.data.length : 0;
            return { vet, count };
          } catch {
            return { vet, count: 999 }; // Hata durumunda yüksek sayı ver
          }
        })
      );

      // En az randevusu olan hekimi seç
      const bestVet = vetAppointmentCounts.reduce((min, current) => 
        current.count < min.count ? current : min
      );

      return bestVet.vet;
    } catch (err) {
      console.error('Hekim seçimi hatası:', err);
      // Hata durumunda ilk hekimi seç
      return veterinarians.length > 0 ? veterinarians[0] : null;
    }
  };

  // Otomatik tarih/saat seçimi: En yakın uygun slot'u bul
  const findNextAvailableSlot = async (vetId?: number): Promise<string> => {
    const now = new Date();
    try {
      const appointmentService = new AppointmentService();
      
      // Bugünden itibaren 7 gün içinde uygun slot ara
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() + dayOffset);
        checkDate.setHours(0, 0, 0, 0);

        try {
          const slotsResponse = await appointmentService.getAvailableSlots(checkDate, vetId?.toString());
          
          if (slotsResponse.success && slotsResponse.data && slotsResponse.data.length > 0) {
            // Müsait slotları filtrele
            const availableSlots = slotsResponse.data.filter(slot => {
              if (!slot.available) return false;
              
              // Bugünse, geçmiş saatleri filtrele
              if (dayOffset === 0) {
                const slotDate = new Date(slot.date);
                const [hours, minutes] = slot.startTime.split(':').map(Number);
                slotDate.setHours(hours, minutes || 0, 0, 0);
                return slotDate > now;
              }
              return true;
            });

            if (availableSlots.length > 0) {
              const firstSlot = availableSlots[0];
              const slotDate = new Date(firstSlot.date);
              const [hours, minutes] = firstSlot.startTime.split(':').map(Number);
              slotDate.setHours(hours, minutes || 0, 0, 0);
              return slotDate.toISOString();
            }
          }
        } catch {
          // Bu tarih için slot bulunamadı, devam et
          continue;
        }
      }

      // Slot bulunamazsa, bugün 1 saat sonrasını kullan
      const fallbackTime = new Date(now);
      fallbackTime.setHours(fallbackTime.getHours() + 1);
      // Saati yarım saatlik dilimlere yuvarla
      const minutes = fallbackTime.getMinutes();
      fallbackTime.setMinutes(minutes < 30 ? 30 : 60, 0, 0);
      if (fallbackTime.getHours() >= 18) {
        // 18:00'den sonraki saatler için yarın sabah 9:00'u seç
        fallbackTime.setDate(fallbackTime.getDate() + 1);
        fallbackTime.setHours(9, 0, 0);
      }
      return fallbackTime.toISOString();
    } catch (err) {
      console.error('Slot bulma hatası:', err);
      // Hata durumunda bugün 1 saat sonrasını kullan
      const fallbackTime = new Date(now);
      fallbackTime.setHours(fallbackTime.getHours() + 1);
      fallbackTime.setMinutes(30, 0, 0);
      return fallbackTime.toISOString();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setAnimalId('');
      setAnimals([]);
      setVeterinarians([]);
      setSelectedVeterinarian(null);
      setSelectedDateTime('');
      setError(null);
      setIsSubmitting(false);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const animalService = new AnimalService();
        const [animalResponse, veterinarianResponse] = await Promise.all([
          animalService.getBasicAnimals(),
          VeterinarianService.getActiveVeterinarians(),
        ]);

        if (!isMounted) {
          return;
        }

        const loadedAnimals = animalResponse.success && Array.isArray(animalResponse.data) 
          ? animalResponse.data 
          : [];
        const loadedVets = veterinarianResponse.success && Array.isArray(veterinarianResponse.data)
          ? veterinarianResponse.data
          : [];

        setAnimals(loadedAnimals);
        setVeterinarians(loadedVets);

        // Otomatik olarak en uygun hekimi seç
        const bestVet = await selectBestVeterinarian();
        if (bestVet) {
          setSelectedVeterinarian(bestVet);
          
          // Uygun tarih/saat bul
          const availableSlot = await findNextAvailableSlot(bestVet.id);
          setSelectedDateTime(availableSlot);
        } else if (loadedVets.length > 0) {
          // Hekim bulundu ama seçim yapılamadı, ilkini kullan
          setSelectedVeterinarian(loadedVets[0]);
          const availableSlot = await findNextAvailableSlot(loadedVets[0].id);
          setSelectedDateTime(availableSlot);
        } else {
          // Hekim yok, sadece tarih/saat bul
          const availableSlot = await findNextAvailableSlot();
          setSelectedDateTime(availableSlot);
        }
      } catch (err) {
        console.error('Hızlı randevu seçenekleri alınırken hata oluştu:', err);
        if (isMounted) {
          setError('Ön bilgiler alınırken bir sorun oluştu. Lütfen tekrar deneyin.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const selectedAnimal = useMemo(() => {
    if (!animalId) {
      return undefined;
    }
    return animals.find((animal) => animal.id === Number(animalId));
  }, [animals, animalId]);

  const handleAnimalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimalId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!animalId) {
      setError('Lütfen bir hasta seçin.');
      return;
    }

    if (!selectedDateTime) {
      setError('Randevu zamanı belirlenemedi. Lütfen tekrar deneyin.');
      return;
    }

    const payload: CreateAppointmentRequest = {
      animalId: Number(animalId),
      dateTime: selectedDateTime,
      subject: 'Hızlı Randevu',
    };

    if (selectedVeterinarian) {
      payload.veterinarianId = selectedVeterinarian.id;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const appointmentService = new AppointmentService();
      const response = await appointmentService.createAppointment(payload);

      if (!response.success) {
        setError(response.error || 'Randevu oluşturulamadı.');
        return;
      }

      await onCreated();
      onClose();
    } catch (err) {
      console.error('Randevu oluşturulurken hata oluştu:', err);
      setError('Randevu oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeString;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fast-appointment-modal__overlay" onClick={onClose} role="presentation">
      <div
        className="fast-appointment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fast-appointment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="fast-appointment-modal__header">
          <div className="fast-appointment-modal__header-content">
            <span className="fast-appointment-modal__ai-icon">✨</span>
            <h2 id="fast-appointment-title">Hızlı Randevu Oluştur</h2>
          </div>
          <button
            type="button"
            className="fast-appointment-modal__close"
            onClick={onClose}
            aria-label="Modalı kapat"
          >
            ×
          </button>
        </div>

        {isLoading && (
          <div className="fast-appointment-modal__info">
            <span className="fast-appointment-modal__loading-icon">⏳</span>
            Uygun hekim ve zaman aranıyor...
          </div>
        )}

        <form onSubmit={handleSubmit} className="fast-appointment-modal__form">
          <div className="fast-appointment-modal__field">
            <label htmlFor="fast-appointment-animal">
              <span className="icon">🐾</span> Hasta Seçin
            </label>
            <select
              id="fast-appointment-animal"
              name="animalId"
              value={animalId}
              onChange={handleAnimalChange}
              required
              disabled={isLoading || isSubmitting}
            >
              <option value="">Hasta seçin</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                  {animal.ownerName ? ` — ${animal.ownerName}` : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedAnimal && (
            <div className="fast-appointment-modal__meta">
              <span>
                <strong>Tür:</strong> {selectedAnimal.speciesName || 'Belirtilmemiş'}
              </span>
              {selectedAnimal.microchipNumber && (
                <span>
                  <strong>Çip:</strong> {selectedAnimal.microchipNumber}
                </span>
              )}
            </div>
          )}

          {selectedVeterinarian && (
            <div className="fast-appointment-modal__auto-selected">
              <div className="fast-appointment-modal__auto-badge">
                <span className="fast-appointment-modal__sparkle">✨</span>
                Otomatik Seçildi
              </div>
              <div className="fast-appointment-modal__info-card">
                <div className="fast-appointment-modal__info-row">
                  <span className="fast-appointment-modal__info-label">Hekim:</span>
                  <span className="fast-appointment-modal__info-value">{selectedVeterinarian.fullName}</span>
                </div>
                {selectedDateTime && (
                  <div className="fast-appointment-modal__info-row">
                    <span className="fast-appointment-modal__info-label">Randevu Zamanı:</span>
                    <span className="fast-appointment-modal__info-value">{formatDateTime(selectedDateTime)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="fast-appointment-modal__error">
              {error}
            </div>
          )}

          <div className="fast-appointment-modal__actions">
            <button
              type="button"
              className="fast-appointment-modal__button fast-appointment-modal__button--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="fast-appointment-modal__button fast-appointment-modal__button--primary"
              disabled={isSubmitting || isLoading || !animalId}
            >
              {isSubmitting ? 'Kaydediliyor…' : '✨ Randevuyu Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FastAppointmentModal;
