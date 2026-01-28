import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { vaccinationService } from '../services/vaccinationService';
import { stockService } from '../../stock/services/stockService';
import { animalService, type BasicAnimalRecord } from '../../animals/services/animalService';
import { Vaccine } from '../types/vaccination';
import VaccinationHistoryCheck from '../components/VaccinationHistoryCheck';
import BarcodeScanner from '../components/BarcodeScanner';

const NewVaccinationPage: React.FC = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<BasicAnimalRecord[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [stock, setStock] = useState<any[]>([]);

  const [selectedAnimal, setSelectedAnimal] = useState<BasicAnimalRecord | null>(null);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<string>('');

  // Dates as strings YYYY-MM-DD
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState<string>('');

  const [veterinarianName, setVeterinarianName] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedVaccine) {
      fetchStockForVaccine(selectedVaccine);
    } else {
      setStock([]);
      setSelectedStockId('');
    }
  }, [selectedVaccine]);

  const fetchInitialData = async () => {
    try {
      const [animalsRes, vaccinesRes] = await Promise.all([
        animalService.getBasicAnimals(),
        vaccinationService.getVaccines()
      ]);

      const animalList = animalsRes.data || [];
      setAnimals(animalList);
      setVaccines(vaccinesRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Veriler yüklenirken hata oluştu.');
    }
  };

  const fetchStockForVaccine = async (vaccine: Vaccine) => {
    setStockLoading(true);
    try {
      const res = await stockService.getStock();
      const allStock = res.data || [];
      const matchingStock = allStock.filter((s: any) =>
        s.category === 'VACCINE' &&
        s.name.toLowerCase().includes(vaccine.name.toLowerCase()) &&
        s.currentStock > 0
      );
      setStock(matchingStock);
    } catch (err) {
      console.error(err);
    } finally {
      setStockLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal || !selectedVaccine || !date) {
      setError('Lütfen zorunlu alanları doldurunuz.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await vaccinationService.createVaccination({
        animalId: selectedAnimal.id,
        vaccineId: selectedVaccine.id,
        date: new Date(date),
        nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
        veterinarianName: veterinarianName,
        notes: notes,
        stockProductId: selectedStockId || undefined,
        deductStock: !!selectedStockId
      });

      // Sayfada kal, formu hafifçe temizle ve geçmişi yenile
      setSuccess('Aşı kaydı başarıyla oluşturuldu.');
      setHistoryRefreshKey((key) => key + 1);
      setSelectedVaccine(null);
      setSelectedStockId('');
      setNextDueDate('');
      setNotes('');
    } catch (err) {
      console.error(err);
      setError('Aşı kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>Yeni Aşı Kaydı</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Autocomplete
                options={animals}
                getOptionLabel={(option) => `${option.name} (${option.microchipNumber || 'No Chip'})`}
                value={selectedAnimal}
                onChange={(_, newValue) => setSelectedAnimal(newValue)}
                renderInput={(params) => <TextField {...params} label="Hasta Seçimi" required />}
              />
            </Box>

            {/* Geçmiş Aşı Karnesi Kontrolü */}
            {selectedAnimal && (
              <VaccinationHistoryCheck
                animalId={selectedAnimal.id}
                animalName={selectedAnimal.name}
                selectedVaccineId={selectedVaccine?.id}
              selectedVaccineName={selectedVaccine?.name}
              refreshKey={historyRefreshKey}
              />
            )}

            <Box>
              <Autocomplete
                options={vaccines}
                getOptionLabel={(option) => option.name}
                value={selectedVaccine}
                onChange={(_, newValue) => setSelectedVaccine(newValue)}
                renderInput={(params) => <TextField {...params} label="Aşı Seçimi" required />}
              />
            </Box>

            {/* Barkod Tarama ile Stok Seçimi */}
            {selectedVaccine && (
              <BarcodeScanner
                onProductSelect={(product) => {
                  if (product && product.productId) {
                    setSelectedStockId(String(product.productId));
                  } else {
                    setSelectedStockId('');
                  }
                }}
                selectedProductId={selectedStockId}
                disabled={!selectedVaccine}
              />
            )}

            {/* Manuel Stok Seçimi (Alternatif) */}
            <Box>
              <TextField
                select
                fullWidth
                label="Stoktan Düş (Manuel Seçim)"
                value={selectedStockId}
                onChange={(e) => setSelectedStockId(e.target.value)}
                disabled={!selectedVaccine || stockLoading}
                helperText={stockLoading ? "Stok kontrol ediliyor..." : "Barkod taraması yapamıyorsanız manuel seçim yapabilirsiniz"}
              >
                <MenuItem value="">Seçiniz (Stoktan Düşme)</MenuItem>
                {stock.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} - Lot: {item.lotNo || 'N/A'} (Stok: {item.currentStock})
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                type="date"
                label="Uygulama Tarihi"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                type="date"
                label="Sonraki Aşı Tarihi"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Veteriner Hekim"
              value={veterinarianName}
              onChange={(e) => setVeterinarianName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notlar"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate(-1)}>İptal</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Kaydet'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default NewVaccinationPage;
