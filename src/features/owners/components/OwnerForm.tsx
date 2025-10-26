import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  FormHelperText,
  Typography
} from '@mui/material';

interface OwnerFormProps {
  owner?: OwnerData;
  onSubmit: (data: OwnerFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface OwnerData {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address?: string;
}

interface OwnerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

const OwnerForm: React.FC<OwnerFormProps> = ({
  owner,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OwnerFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: ''
    }
  });

  useEffect(() => {
    if (owner) {
      reset({
        firstName: owner.firstName || '',
        lastName: owner.lastName || '',
        phone: owner.phone || '',
        email: owner.email || '',
        address: owner.address || ''
      });
    }
  }, [owner, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {owner ? 'Sahip Bilgilerini Düzenle' : 'Yeni Sahip Ekle'}
          </Typography>
        </Box>

        {/* Kişisel Bilgiler */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Kişisel Bilgiler
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
          <Controller
            name="firstName"
            control={control}
            rules={{ 
              required: 'Ad gereklidir',
              minLength: { value: 2, message: 'Ad en az 2 karakter olmalıdır' }
            }}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Ad"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            rules={{ 
              required: 'Soyad gereklidir',
              minLength: { value: 2, message: 'Soyad en az 2 karakter olmalıdır' }
            }}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Soyad"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Box>

        {/* İletişim Bilgileri */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            İletişim Bilgileri
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
          <Controller
            name="phone"
            control={control}
            rules={{ 
              required: 'Telefon numarası gereklidir',
              pattern: {
                value: /^[+]?[0-9\s\-()]*$/,
                message: 'Geçerli bir telefon numarası giriniz'
              }
            }}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Telefon"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
                placeholder="+90 555 123 45 67"
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Geçerli bir e-posta adresi giriniz'
              }
            }}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="E-posta"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="ornek@email.com"
              />
            )}
          />
        </Box>

        <Box>
          <Controller
            name="address"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Adres"
                multiline
                rows={3}
                fullWidth
                placeholder="Tam adres bilgisi"
              />
            )}
          />
        </Box>

        {/* Butonlar */}
        <Box>
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
              {loading ? 'Kaydediliyor...' : owner ? 'Güncelle' : 'Kaydet'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OwnerForm;