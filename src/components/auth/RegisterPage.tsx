import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Stepper, Step, StepLabel, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase'; // Adjust path if necessary

const steps = ['Hesap Bilgileri', 'Klinik Bilgileri'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    clinicName: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!formData.email || !formData.password || !formData.fullName) {
        setError('Lütfen tüm alanları doldurunuz.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Şifreler eşleşmiyor.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır.');
        return;
      }
      setError(null);
      setActiveStep((prev) => prev + 1);
    } else {
      // Final Submit
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.clinicName) {
      setError('Lütfen klinik adını giriniz.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Simulate Backend Clinic Creation (Mock for now)
      // In a real app, we would call an API here:
      // await api.post('/api/clinics/register', { userId: user.uid, ...formData });

      console.log('User created:', user.uid);
      console.log('Clinic Registration Data:', {
        uid: user.uid,
        fullName: formData.fullName,
        clinicName: formData.clinicName,
        phone: formData.phone
      });

      // Retrieve token to ensure we are logged in (Firebase does this automatically)

      // 3. Redirect
      // For now, redirect to login page with a success message or directly to dashboard if backend supports it immediately
      // Since backend sync might take a moment or require manual triggering if not fully automated via hooks:

      navigate('/login', { state: { message: 'Hesabınız oluşturuldu! Lütfen giriş yapın.' } });

    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda.');
      } else {
        setError('Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 5
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative'
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              HSS'e Katılın
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Veteriner kliniğinizi modernleştirmek için ilk adımı atın.
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form">
            {activeStep === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Ad Soyad"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="E-posta Adresi"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Şifre"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  helperText="En az 6 karakter"
                />
                <TextField
                  label="Şifre Tekrar"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Klinik Adı"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  fullWidth
                  required
                  helperText="Bu isimle kliniğiniz sistemde oluşturulacaktır."
                />
                <TextField
                  label="Telefon Numarası"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
              >
                Geri
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                size="large"
                sx={{ borderRadius: 2, px: 4 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : activeStep === steps.length - 1 ? 'Kaydı Tamamla' : 'Devam Et'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Zaten hesabınız var mı?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Giriş Yap
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
