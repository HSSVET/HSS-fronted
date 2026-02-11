import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Autocomplete,
  Stack,
  FormHelperText,
} from '@mui/material';
import { speciesService, type Species } from '../../../services/speciesService';
import { breedService, type Breed } from '../../../services/breedService';
import { ownerService, type Owner } from '../../../services/ownerService';
import { useNotifications } from '../../../hooks/useNotifications';
import { useLoading } from '../../../hooks/useLoading';
import { AnimalRecord } from '../services/animalService';

interface EditAnimalDialogProps {
  open: boolean;
  onClose: () => void;
  animal: AnimalRecord | null;
  onUpdate: (animalId: number, data: {
    ownerId: number;
    name: string;
    speciesId: number;
    breedId: number;
    gender?: string;
    birthDate?: string;
    weight?: number;
    color?: string;
    microchipNo?: string;
    allergies?: string;
    chronicDiseases?: string;
    notes?: string;
  }) => Promise<void>;
}

const EditAnimalDialog: React.FC<EditAnimalDialogProps> = ({ open, onClose, animal, onUpdate }) => {
  const { addError, showSuccess } = useNotifications();
  const { startLoading, stopLoading } = useLoading();

  const [formData, setFormData] = useState({
    ownerId: '',
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
  const [ownerList, setOwnerList] = useState<Owner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      loadSpecies();
      loadOwners();
    }
  }, [open]);

  // Load animal data
  useEffect(() => {
    if (animal && open) {
      setFormData({
        ownerId: animal.owner?.id?.toString() || '',
        name: animal.name || '',
        speciesId: animal.species?.id?.toString() || '',
        breedId: animal.breed?.id?.toString() || '',
        gender: animal.gender || '',
        birthDate: animal.birthDate || '',
        weight: animal.weight?.toString() || '',
        color: animal.color || '',
        microchipNo: animal.microchipNumber || '',
        allergies: animal.allergies || (animal.hasAllergies ? 'Var' : ''),
        chronicDiseases: animal.chronicDiseases || (animal.hasChronicDiseases ? 'Var' : ''),
        notes: animal.notes || '',
      });
      
      // Owner object'ini OwnerService formatına çevir
      if (animal.owner) {
        const ownerData: Owner = {
          ownerId: animal.owner.id,
          firstName: animal.owner.fullName?.split(' ')[0] || animal.owner.name || '',
          lastName: animal.owner.fullName?.split(' ').slice(1).join(' ') || '',
          phone: animal.owner.phone,
          email: animal.owner.email,
        };
        setSelectedOwner(ownerData);
      } else {
        setSelectedOwner(null);
      }
    }
  }, [animal, open]);

  // Load breeds when species is selected
  useEffect(() => {
    if (formData.speciesId) {
      loadBreeds(Number(formData.speciesId));
    } else {
      setBreedList([]);
    }
  }, [formData.speciesId]);

  const loadSpecies = async () => {
    try {
      startLoading('Türler yükleniyor...');
      const response = await speciesService.getAllSpecies();
      if (response.success && response.data) {
        setSpeciesList(response.data);
      } else {
        if (response.status !== 401) {
          addError('Türler yüklenirken hata oluştu', 'error', response.error || 'Bilinmeyen hata');
        }
      }
    } catch (err: any) {
      if (err?.status !== 401) {
        addError('Türler yüklenirken hata oluştu', 'error', err instanceof Error ? err.message : 'Bilinmeyen hata');
      }
    } finally {
      stopLoading();
    }
  };

  const loadBreeds = async (speciesId: number) => {
    try {
      startLoading('Irklar yükleniyor...');
      const response = await breedService.getBreedsBySpeciesId(speciesId);
      if (response.success && response.data) {
        setBreedList(response.data);
      } else {
        addError('Irklar yüklenirken hata oluştu', 'error', response.error || 'Bilinmeyen hata');
        setBreedList([]);
      }
    } catch (err) {
      addError('Irklar yüklenirken hata oluştu', 'error', err instanceof Error ? err.message : 'Bilinmeyen hata');
      setBreedList([]);
    } finally {
      stopLoading();
    }
  };

  const loadOwners = async () => {
    try {
      startLoading('Sahipler yükleniyor...');
      const response = await ownerService.getAllOwners(0, 100);
      if (response.success && response.data) {
        setOwnerList(response.data.items);
      } else {
        if (response.status !== 401) {
          addError('Sahipler yüklenirken hata oluştu', 'error', response.error || 'Bilinmeyen hata');
        }
      }
    } catch (err: any) {
      if (err?.status !== 401) {
        addError('Sahipler yüklenirken hata oluştu', 'error', err instanceof Error ? err.message : 'Bilinmeyen hata');
      }
    } finally {
      stopLoading();
    }
  };

  const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleOwnerChange = (_event: any, newValue: Owner | null) => {
    setSelectedOwner(newValue);
    if (newValue) {
      setFormData(prev => ({ ...prev, ownerId: newValue.ownerId.toString() }));
    } else {
      setFormData(prev => ({ ...prev, ownerId: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!animal?.id || !formData.ownerId || !formData.name || !formData.speciesId || !formData.breedId) {
      addError('Lütfen zorunlu alanları doldurun', 'error');
      return;
    }

    const updateData = {
      ownerId: Number(formData.ownerId),
      name: formData.name,
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
    };

    try {
      await onUpdate(animal.id, updateData);
      onClose();
    } catch (error) {
      console.error('Hayvan güncellenirken hata:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Hayvan Bilgilerini Düzenle</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {/* Owner Selection */}
            <Autocomplete
              fullWidth
              options={ownerList}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}${option.phone ? ` - ${option.phone}` : ''}`}
              value={selectedOwner}
              onChange={handleOwnerChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sahip *"
                  required
                />
              )}
              noOptionsText="Sahip bulunamadı"
            />

            {/* Animal Name and Species */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Hayvan Adı *"
                value={formData.name}
                onChange={handleTextChange('name')}
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
                required
              />
              <FormControl sx={{ flex: '1 1 200px', minWidth: '200px' }} required>
                <InputLabel>Tür *</InputLabel>
                <Select
                  value={formData.speciesId}
                  label="Tür *"
                  onChange={handleSelectChange('speciesId')}
                  disabled={speciesList.length === 0}
                >
                  {speciesList.map((species) => (
                    <MenuItem key={species.speciesId} value={species.speciesId.toString()}>
                      {species.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Breed and Gender */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ flex: '1 1 200px', minWidth: '200px' }} required>
                <InputLabel>Irk *</InputLabel>
                <Select
                  value={formData.breedId}
                  label="Irk *"
                  onChange={handleSelectChange('breedId')}
                  disabled={!formData.speciesId || breedList.length === 0}
                >
                  {breedList.map((breed) => (
                    <MenuItem key={breed.breedId} value={breed.breedId.toString()}>
                      {breed.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <InputLabel>Cinsiyet</InputLabel>
                <Select
                  value={formData.gender || ''}
                  label="Cinsiyet"
                  onChange={handleSelectChange('gender')}
                >
                  <MenuItem value="">Seçiniz</MenuItem>
                  <MenuItem value="MALE">Erkek</MenuItem>
                  <MenuItem value="FEMALE">Dişi</MenuItem>
                  <MenuItem value="UNKNOWN">Bilinmiyor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Birth Date and Weight */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Doğum Tarihi"
                type="date"
                value={formData.birthDate}
                onChange={handleTextChange('birthDate')}
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Ağırlık (kg)"
                type="number"
                value={formData.weight}
                onChange={handleTextChange('weight')}
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Box>

            {/* Color and Microchip */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Renk"
                value={formData.color}
                onChange={handleTextChange('color')}
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
              />
              <TextField
                label="Çip Numarası"
                value={formData.microchipNo}
                onChange={handleTextChange('microchipNo')}
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
              />
            </Box>

            {/* Allergies */}
            <TextField
              label="Alerjiler"
              value={formData.allergies}
              onChange={handleTextChange('allergies')}
              fullWidth
              multiline
              rows={2}
            />

            {/* Chronic Diseases */}
            <TextField
              label="Kronik Hastalıklar"
              value={formData.chronicDiseases}
              onChange={handleTextChange('chronicDiseases')}
              fullWidth
              multiline
              rows={2}
            />

            {/* Notes */}
            <TextField
              label="Notlar"
              value={formData.notes}
              onChange={handleTextChange('notes')}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.ownerId || !formData.name || !formData.speciesId || !formData.breedId}
        >
          Güncelle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAnimalDialog;
