import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  FormHelperText,
  Typography,
  Grid
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

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
  type?: 'INDIVIDUAL' | 'CORPORATE';
  corporateName?: string;
  taxNo?: string;
  taxOffice?: string;
  notes?: string;
  warnings?: string;
}

interface OwnerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  type: 'INDIVIDUAL' | 'CORPORATE';
  corporateName: string;
  taxNo: string;
  taxOffice: string;
  notes: string;
  warnings: string;
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
    reset,
    watch
  } = useForm<OwnerFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      type: 'INDIVIDUAL',
      corporateName: '',
      taxNo: '',
      taxOffice: '',
      notes: '',
      warnings: ''
    }
  });

  useEffect(() => {
    if (owner) {
      reset({
        firstName: owner.firstName || '',
        lastName: owner.lastName || '',
        phone: owner.phone || '',
        email: owner.email || '',
        address: owner.address || '',
        type: owner.type || 'INDIVIDUAL',
        corporateName: owner.corporateName || '',
        taxNo: owner.taxNo || '',
        taxOffice: owner.taxOffice || '',
        notes: owner.notes || '',
        warnings: owner.warnings || '',
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Müşteri Tipi</Typography>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={field.value !== 'CORPORATE' ? 'contained' : 'outlined'}
                  onClick={() => field.onChange('INDIVIDUAL')}
                >
                  Bireysel
                </Button>
                <Button
                  variant={field.value === 'CORPORATE' ? 'contained' : 'outlined'}
                  onClick={() => field.onChange('CORPORATE')}
                >
                  Kurumsal
                </Button>
              </Box>
            )}
          />
        </Box>

        {/* Kurumsal Bilgiler */}
        {watch('type') === 'CORPORATE' && (
          <Box sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon /> Kurumsal Bilgiler
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="corporateName"
                  control={control}
                  rules={{ required: 'Kurumsal Ünvan gereklidir' }}
                  render={({ field }) => (
                    <TextField {...field} label="Kurumsal Ünvan / Şirket Adı" fullWidth error={!!errors.corporateName} helperText={errors.corporateName?.message} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="taxOffice"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Vergi Dairesi" fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="taxNo"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Vergi No" fullWidth />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Kişisel Bilgiler */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {watch('type') === 'CORPORATE' ? 'Yetkili Kişi Bilgileri' : 'Kişisel Bilgiler'}
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
            render={({ field }) => (
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
            render={({ field }) => (
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
            render={({ field }) => (
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
            render={({ field }) => (
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
            render={({ field }) => (
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

        {/* Notlar ve Uyarılar */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Müşteri Notları"
                multiline
                rows={2}
                fullWidth
                placeholder="Genel notlar..."
              />
            )}
          />
          <Controller
            name="warnings"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Özel Uyarılar"
                multiline
                rows={2}
                fullWidth
                placeholder="Örn: Agresif olabilir, ödeme sorunu vb."
                sx={{ '& .MuiOutlinedInput-root': { color: 'error.main' }, '& .MuiInputLabel-root': { color: 'error.main' } }}
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