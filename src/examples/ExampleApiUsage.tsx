import React from 'react';
import { AnimalService } from '../features/animals/services/animalService';
import { useApiCall } from '../hooks/useApiCall';
import { Button, Box, Paper, Typography } from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Bu component, yeni useApiCall hook'unun nasıl kullanılacağını gösterir
 */
export const ExampleApiUsage: React.FC = () => {
  const animalService = new AnimalService();

  // ✅ Kullanım 1: Basit API çağrısı
  const { call: loadAnimals, loading, error, data } = useApiCall(
    () => animalService.getAllAnimals(),
    {
      successMessage: 'Hayvanlar başarıyla yüklendi!',
      errorMessage: 'Hayvanlar yüklenirken hata oluştu!',
    }
  );

  // ✅ Kullanım 2: Parametreli API çağrısı
  const { call: createAnimal, loading: creating } = useApiCall(
    (animal: any) => animalService.createAnimal(animal),
    {
      successMessage: 'Hayvan başarıyla oluşturuldu!',
      errorMessage: 'Hayvan oluşturulamadı!',
      onSuccess: (data) => {
        console.log('Hayvan oluşturuldu:', data);
        // Sayfayı yenile veya yönlendir
      },
    }
  );

  const handleLoad = async () => {
    await loadAnimals();
  };

  const handleCreate = async () => {
    await createAnimal({
      name: 'Yeni Hayvan',
      species: 'cat',
      ownerId: 1,
    });
  };

  if (loading) {
    return <LoadingSpinner isLoading={true} message="Yükleniyor..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          useApiCall Hook Kullanımı
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleLoad}
            disabled={loading}
          >
            {loading ? 'Yükleniyor...' : 'Hayvanları Yükle'}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? 'Oluşturuluyor...' : 'Yeni Hayvan Oluştur'}
          </Button>
        </Box>

        {error && (
          <Box sx={{ mt: 2, color: 'error.main' }}>
            <Typography>Hata: {error.message}</Typography>
          </Box>
        )}

        {data && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Hayvanlar:</Typography>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ExampleApiUsage;
