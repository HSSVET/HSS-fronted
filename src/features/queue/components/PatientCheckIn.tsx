import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Container,
  useTheme,
} from '@mui/material';
import { CheckCircle, PersonAdd } from '@mui/icons-material';
import { queueApi } from '../services/queueApi';
import type { QueueCheckInRequest, AppointmentType, QueuePriority } from '../types/queue.types';
import { useNavigate } from 'react-router-dom';
import { AnimalSearchAutocomplete } from '../../animals';
import type { AnimalRecord } from '../../animals/services/animalService';

const APPOINTMENT_TYPES: { value: AppointmentType; label: string }[] = [
  { value: 'GENERAL_EXAM', label: 'Genel Muayene' },
  { value: 'VACCINATION', label: 'Aşı' },
  { value: 'SURGERY', label: 'Ameliyat' },
  { value: 'FOLLOW_UP', label: 'Kontrol' },
  { value: 'EMERGENCY', label: 'Acil' },
  { value: 'LAB_RESULTS', label: 'Tahlil Sonucu' },
];

const PRIORITIES: { value: QueuePriority; label: string }[] = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'Yüksek' },
  { value: 'URGENT', label: 'Acil' },
  { value: 'EMERGENCY', label: 'Çok Acil' },
];

const PatientCheckIn: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);

  // Form state
  const [checkInType, setCheckInType] = useState<'appointment' | 'walkin'>('walkin');
  const [appointmentId, setAppointmentId] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalRecord | null>(null);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('GENERAL_EXAM');
  const [priority, setPriority] = useState<QueuePriority>('NORMAL');
  const [notes, setNotes] = useState('');

  const steps = checkInType === 'appointment'
    ? ['Randevu Seç', 'Onay']
    : ['Hasta Bilgileri', 'Muayene Detayları', 'Onay'];

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (checkInType === 'appointment') {
        // Check-in with appointment
        const apptId = parseInt(appointmentId);
        if (isNaN(apptId)) {
          throw new Error('Geçersiz randevu numarası');
        }
        response = await queueApi.checkInWithAppointment(apptId);
      } else {
        // Walk-in check-in
        if (!selectedAnimal) {
          throw new Error('Lütfen bir hasta seçin');
        }

        const request: QueueCheckInRequest = {
          animalId: selectedAnimal.id,
          appointmentType,
          priority,
          notes: notes || undefined,
        };
        response = await queueApi.walkInCheckIn(request);
      }

      if (response.success && response.data) {
        setSuccess(true);
        setQueueNumber(response.data.queueNumber);
        // Redirect to queue after 3 seconds
        setTimeout(() => {
          navigate('/queue');
        }, 3000);
      } else {
        setError(response.error || 'Giriş işlemi başarısız');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const canProceed = () => {
    if (checkInType === 'appointment') {
      return activeStep === 0 ? appointmentId !== '' : true;
    } else {
      if (activeStep === 0) return selectedAnimal !== null;
      if (activeStep === 1) return appointmentType.length > 0;
      return true;
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.25, md: 3 },
            borderRadius: 4,
            background:
              'linear-gradient(180deg, rgba(250,253,255,0.90), rgba(240,248,252,0.82))',
            border: '1px solid rgba(90,140,180,0.22)',
            boxShadow: '0 12px 28px rgba(40, 70, 90, 0.14)',
            textAlign: 'center',
          }}
        >
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Giriş Başarılı!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              Sıra numaranız:
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
              #{queueNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Kuyruk sayfasına yönlendiriliyorsunuz...
            </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, md: 2.75 },
          mb: { xs: 2, md: 2.5 },
          borderRadius: 4,
          background:
            'radial-gradient(circle at 15% 25%, rgba(140, 169, 154, 0.30) 0%, rgba(140, 169, 154, 0) 55%), radial-gradient(circle at 85% 25%, rgba(134, 200, 181, 0.22) 0%, rgba(134, 200, 181, 0) 55%), linear-gradient(135deg, rgba(250,253,255,0.92) 0%, rgba(240,248,252,0.86) 100%)',
          border: '1px solid rgba(90,140,180,0.22)',
          boxShadow: '0 12px 30px rgba(40, 70, 90, 0.14)',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, letterSpacing: '-0.6px', color: 'rgba(31, 43, 38, 0.92)' }}
        >
          Hasta Girişi
        </Typography>
        <Typography sx={{ mt: 0.5, color: 'rgba(31, 43, 38, 0.62)' }}>
          Ayakta hasta veya randevulu giriş oluşturun.
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          maxWidth: 920,
          mx: 'auto',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(250,253,255,0.90), rgba(240,248,252,0.82))',
          border: '1px solid rgba(90,140,180,0.22)',
          boxShadow: '0 12px 28px rgba(40, 70, 90, 0.14)',
        }}
      >
        <Card elevation={0} sx={{ background: 'transparent' }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* Check-in Type Selection */}
          {activeStep === 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Giriş Tipi Seçin
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={checkInType === 'walkin' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setCheckInType('walkin');
                    setActiveStep(0);
                    setError(null);
                  }}
                  sx={{
                    flex: 1,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 900,
                    textTransform: 'none',
                    background: checkInType === 'walkin'
                      ? `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : 'transparent',
                    boxShadow: checkInType === 'walkin' ? '0 10px 22px rgba(92, 122, 109, 0.22)' : 'none',
                    borderColor: 'rgba(140,169,154,0.35)',
                    '&:hover': {
                      background: checkInType === 'walkin'
                        ? `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                        : 'rgba(140, 169, 154, 0.10)',
                    },
                  }}
                >
                  Randevusuz (Ayakta Hasta)
                </Button>
                <Button
                  variant={checkInType !== 'walkin' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setCheckInType('appointment');
                    setActiveStep(0);
                    setError(null);
                  }}
                  sx={{
                    flex: 1,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 900,
                    textTransform: 'none',
                    background: checkInType !== 'walkin'
                      ? `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : 'transparent',
                    boxShadow: checkInType !== 'walkin' ? '0 10px 22px rgba(92, 122, 109, 0.22)' : 'none',
                    borderColor: 'rgba(140,169,154,0.35)',
                    '&:hover': {
                      background: checkInType !== 'walkin'
                        ? `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                        : 'rgba(140, 169, 154, 0.10)',
                    },
                  }}
                >
                  Randevulu
                </Button>
              </Box>
            </Box>
          )}

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              '& .MuiStepLabel-label': { fontWeight: 800 },
              '& .MuiStepIcon-root.Mui-active': { color: theme.palette.primary.main },
              '& .MuiStepIcon-root.Mui-completed': { color: theme.palette.primary.dark },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Step Content */}
          <Box sx={{ minHeight: 300 }}>
            {/* Appointment Check-in */}
            {checkInType === 'appointment' && activeStep === 0 && (
              <TextField
                label="Randevu Numarası"
                type="number"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                fullWidth
                required
                helperText="Hasta randevu numarasını girin"
              />
            )}

            {/* Walk-in: Animal Selection */}
            {checkInType === 'walkin' && activeStep === 0 && (
              <AnimalSearchAutocomplete
                value={selectedAnimal}
                onSelect={setSelectedAnimal}
                label="Hasta Seç"
                required
              />
            )}

            {/* Walk-in: Appointment Details */}
            {checkInType === 'walkin' && activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Muayene Tipi"
                  select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                  fullWidth
                  required
                >
                  {APPOINTMENT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Öncelik"
                  select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as QueuePriority)}
                  fullWidth
                  required
                >
                  {PRIORITIES.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Notlar"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  placeholder="Şikayetler veya özel notlar..."
                />
              </Box>
            )}

            {/* Confirmation Step */}
            {activeStep === steps.length - 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Giriş Bilgilerini Onaylayın
                </Typography>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.70)',
                    border: '1px solid rgba(90,140,180,0.18)',
                    p: 3,
                    borderRadius: 3,
                    mt: 2,
                  }}
                >
                  {checkInType === 'appointment' ? (
                    <Typography>Randevu ID: {appointmentId}</Typography>
                  ) : (
                    <>
                      <Typography>
                        <strong>Hasta:</strong> {selectedAnimal?.name}
                      </Typography>
                      <Typography>
                        <strong>Sahip:</strong> {selectedAnimal?.owner?.name || selectedAnimal?.owner?.fullName || 'Bilinmeyen'}
                      </Typography>
                      {selectedAnimal?.species?.name && (
                        <Typography>
                          <strong>Tür:</strong> {selectedAnimal.species.name}
                        </Typography>
                      )}
                      {selectedAnimal?.breed?.name && (
                        <Typography>
                          <strong>Irk:</strong> {selectedAnimal.breed.name}
                        </Typography>
                      )}
                      <Typography>
                        <strong>Muayene Tipi:</strong>{' '}
                        {APPOINTMENT_TYPES.find((t) => t.value === appointmentType)?.label}
                      </Typography>
                      <Typography>
                        <strong>Öncelik:</strong> {PRIORITIES.find((p) => p.value === priority)?.label}
                      </Typography>
                      {notes && (
                        <Typography>
                          <strong>Notlar:</strong> {notes}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={() => {
                if (loading) return;
                if (activeStep === 0 && checkInType === 'appointment') {
                  setCheckInType('walkin');
                  setActiveStep(0);
                  setError(null);
                  return;
                }
                handleBack();
              }}
              disabled={loading || (activeStep === 0 && checkInType === 'walkin')}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800 }}
            >
              Geri
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleCheckIn}
                disabled={loading || !canProceed()}
                startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 900,
                  background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: '0 10px 22px rgba(92, 122, 109, 0.25)',
                  '&:hover': {
                    background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    filter: 'brightness(1.03)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'transform 200ms cubic-bezier(.2,.6,.2,1), filter 200ms cubic-bezier(.2,.6,.2,1)',
                }}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Girişi Tamamla'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed()}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 900,
                  background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: '0 10px 22px rgba(92, 122, 109, 0.25)',
                  '&:hover': {
                    background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    filter: 'brightness(1.03)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'transform 200ms cubic-bezier(.2,.6,.2,1), filter 200ms cubic-bezier(.2,.6,.2,1)',
                }}
              >
                İleri
              </Button>
            )}
          </Box>
        </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default PatientCheckIn;
