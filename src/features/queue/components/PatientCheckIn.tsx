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
          navigate('/clinic/' + window.location.pathname.split('/')[2] + '/queue');
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
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
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
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Hasta Girişi
      </Typography>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Check-in Type Selection */}
          {activeStep === 0 && checkInType === 'walkin' && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Giriş Tipi Seçin
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={checkInType === 'walkin' ? 'contained' : 'outlined'}
                  onClick={() => setCheckInType('walkin')}
                  sx={{ flex: 1, py: 2 }}
                >
                  Randevusuz (Walk-in)
                </Button>
                <Button
                  variant={checkInType !== 'walkin' ? 'contained' : 'outlined'}
                  onClick={() => setCheckInType('appointment')}
                  sx={{ flex: 1, py: 2 }}
                >
                  Randevulu
                </Button>
              </Box>
            </Box>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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
                <Box sx={{ bgcolor: '#F5F5F5', p: 3, borderRadius: 2, mt: 2 }}>
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
            <Button onClick={handleBack} disabled={activeStep === 0 || loading}>
              Geri
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleCheckIn}
                disabled={loading || !canProceed()}
                startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Girişi Tamamla'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} disabled={!canProceed()}>
                İleri
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientCheckIn;
