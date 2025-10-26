import { useState, useEffect, useCallback } from 'react';
import { useError } from '../../../context/ErrorContext';
import { useLoading } from '../../../hooks/useLoading';

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseOwnersOptions {
  page?: number;
  limit?: number;
  search?: string;
  autoFetch?: boolean;
}

interface UseOwnersReturn {
  owners: Owner[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  fetchOwners: (options?: UseOwnersOptions) => Promise<void>;
  createOwner: (ownerData: Partial<Owner>) => Promise<boolean>;
  updateOwner: (id: string, ownerData: Partial<Owner>) => Promise<boolean>;
  deleteOwner: (id: string) => Promise<boolean>;
  getOwnerById: (id: string) => Promise<Owner | null>;
  refresh: () => Promise<void>;
}

// Mock service - gerçek uygulamada API service kullanılacak
const mockOwners: Owner[] = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    phone: '+90 555 123 45 67',
    email: 'ahmet@email.com',
    address: 'İstanbul, Türkiye'
  },
  {
    id: '2',
    firstName: 'Ayşe',
    lastName: 'Demir',
    phone: '+90 555 987 65 43',
    email: 'ayse@email.com',
    address: 'Ankara, Türkiye'
  },
  {
    id: '3',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    phone: '+90 555 456 78 90',
    email: 'mehmet@email.com',
    address: 'İzmir, Türkiye'
  }
];

export const useOwners = (initialOptions: UseOwnersOptions = {}): UseOwnersReturn => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialOptions.page || 0);
  const [limit, setLimit] = useState(initialOptions.limit || 10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { addError, showSuccess } = useError();
  const { loading, startLoading, stopLoading } = useLoading();

  const fetchOwners = useCallback(async (options: UseOwnersOptions = {}) => {
    try {
      startLoading('Sahipler yükleniyor...');
      setError(null);

      // Mock API call - gerçek uygulamada API service kullanılacak
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const currentPage = options.page ?? page;
      const currentLimit = options.limit ?? limit;
      const searchTerm = options.search ?? initialOptions.search;

      let filteredOwners = [...mockOwners];

      // Search filter
      if (searchTerm) {
        filteredOwners = filteredOwners.filter(owner =>
          owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          owner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          owner.phone.includes(searchTerm) ||
          (owner.email && owner.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      const totalCount = filteredOwners.length;
      const totalPagesCount = Math.ceil(totalCount / currentLimit);
      const startIndex = currentPage * currentLimit;
      const endIndex = startIndex + currentLimit;
      const paginatedOwners = filteredOwners.slice(startIndex, endIndex);

      setOwners(paginatedOwners);
      setTotal(totalCount);
      setTotalPages(totalPagesCount);
      setPage(currentPage);
      setLimit(currentLimit);
      showSuccess('Sahipler başarıyla yüklendi');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Sahip Listesi Hatası', 'error', errorMessage);
    } finally {
      stopLoading();
    }
  }, [page, limit, addError, showSuccess, startLoading, stopLoading]);

  const createOwner = useCallback(async (ownerData: Partial<Owner>): Promise<boolean> => {
    try {
      startLoading('Sahip ekleniyor...');
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newOwner: Owner = {
        id: Date.now().toString(),
        firstName: ownerData.firstName || '',
        lastName: ownerData.lastName || '',
        phone: ownerData.phone || '',
        email: ownerData.email,
        address: ownerData.address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockOwners.push(newOwner);
      showSuccess('Sahip başarıyla eklendi');
      await fetchOwners(); // Listeyi yenile
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Sahip Ekleme Hatası', 'error', errorMessage);
      return false;
    } finally {
      stopLoading();
    }
  }, [addError, showSuccess, startLoading, stopLoading, fetchOwners]);

  const updateOwner = useCallback(async (id: string, ownerData: Partial<Owner>): Promise<boolean> => {
    try {
      startLoading('Sahip güncelleniyor...');
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const ownerIndex = mockOwners.findIndex(owner => owner.id === id);
      if (ownerIndex === -1) {
        throw new Error('Sahip bulunamadı');
      }

      mockOwners[ownerIndex] = {
        ...mockOwners[ownerIndex],
        ...ownerData,
        updatedAt: new Date().toISOString()
      };

      showSuccess('Sahip başarıyla güncellendi');
      await fetchOwners(); // Listeyi yenile
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Sahip Güncelleme Hatası', 'error', errorMessage);
      return false;
    } finally {
      stopLoading();
    }
  }, [addError, showSuccess, startLoading, stopLoading, fetchOwners]);

  const deleteOwner = useCallback(async (id: string): Promise<boolean> => {
    try {
      startLoading('Sahip siliniyor...');
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const ownerIndex = mockOwners.findIndex(owner => owner.id === id);
      if (ownerIndex === -1) {
        throw new Error('Sahip bulunamadı');
      }

      mockOwners.splice(ownerIndex, 1);
      showSuccess('Sahip başarıyla silindi');
      await fetchOwners(); // Listeyi yenile
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Sahip Silme Hatası', 'error', errorMessage);
      return false;
    } finally {
      stopLoading();
    }
  }, [addError, showSuccess, startLoading, stopLoading, fetchOwners]);

  const getOwnerById = useCallback(async (id: string): Promise<Owner | null> => {
    try {
      startLoading('Sahip bilgileri yükleniyor...');
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const owner = mockOwners.find(owner => owner.id === id);
      return owner || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      addError('Sahip Bilgisi Hatası', 'error', errorMessage);
      return null;
    } finally {
      stopLoading();
    }
  }, [addError, startLoading, stopLoading]);

  const refresh = useCallback(async () => {
    await fetchOwners();
  }, [fetchOwners]);

  // İlk yükleme
  useEffect(() => {
    if (initialOptions.autoFetch !== false) {
      fetchOwners(initialOptions);
    }
  }, []);

  return {
    owners,
    loading: loading.isLoading,
    error,
    total,
    page,
    limit,
    totalPages,
    fetchOwners,
    createOwner,
    updateOwner,
    deleteOwner,
    getOwnerById,
    refresh
  };
};

export default useOwners;
