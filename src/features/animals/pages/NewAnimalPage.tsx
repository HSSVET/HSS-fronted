import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  FormHelperText,
  Alert,
  Stack,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { speciesService, type Species } from '../../../services/speciesService';
import { breedService, type Breed } from '../../../services/breedService';
import { ownerService } from '../../../services/ownerService';
import { animalService } from '../services/animalService';
import { useNotifications } from '../../../hooks/useNotifications';
import { useLoading } from '../../../hooks/useLoading';

const NewAnimalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const ownerIdParam = searchParams.get('ownerId');
  const ownerId = ownerIdParam ? parseInt(ownerIdParam, 10) : null;

  const { showSuccess, addError } = useNotifications();
  const { startLoading, stopLoading } = useLoading();

  const [ownerName, setOwnerName] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    breedId: '',
    gender: '',
    birthDate: '',
    weight: '',
    color: '',
    microchipNo: '',
    allergies: '',
    chronicDiseases: '',
    notes: '',
  });
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [breedList, setBreedList] = useState<Breed[]>([]);
  const [loadingOwner, setLoadingOwner] = useState(true);

  useEffect(() => {
    if (!ownerId || !slug) return;
    const loadOwner = async () => {
      setLoadingOwner(true);
      try {
        const res = await ownerService.getOwnerById(ownerId);
        if (res.success && res.data) {
          setOwnerName(`${res.data.firstName ?? ''} ${res.data.lastName ?? ''}`.trim() || 'Sahip');
        }
      } catch {
        setOwnerName('Sahip');
      } finally {
        setLoadingOwner(false);
      }
    };
    loadOwner();
  }, [ownerId, slug]);

  useEffect(() => {
    loadSpecies();
  }, []);

  useEffect(() => {
    if (formData.speciesId) {
      loadBreeds(Number(formData.speciesId));
    } else {
      setBreedList([]);
      setFormData((prev) => ({ ...prev, breedId: '' }));
    }
  }, [formData.speciesId]);

  const loadSpecies = async () => {
    try {
      const response = await speciesService.getAllSpecies();
      if (response.success && response.data) setSpeciesList(response.data);
    } catch {
      setSpeciesList([]);
    }
  };

  const loadBreeds = async (speciesId: number) => {
    try {
      const response = await breedService.getBreedsBySpeciesId(speciesId);
      if (response.success && response.data) setBreedList(response.data);
      else setBreedList([]);
    } catch {
      setBreedList([]);
    }
  };

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: string) => (e: SelectChangeEvent) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId || !formData.name || !formData.speciesId || !formData.breedId) {
      addError('Ad, tür ve ırk zorunludur', 'error');
      return;
    }
    startLoading('Hayvan ekleniyor...');
    try {
      const response = await animalService.createAnimal({
        ownerId,
        name: formData.name.trim(),
        speciesId: Number(formData.speciesId),
        breedId: Number(formData.breedId),
        gender: formData.gender || undefined,
        birthDate: formData.birthDate || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        color: formData.color || undefined,
        microchipNo: formData.microchipNo || undefined,
        allergies: formData.allergies || undefined,
        chronicDiseases: formData.chronicDiseases || undefined,
        notes: formData.notes || undefined,
      });
      if (response.success) {
        showSuccess('Hayvan başarıyla eklendi');
        if (slug) navigate(`/clinic/${slug}/owners/${ownerId}`);
        else navigate('/animals');
      } else {
        addError(response.error || 'Hayvan eklenemedi', 'error');
      }
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Hayvan eklenemedi', 'error');
    } finally {
      stopLoading();
    }
  };

  const goBack = () => {
    if (slug && ownerId) navigate(`/clinic/${slug}/owners/${ownerId}`);
    else navigate(-1);
  };

  if (ownerIdParam === null || ownerIdParam === '' || (ownerIdParam !== null && isNaN(Number(ownerIdParam)))) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Sahip bilgisi bulunamadı. Lütfen müşteri sayfasından &quot;Yeni Pet Ekle&quot; ile girin.</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Geri
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
      <Button startIcon={<ArrowBack />} onClick={goBack} sx={{ mb: 2 }}>
        Geri
      </Button>
      <Typography variant="h5" gutterBottom>
        Yeni Evcil Hayvan Ekle
      </Typography>
      {!loadingOwner && ownerName && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sahip: {ownerName}
        </Typography>
      )}

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Hayvan Adı *"
            value={formData.name}
            onChange={handleTextChange('name')}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Tür *</InputLabel>
            <Select
              value={formData.speciesId}
              label="Tür *"
              onChange={handleSelectChange('speciesId')}
              disabled={speciesList.length === 0}
            >
              <MenuItem value="">Seçiniz</MenuItem>
              {speciesList.map((s) => (
                <MenuItem key={s.speciesId} value={String(s.speciesId)}>{s.name}</MenuItem>
              ))}
            </Select>
            {speciesList.length === 0 && <FormHelperText>Türler yükleniyor veya yok</FormHelperText>}
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Irk *</InputLabel>
            <Select
              value={formData.breedId}
              label="Irk *"
              onChange={handleSelectChange('breedId')}
              disabled={!formData.speciesId || breedList.length === 0}
            >
              <MenuItem value="">Seçiniz</MenuItem>
              {breedList.map((b) => (
                <MenuItem key={b.breedId} value={String(b.breedId)}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Cinsiyet</InputLabel>
            <Select value={formData.gender || ''} label="Cinsiyet" onChange={handleSelectChange('gender')}>
              <MenuItem value="">Seçiniz</MenuItem>
              <MenuItem value="MALE">Erkek</MenuItem>
              <MenuItem value="FEMALE">Dişi</MenuItem>
              <MenuItem value="UNKNOWN">Bilinmiyor</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Doğum Tarihi"
              type="date"
              value={formData.birthDate}
              onChange={handleTextChange('birthDate')}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1, minWidth: 160 }}
            />
            <TextField
              label="Ağırlık (kg)"
              type="number"
              value={formData.weight}
              onChange={handleTextChange('weight')}
              inputProps={{ step: 0.01, min: 0 }}
              sx={{ flex: 1, minWidth: 160 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField label="Renk" value={formData.color} onChange={handleTextChange('color')} sx={{ flex: 1, minWidth: 160 }} />
            <TextField label="Çip No" value={formData.microchipNo} onChange={handleTextChange('microchipNo')} sx={{ flex: 1, minWidth: 160 }} />
          </Box>
          <TextField label="Alerjiler" value={formData.allergies} onChange={handleTextChange('allergies')} fullWidth multiline rows={2} />
          <TextField label="Kronik Hastalıklar" value={formData.chronicDiseases} onChange={handleTextChange('chronicDiseases')} fullWidth multiline rows={2} />
          <TextField label="Notlar" value={formData.notes} onChange={handleTextChange('notes')} fullWidth multiline rows={2} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button type="button" onClick={goBack}>
              İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.name || !formData.speciesId || !formData.breedId}
            >
              Kaydet
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default NewAnimalPage;
