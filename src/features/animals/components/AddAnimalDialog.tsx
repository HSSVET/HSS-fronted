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
  IconButton,
  Tooltip,
  Stack,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { speciesService, type Species } from '../../../services/speciesService';
import { breedService, type Breed } from '../../../services/breedService';
import { ownerService, type Owner, type OwnerCreateRequest } from '../../../services/ownerService';
import { useError } from '../../../context/ErrorContext';
import { useLoading } from '../../../hooks/useLoading';
import '../styles/AddAnimalDialog.css';

interface AddAnimalDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (animal: {
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

const AddAnimalDialog: React.FC<AddAnimalDialogProps> = ({ open, onClose, onAdd }) => {
  const { addError, showSuccess } = useError();
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
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [newOwnerData, setNewOwnerData] = useState<OwnerCreateRequest>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
  });

  // Load species on mount
  useEffect(() => {
    if (open) {
      loadSpecies();
      loadOwners();
    }
  }, [open]);

  // Load breeds when species is selected
  useEffect(() => {
    if (formData.speciesId) {
      loadBreeds(Number(formData.speciesId));
    } else {
      setBreedList([]);
      setFormData(prev => ({ ...prev, breedId: '' }));
    }
  }, [formData.speciesId]);

  const loadSpecies = async () => {
    try {
      startLoading('Türler yükleniyor...');
      const response = await speciesService.getAllSpecies();
      if (response.success && response.data) {
        setSpeciesList(response.data);
      } else {
        // 401 hatası durumunda sessizce geç
        if (response.status === 401) {
          console.warn('Türler yüklenemedi: Yetkilendirme hatası. Lütfen giriş yapın.');
          // Species listesi boş kalacak, kullanıcı yine de formu doldurabilir
        } else {
          addError('Türler yüklenirken hata oluştu', 'error', response.error || 'Bilinmeyen hata');
        }
      }
    } catch (err: any) {
      // 401 hatası için özel işlem - sayfa yönlendirmesi yapma
      if (err?.status === 401) {
        console.warn('Türler yüklenemedi: Yetkilendirme hatası. Lütfen giriş yapın.');
        // Species listesi boş kalacak
      } else {
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
        // 401 hatası durumunda sessizce geç, kullanıcıya sadece owner seçemeyeceğini bildir
        if (response.status === 401) {
          console.warn('Sahipler yüklenemedi: Yetkilendirme hatası. Lütfen giriş yapın.');
          // Owner listesi boş kalacak, kullanıcı yeni owner ekleyebilir
        } else {
          addError('Sahipler yüklenirken hata oluştu', 'error', response.error || 'Bilinmeyen hata');
        }
      }
    } catch (err: any) {
      // 401 hatası için özel işlem - sayfa yönlendirmesi yapma
      if (err?.status === 401) {
        console.warn('Sahipler yüklenemedi: Yetkilendirme hatası. Lütfen giriş yapın.');
        // Owner listesi boş kalacak
      } else {
        addError('Sahipler yüklenirken hata oluştu', 'error', err instanceof Error ? err.message : 'Bilinmeyen hata');
      }
    } finally {
      stopLoading();
    }
  };

  const handleCreateOwner = async () => {
    if (!newOwnerData.firstName || !newOwnerData.lastName) {
      addError('Ad ve soyad gereklidir', 'error');
      return;
    }

    try {
      startLoading('Sahip ekleniyor...');
      const response = await ownerService.createOwner(newOwnerData);
      if (response.success && response.data) {
        showSuccess('Sahip başarıyla eklendi');
        setOwnerList(prev => [...prev, response.data!]);
        setSelectedOwner(response.data);
        setFormData(prev => ({ ...prev, ownerId: response.data!.ownerId.toString() }));
        setShowOwnerForm(false);
        setNewOwnerData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          address: '',
        });
      } else {
        addError('Sahip eklenirken hata oluştu', 'error', response.error || 'Bilinmeyen hata');
      }
    } catch (err) {
      addError('Sahip eklenirken hata oluştu', 'error', err instanceof Error ? err.message : 'Bilinmeyen hata');
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
    if (!formData.ownerId || !formData.name || !formData.speciesId || !formData.breedId) {
      addError('Lütfen zorunlu alanları doldurun', 'error');
      return;
    }

    const animalData = {
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
      await onAdd(animalData);
      // Başarılı olduğunda formu sıfırla ve dialog'u kapat
    setFormData({
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
      setSelectedOwner(null);
      onClose();
    } catch (error) {
      // Hata durumunda dialog açık kalacak ve hata mesajı gösterilecek
      console.error('Hayvan eklenirken hata:', error);
    }
  };

  const handleClose = () => {
    setShowOwnerForm(false);
    setNewOwnerData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      className="add-animal-dialog"
    >
      <DialogTitle>Yeni Hayvan Ekle</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {/* Owner Selection */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Autocomplete
                fullWidth
                options={ownerList}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}${option.phone ? ` - ${option.phone}` : ''}`}
                value={selectedOwner}
                onChange={handleOwnerChange}
                disabled={ownerList.length === 0 && !showOwnerForm}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sahip *"
                    required
                    helperText={
                      ownerList.length === 0 && !showOwnerForm 
                        ? 'Sahipler yüklenemedi. Lütfen yeni sahip ekleyiniz (butona tıklayın).'
                        : formData.ownerId 
                        ? '' 
                        : 'Sahip seçiniz veya yeni sahip ekleyiniz'
                    }
                  />
                )}
                noOptionsText={ownerList.length === 0 ? "Sahipler yüklenemedi. Yeni sahip eklemek için + butonuna tıklayın." : "Sahip bulunamadı"}
              />
              <Tooltip title="Yeni Sahip Ekle">
                <IconButton
                  color="primary"
                  onClick={() => setShowOwnerForm(!showOwnerForm)}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* New Owner Form */}
            {showOwnerForm && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Ad *"
                      value={newOwnerData.firstName}
                      onChange={(e) => setNewOwnerData({ ...newOwnerData, firstName: e.target.value })}
                      sx={{ flex: '1 1 200px', minWidth: '200px' }}
                      required
                    />
                    <TextField
                      label="Soyad *"
                      value={newOwnerData.lastName}
                      onChange={(e) => setNewOwnerData({ ...newOwnerData, lastName: e.target.value })}
                      sx={{ flex: '1 1 200px', minWidth: '200px' }}
                      required
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Telefon"
                      value={newOwnerData.phone}
                      onChange={(e) => setNewOwnerData({ ...newOwnerData, phone: e.target.value })}
                      sx={{ flex: '1 1 200px', minWidth: '200px' }}
                    />
                    <TextField
                      label="E-posta"
                      type="email"
                      value={newOwnerData.email}
                      onChange={(e) => setNewOwnerData({ ...newOwnerData, email: e.target.value })}
                      sx={{ flex: '1 1 200px', minWidth: '200px' }}
                    />
                  </Box>
                  <TextField
                    label="Adres"
                    value={newOwnerData.address}
                    onChange={(e) => setNewOwnerData({ ...newOwnerData, address: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleCreateOwner}
                      disabled={!newOwnerData.firstName || !newOwnerData.lastName}
                    >
                      Sahip Ekle
                    </Button>
                    <Button
                      onClick={() => setShowOwnerForm(false)}
                      sx={{ ml: 1 }}
                    >
                      İptal
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Animal Name and Species */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
                label="Hayvan Adı *"
            value={formData.name}
            onChange={handleTextChange('name')}
                sx={{ flex: '1 1 200px', minWidth: '200px' }}
            required
          />
              <FormControl sx={{ flex: '1 1 200px', minWidth: '200px' }} required error={speciesList.length === 0}>
                <InputLabel>Tür *</InputLabel>
                <Select
                  value={formData.speciesId}
                  label="Tür *"
                  onChange={handleSelectChange('speciesId')}
                  disabled={speciesList.length === 0}
                >
                  {speciesList.length === 0 ? (
                    <MenuItem disabled value="">
                      Türler yüklenemedi
                    </MenuItem>
                  ) : (
                    speciesList.map((species) => (
                      <MenuItem key={species.speciesId} value={species.speciesId.toString()}>
                        {species.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {speciesList.length === 0 && (
                  <FormHelperText error>Türler yüklenemedi. Lütfen sayfayı yenileyin veya giriş yapın.</FormHelperText>
                )}
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
        <Button onClick={handleClose}>İptal</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.ownerId || !formData.name || !formData.speciesId || !formData.breedId}
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAnimalDialog; 