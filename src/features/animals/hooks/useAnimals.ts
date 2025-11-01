import { useState, useEffect, useCallback } from 'react';
import { AnimalService, type AnimalRecord } from '../services/animalService';
import { useError } from '../../../context/ErrorContext';
import { useLoading } from '../../../hooks/useLoading';

interface UseAnimalsOptions {
  page?: number;
  limit?: number;
  search?: string;
  autoFetch?: boolean;
}

interface UseAnimalsReturn {
  animals: AnimalRecord[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  fetchAnimals: (options?: UseAnimalsOptions) => Promise<void>;
  createAnimal: (animalData: Partial<AnimalRecord>) => Promise<boolean>;
  updateAnimal: (id: string, animalData: Partial<AnimalRecord>) => Promise<boolean>;
  deleteAnimal: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useAnimals = (initialOptions: UseAnimalsOptions = {}): UseAnimalsReturn => {
  const [animals, setAnimals] = useState<AnimalRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialOptions.page || 0);
  const [limit, setLimit] = useState(initialOptions.limit || 10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { addError, showSuccess } = useError();
  const { loading, startLoading, stopLoading } = useLoading();

  const animalService = new AnimalService();

  const fetchAnimals = useCallback(async (options: UseAnimalsOptions = {}) => {
    try {
      startLoading('Hayvanlar yükleniyor...');
      setError(null);

      const currentPage = options.page ?? page;
      const currentLimit = options.limit ?? limit;
      const searchTerm = options.search ?? initialOptions.search;

      const response = await animalService.getAnimals(currentPage, currentLimit, searchTerm);

      if (response.success && response.data) {
        setAnimals(response.data.items);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
        setPage(currentPage);
        setLimit(currentLimit);
        showSuccess('Hayvanlar başarıyla yüklendi');
      } else {
        const errorMessage = response.error || 'Hayvanlar yüklenirken hata oluştu';
        setError(errorMessage);
        addError('Hayvan Listesi Hatası', 'error', errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Hayvan Listesi Hatası', 'error', errorMessage);
    } finally {
      stopLoading();
    }
  }, [page, limit, animalService, addError, showSuccess, startLoading, stopLoading]);

  const createAnimal = useCallback(async (animalData: any): Promise<boolean> => {
    try {
      startLoading('Hayvan ekleniyor...');
      setError(null);

      const response = await animalService.createAnimal(animalData);

      if (response.success) {
        showSuccess('Hayvan başarıyla eklendi');
        await fetchAnimals(); // Listeyi yenile
        return true;
      } else {
        const errorMessage = response.error || 'Hayvan eklenirken hata oluştu';
        setError(errorMessage);
        addError('Hayvan Ekleme Hatası', 'error', errorMessage);
        return false;
      }
    } catch (err: any) {
      // Validation hataları için detaylı mesaj göster
      let errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      
      // 400 validation hatası için payload'dan detaylı mesaj al
      if (err?.status === 400 && err?.payload?.validationErrors) {
        const validationErrors = err.payload.validationErrors;
        const errorDetails = Object.entries(validationErrors)
          .map(([field, message]) => {
            // Field adını Türkçe'ye çevir
            const fieldNames: { [key: string]: string } = {
              'ownerId': 'Sahip ID',
              'name': 'İsim',
              'speciesId': 'Tür ID',
              'breedId': 'Irk ID',
              'gender': 'Cinsiyet',
              'birthDate': 'Doğum Tarihi',
              'weight': 'Ağırlık',
              'color': 'Renk',
              'microchipNo': 'Çip Numarası',
              'allergies': 'Alerjiler',
              'chronicDiseases': 'Kronik Hastalıklar',
              'notes': 'Notlar'
            };
            const fieldName = fieldNames[field] || field;
            return `${fieldName}: ${message}`;
          })
          .join('\n');
        errorMessage = `Doğrulama Hatası:\n${errorDetails}`;
      }
      
      setError(errorMessage);
      addError('Hayvan Ekleme Hatası', 'error', errorMessage);
      return false;
    } finally {
      stopLoading();
    }
  }, [animalService, addError, showSuccess, startLoading, stopLoading, fetchAnimals]);

  const updateAnimal = useCallback(async (id: string, animalData: any): Promise<boolean> => {
    try {
      startLoading('Hayvan güncelleniyor...');
      setError(null);

      const response = await animalService.updateAnimal(id, animalData);

      if (response.success) {
        showSuccess('Hayvan başarıyla güncellendi');
        await fetchAnimals(); // Listeyi yenile
        return true;
      } else {
        const errorMessage = response.error || 'Hayvan güncellenirken hata oluştu';
        setError(errorMessage);
        addError('Hayvan Güncelleme Hatası', 'error', errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Hayvan Güncelleme Hatası', 'error', errorMessage);
      return false;
    } finally {
      stopLoading();
    }
  }, [animalService, addError, showSuccess, startLoading, stopLoading, fetchAnimals]);

  const deleteAnimal = useCallback(async (id: string): Promise<boolean> => {
    try {
      startLoading('Hayvan siliniyor...');
      setError(null);

      const response = await animalService.deleteAnimal(id);

      if (response.success) {
        showSuccess('Hayvan başarıyla silindi');
        await fetchAnimals(); // Listeyi yenile
        return true;
      } else {
        const errorMessage = response.error || 'Hayvan silinirken hata oluştu';
        setError(errorMessage);
        addError('Hayvan Silme Hatası', 'error', errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Hayvan Silme Hatası', 'error', errorMessage);
      return false;
    } finally {
      stopLoading();
    }
  }, [animalService, addError, showSuccess, startLoading, stopLoading, fetchAnimals]);

  const refresh = useCallback(async () => {
    await fetchAnimals();
  }, [fetchAnimals]);

  // İlk yükleme
  useEffect(() => {
    if (initialOptions.autoFetch !== false) {
      fetchAnimals(initialOptions);
    }
  }, []);

  return {
    animals,
    loading: loading.isLoading,
    error,
    total,
    page,
    limit,
    totalPages,
    fetchAnimals,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    refresh
  };
};

export default useAnimals;
