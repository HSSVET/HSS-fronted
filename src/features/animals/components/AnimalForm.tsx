import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  FormHelperText,
  Typography,
  Paper
} from '@mui/material';
import { Animal } from '../types/animal';

interface AnimalFormProps {
  animal?: Animal;
  onSubmit: (data: AnimalFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface AnimalFormData {
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthDate: string;
  weight: number;
  color: string;
  microchipNumber: string;
  allergies: string;
  chronicDiseases: string;
  notes: string;
  healthStatus: string;
  lastCheckup: string;
  nextVaccine: string;
  ownerId: string;
}

const AnimalForm: React.FC<AnimalFormProps> = ({
  animal,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<AnimalFormData>({
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      gender: '',
      birthDate: '',
      weight: 0,
      color: '',
      microchipNumber: '',
      allergies: '',
      chronicDiseases: '',
      notes: '',
      healthStatus: '',
      lastCheckup: '',
      nextVaccine: '',
      ownerId: ''
    }
  });

  useEffect(() => {
    if (animal) {
      reset({
        name: animal.name || '',
        species: animal.species || '',
        breed: animal.breed || '',
        gender: animal.gender || '',
        birthDate: '',
        weight: animal.weight || 0,
        color: animal.color || '',
        microchipNumber: animal.microchipId || '',
        allergies: '',
        chronicDiseases: '',
        notes: animal.notes || '',
        healthStatus: animal.health || '',
        lastCheckup: animal.lastCheckup || '',
        nextVaccine: animal.nextVaccine || '',
        ownerId: animal.owner?.id || ''
      });
    }
  }, [animal, reset]);

  const speciesOptions = [
    { value: 'Kedi', label: 'Kedi' },
    { value: 'Köpek', label: 'Köpek' },
    { value: 'Kuş', label: 'Kuş' },
    { value: 'İnek', label: 'İnek' },
    { value: 'Koyun', label: 'Koyun' },
    { value: 'Keçi', label: 'Keçi' }
  ];

  const genderOptions = [
    { value: 'Erkek', label: 'Erkek' },
    { value: 'Dişi', label: 'Dişi' }
  ];

  const healthStatusOptions = [
    { value: 'İyi', label: 'İyi' },
    { value: 'Kontrol Gerekli', label: 'Kontrol Gerekli' },
    { value: 'Tedavi Altında', label: 'Tedavi Altında' }
  ];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        {/* Temel Bilgiler */}
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Temel Bilgiler
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Hayvan adı gereklidir' }}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Hayvan Adı"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="species"
              control={control}
              rules={{ required: 'Tür seçimi gereklidir' }}
              render={({ field }: any) => (
                <FormControl fullWidth error={!!errors.species}>
                  <InputLabel>Tür</InputLabel>
                  <Select {...field} label="Tür">
                    {speciesOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.species && (
                    <FormHelperText>{errors.species.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="breed"
              control={control}
              rules={{ required: 'Irk gereklidir' }}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Irk"
                  fullWidth
                  error={!!errors.breed}
                  helperText={errors.breed?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="gender"
              control={control}
              render={({ field }: any) => (
                <FormControl fullWidth>
                  <InputLabel>Cinsiyet</InputLabel>
                  <Select {...field} label="Cinsiyet">
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Box>

        {/* Fiziksel Özellikler */}
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Fiziksel Özellikler
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Doğum Tarihi"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="weight"
              control={control}
              rules={{ min: { value: 0, message: 'Ağırlık pozitif olmalıdır' } }}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Ağırlık (kg)"
                  type="number"
                  fullWidth
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="color"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Renk"
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="microchipNumber"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Çip Numarası"
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>

        {/* Sağlık Bilgileri */}
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Sağlık Bilgileri
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="healthStatus"
              control={control}
              render={({ field }: any) => (
                <FormControl fullWidth>
                  <InputLabel>Sağlık Durumu</InputLabel>
                  <Select {...field} label="Sağlık Durumu">
                    {healthStatusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="lastCheckup"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Son Kontrol Tarihi"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="nextVaccine"
              control={control}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Sonraki Aşı Tarihi"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Controller
              name="ownerId"
              control={control}
              rules={{ required: 'Sahip seçimi gereklidir' }}
              render={({ field }: any) => (
                <TextField
                  {...field}
                  label="Sahip ID"
                  fullWidth
                  error={!!errors.ownerId}
                  helperText={errors.ownerId?.message}
                />
              )}
            />
          </Box>
        </Box>

        {/* Ek Bilgiler */}
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Ek Bilgiler
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Controller
            name="allergies"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Alerjiler"
                multiline
                rows={2}
                fullWidth
              />
            )}
          />

          <Controller
            name="chronicDiseases"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Kronik Hastalıklar"
                multiline
                rows={2}
                fullWidth
              />
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Notlar"
                multiline
                rows={3}
                fullWidth
              />
            )}
          />
        </Box>

        {/* Butonlar */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            size="large"
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            size="large"
          >
            {loading ? 'Kaydediliyor...' : animal ? 'Güncelle' : 'Kaydet'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AnimalForm;