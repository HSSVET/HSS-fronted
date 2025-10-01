import React, { useEffect, useMemo, useState } from 'react';
import { AnimalService, type BasicAnimalRecord } from '../../animals/services/animalService';
import { VeterinarianService, type VeterinarianRecord } from '../../veterinarians/services/veterinarianService';
import { AppointmentService } from '../../appointments/services/appointmentService';
import type { CreateAppointmentRequest } from '../../appointments/types/appointment';
import '../styles/QuickAppointmentModal.css';

interface QuickAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

const todayIso = new Date().toISOString().split('T')[0];

interface QuickAppointmentFormState {
  animalId: string;
  veterinarianId: string;
  date: string;
  time: string;
  subject: string;
}

const defaultFormState: QuickAppointmentFormState = {
  animalId: '',
  veterinarianId: '',
  date: todayIso,
  time: '',
  subject: '',
};

const QuickAppointmentModal: React.FC<QuickAppointmentModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [formState, setFormState] = useState<QuickAppointmentFormState>(defaultFormState);
  const [animals, setAnimals] = useState<BasicAnimalRecord[]>([]);
  const [veterinarians, setVeterinarians] = useState<VeterinarianRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormState({ ...defaultFormState, date: new Date().toISOString().split('T')[0] });
      setAnimals([]);
      setVeterinarians([]);
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

        const [animalResponse, veterinarianResponse] = await Promise.all([
          AnimalService.getBasicAnimals(),
          VeterinarianService.getActiveVeterinarians(),
        ]);

        if (!isMounted) {
          return;
        }

        setAnimals(animalResponse.success && Array.isArray(animalResponse.data) ? animalResponse.data : []);
        setVeterinarians(
          veterinarianResponse.success && Array.isArray(veterinarianResponse.data)
            ? veterinarianResponse.data
            : []
        );
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
    if (!formState.animalId) {
      return undefined;
    }
    return animals.find((animal) => animal.id === Number(formState.animalId));
  }, [animals, formState.animalId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!formState.animalId) {
      setError('Lütfen bir hasta seçin.');
      return;
    }

    if (!formState.date || !formState.time) {
      setError('Lütfen randevu tarihini ve saatini belirtin.');
      return;
    }

    const dateTime = `${formState.date}T${formState.time.length === 5 ? `${formState.time}:00` : formState.time}`;

    const payload: CreateAppointmentRequest = {
      animalId: Number(formState.animalId),
      dateTime,
      subject: formState.subject.trim() || undefined,
    };

    if (formState.veterinarianId) {
      payload.veterinarianId = Number(formState.veterinarianId);
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await AppointmentService.createAppointment(payload);

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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="quick-appointment-modal__overlay" onClick={onClose} role="presentation">
      <div
        className="quick-appointment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-appointment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="quick-appointment-modal__header">
          <h2 id="quick-appointment-title">Yeni Randevu Oluştur</h2>
          <button
            type="button"
            className="quick-appointment-modal__close"
            onClick={onClose}
            aria-label="Modalı kapat"
          >
            ×
          </button>
        </div>

        {isLoading && (
          <div className="quick-appointment-modal__info">Seçenekler yükleniyor...</div>
        )}

        <form onSubmit={handleSubmit} className="quick-appointment-modal__form">
          <div className="quick-appointment-modal__field">
            <label htmlFor="quick-appointment-animal">Hasta</label>
            <select
              id="quick-appointment-animal"
              name="animalId"
              value={formState.animalId}
              onChange={handleInputChange}
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
            <div className="quick-appointment-modal__meta">
              <span>
                Tür: {selectedAnimal.speciesName || 'Belirtilmemiş'}
              </span>
              {selectedAnimal.microchipNumber && (
                <span>Çip: {selectedAnimal.microchipNumber}</span>
              )}
            </div>
          )}

          <div className="quick-appointment-modal__row">
            <div className="quick-appointment-modal__field">
              <label htmlFor="quick-appointment-date">Tarih</label>
              <input
                id="quick-appointment-date"
                type="date"
                name="date"
                value={formState.date}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="quick-appointment-modal__field">
              <label htmlFor="quick-appointment-time">Saat</label>
              <input
                id="quick-appointment-time"
                type="time"
                name="time"
                value={formState.time}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="quick-appointment-modal__field">
            <label htmlFor="quick-appointment-veterinarian">Veteriner (opsiyonel)</label>
            <select
              id="quick-appointment-veterinarian"
              name="veterinarianId"
              value={formState.veterinarianId}
              onChange={handleInputChange}
              disabled={isLoading || isSubmitting}
            >
              <option value="">Veteriner seçin</option>
              {veterinarians.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  {vet.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="quick-appointment-modal__field">
            <label htmlFor="quick-appointment-subject">Not</label>
            <textarea
              id="quick-appointment-subject"
              name="subject"
              value={formState.subject}
              onChange={handleInputChange}
              placeholder="Randevu notu (opsiyonel)"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {error && (
            <div className="quick-appointment-modal__error">
              {error}
            </div>
          )}

          <div className="quick-appointment-modal__actions">
            <button
              type="button"
              className="quick-appointment-modal__button quick-appointment-modal__button--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="quick-appointment-modal__button quick-appointment-modal__button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor…' : 'Randevuyu Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAppointmentModal;
