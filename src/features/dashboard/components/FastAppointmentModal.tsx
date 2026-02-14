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

  // Otomatik hekim seçimi: İlk uygun hekimi seç
  // TODO: Gelecekte available slots endpoint'i eklendiğinde en az randevusu olan hekimi seçecek şekilde güncellenebilir
  const selectBestVeterinarian = async (vets: VeterinarianRecord[]): Promise<VeterinarianRecord | null> => {
    if (vets.length === 0) {
      return null;
    }

    // Şimdilik basitçe ilk aktif hekimi seç
    // Backend'de available slots endpoint'i olmadığı için karmaşık seçim algoritması kullanamıyoruz
    return vets[0];
  };

  // Otomatik tarih/saat seçimi: En yakın uygun slot'u bul
  const findNextAvailableSlot = async (vetId?: number): Promise<string> => {
    const now = new Date();
    
    // Backend @Future validation için en az 2 dakika sonrasını seç
    // Available slots endpoint'i henüz backend'de yok, bu yüzden basit bir algoritma kullanıyoruz
    const fallbackTime = new Date(now);
    fallbackTime.setHours(fallbackTime.getHours() + 1);
    
    // Saati yarım saatlik dilimlere yuvarla
    const minutes = fallbackTime.getMinutes();
    if (minutes < 30) {
      fallbackTime.setMinutes(30, 0, 0);
    } else {
      fallbackTime.setMinutes(0, 0, 0);
      fallbackTime.setHours(fallbackTime.getHours() + 1);
    }
    
    // Eğer çalışma saatleri dışındaysa (18:00'den sonra veya 9:00'dan önce), bir sonraki iş günü sabah 9:00'u seç
    if (fallbackTime.getHours() >= 18 || fallbackTime.getHours() < 9) {
      fallbackTime.setDate(fallbackTime.getDate() + 1);
      fallbackTime.setHours(9, 0, 0, 0);
    }
    
    return fallbackTime.toISOString();
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
        
        // Hayvan ve hekim listelerini paralel olarak al
        const [animalResponse, veterinarianResponse] = await Promise.all([
          animalService.getBasicAnimals().catch(err => {
            console.error('Hayvan listesi alınamadı:', err);
            return { success: false, data: [], error: 'Hayvan listesi alınamadı' };
          }),
          VeterinarianService.getActiveVeterinarians().catch(err => {
            console.error('Hekim listesi alınamadı:', err);
            return { success: false, data: [], error: 'Hekim listesi alınamadı' };
          }),
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

        // Eğer hayvan listesi boşsa, kullanıcıya bilgi ver
        if (loadedAnimals.length === 0) {
          setError('Sistemde kayıtlı hayvan bulunamadı. Önce bir hayvan kaydı oluşturun.');
          setAnimals([]);
          setVeterinarians(loadedVets);
          return;
        }

        setAnimals(loadedAnimals);
        setVeterinarians(loadedVets);

        // Otomatik olarak en uygun hekimi seç
        if (loadedVets.length > 0) {
          const bestVet = await selectBestVeterinarian(loadedVets);
          if (bestVet) {
            setSelectedVeterinarian(bestVet);
            
            // Uygun tarih/saat bul
            const availableSlot = await findNextAvailableSlot(bestVet.id);
            setSelectedDateTime(availableSlot);
          } else {
            // Hekim bulundu ama seçim yapılamadı, ilkini kullan
            setSelectedVeterinarian(loadedVets[0]);
            const availableSlot = await findNextAvailableSlot(loadedVets[0].id);
            setSelectedDateTime(availableSlot);
          }
        } else {
          // Hekim yok, sadece tarih/saat bul (hekim ataması olmadan randevu oluşturulabilir)
          console.warn('Sistemde kayıtlı hekim bulunamadı. Hekim ataması olmadan randevu oluşturulacak.');
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

    // Backend LocalDateTime formatı bekliyor (timezone bilgisi olmadan)
    // ISO 8601 formatını LocalDateTime formatına çevir: "2026-01-20T22:00:00"
    const formatDateTimeForBackend = (isoString: string): string => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    // Payload oluştur - undefined değerleri göndermemek için conditional olarak ekle
    const payload: any = {
      animalId: Number(animalId),
      dateTime: formatDateTimeForBackend(selectedDateTime),
      subject: 'Hızlı Randevu',
    };

    // veterinarianId varsa ekle, yoksa hiç gönderme
    if (selectedVeterinarian && selectedVeterinarian.id) {
      payload.veterinarianId = selectedVeterinarian.id;
    }

    console.log('Randevu oluşturma payload:', payload);

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

          {selectedVeterinarian ? (
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
          ) : selectedDateTime && (
            <div className="fast-appointment-modal__auto-selected">
              <div className="fast-appointment-modal__auto-badge">
                <span className="fast-appointment-modal__sparkle">✨</span>
                Otomatik Seçildi
              </div>
              <div className="fast-appointment-modal__info-card">
                <div className="fast-appointment-modal__info-row">
                  <span className="fast-appointment-modal__info-label">Randevu Zamanı:</span>
                  <span className="fast-appointment-modal__info-value">{formatDateTime(selectedDateTime)}</span>
                </div>
                <div className="fast-appointment-modal__info-row">
                  <span className="fast-appointment-modal__info-label" style={{ fontSize: '12px', color: '#666' }}>
                    (Hekim daha sonra atanacak)
                  </span>
                </div>
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
