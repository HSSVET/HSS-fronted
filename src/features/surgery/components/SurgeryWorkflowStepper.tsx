import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Alert,
  AlertTitle,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Divider,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Schedule,
  LocalHospital,
  Assignment,
  MedicalServices,
  EventNote,
  Vaccines,
} from '@mui/icons-material';
import ConsentFormSigner, { SignatureData } from './ConsentFormSigner';
import { surgeryService } from '../services/surgeryService';
import { apiClient } from '../../../services/api';

interface SurgeryWorkflowStepperProps {
  surgeryId: number | string;
  patientName: string;
  ownerName: string;
  ownerPhone?: string;
  surgeryDate: string;
  veterinarianName?: string;
  onComplete?: () => void;
  onStatusChange?: (newStatus: string) => void;
}

interface PreOpChecklist {
  fastingConfirmed: boolean;
  preOpExamCompleted: boolean;
  bloodTestCompleted: boolean;
  xrayCompleted: boolean;
  anesthesiaConsentSigned: boolean;
  surgeryConsentSigned: boolean;
  ownerContactVerified: boolean;
  patientIdVerified: boolean;
}

interface SurgeryWorkflowData {
  status: string;
  preOpSmsSent: boolean;
  preOpExamCompleted: boolean;
  preOpTestsCompleted: boolean;
  anesthesiaConsentSigned: boolean;
  surgeryConsentSigned: boolean;
  fastingHours: number;
  requiredTests: string[];
  dischargeType?: 'SAME_DAY' | 'HOSPITALIZATION';
}

const SurgeryWorkflowStepper: React.FC<SurgeryWorkflowStepperProps> = ({
  surgeryId,
  patientName,
  ownerName,
  ownerPhone,
  surgeryDate,
  veterinarianName,
  onComplete,
  onStatusChange,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [workflowData, setWorkflowData] = useState<SurgeryWorkflowData>({
    status: 'PLANNED',
    preOpSmsSent: false,
    preOpExamCompleted: false,
    preOpTestsCompleted: false,
    anesthesiaConsentSigned: false,
    surgeryConsentSigned: false,
    fastingHours: 12,
    requiredTests: ['BLOOD_TEST'],
  });

  const [checklist, setChecklist] = useState<PreOpChecklist>({
    fastingConfirmed: false,
    preOpExamCompleted: false,
    bloodTestCompleted: false,
    xrayCompleted: false,
    anesthesiaConsentSigned: false,
    surgeryConsentSigned: false,
    ownerContactVerified: false,
    patientIdVerified: false,
  });

  const [showAnesthesiaForm, setShowAnesthesiaForm] = useState(false);
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);
  const [anesthesiaSignature, setAnesthesiaSignature] = useState<SignatureData | null>(null);
  const [surgerySignature, setSurgerySignature] = useState<SignatureData | null>(null);
  const [dischargeType, setDischargeType] = useState<'SAME_DAY' | 'HOSPITALIZATION'>('SAME_DAY');
  const [postOpNotes, setPostOpNotes] = useState('');

  useEffect(() => {
    loadSurgeryData();
  }, [surgeryId]);

  const loadSurgeryData = async () => {
    setLoading(true);
    try {
      const response = await surgeryService.getSurgery(surgeryId);
      if (response.data) {
        const surgery = response.data as any;
        setWorkflowData({
          status: surgery.status || 'PLANNED',
          preOpSmsSent: surgery.preOpSmsSent || false,
          preOpExamCompleted: surgery.preOpExamCompleted || false,
          preOpTestsCompleted: surgery.preOpTestsCompleted || false,
          anesthesiaConsentSigned: surgery.anesthesiaConsentSigned || false,
          surgeryConsentSigned: surgery.surgeryConsentSigned || false,
          fastingHours: surgery.fastingHours || 12,
          requiredTests: surgery.requiredTests ? JSON.parse(surgery.requiredTests) : ['BLOOD_TEST'],
          dischargeType: surgery.dischargeType,
        });

        // Set active step based on status
        if (surgery.status === 'COMPLETED') {
          setActiveStep(4);
        } else if (surgery.status === 'IN_PROGRESS') {
          setActiveStep(3);
        } else if (surgery.anesthesiaConsentSigned && surgery.surgeryConsentSigned) {
          setActiveStep(2);
        } else if (surgery.preOpExamCompleted) {
          setActiveStep(1);
        }
      }
    } catch (err) {
      console.error('Failed to load surgery data:', err);
      setError('Operasyon bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistChange = (field: keyof PreOpChecklist) => {
    setChecklist((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveChecklist = async () => {
    setSaving(true);
    try {
      await apiClient.patch(`/api/surgeries/${surgeryId}/pre-op-checklist`, {
        preOpExamCompleted: checklist.preOpExamCompleted,
        preOpTestsCompleted: checklist.bloodTestCompleted || checklist.xrayCompleted,
        fastingConfirmed: checklist.fastingConfirmed,
      });
      setWorkflowData((prev) => ({
        ...prev,
        preOpExamCompleted: checklist.preOpExamCompleted,
        preOpTestsCompleted: checklist.bloodTestCompleted || checklist.xrayCompleted,
      }));
      setActiveStep(1);
    } catch (err) {
      setError('Checklist kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleAnesthesiaSign = async (signature: SignatureData) => {
    setSaving(true);
    try {
      await apiClient.post(`/api/surgeries/${surgeryId}/consent`, {
        formType: 'ANESTHESIA',
        signatureData: signature.signature,
        signerName: signature.signerName,
        signerRelation: signature.signerRelation,
        witnessName: signature.witnessName,
      });
      setAnesthesiaSignature(signature);
      setWorkflowData((prev) => ({ ...prev, anesthesiaConsentSigned: true }));
      setShowAnesthesiaForm(false);
    } catch (err) {
      setError('Anestezi onay formu kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleSurgerySign = async (signature: SignatureData) => {
    setSaving(true);
    try {
      await apiClient.post(`/api/surgeries/${surgeryId}/consent`, {
        formType: 'SURGERY',
        signatureData: signature.signature,
        signerName: signature.signerName,
        signerRelation: signature.signerRelation,
        witnessName: signature.witnessName,
      });
      setSurgerySignature(signature);
      setWorkflowData((prev) => ({ ...prev, surgeryConsentSigned: true }));
      setShowSurgeryForm(false);
      setActiveStep(2);
    } catch (err) {
      setError('Operasyon onay formu kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleStartSurgery = async () => {
    setSaving(true);
    try {
      await surgeryService.updateStatus(surgeryId, 'IN_PROGRESS');
      setWorkflowData((prev) => ({ ...prev, status: 'IN_PROGRESS' }));
      onStatusChange?.('IN_PROGRESS');
      setActiveStep(3);
    } catch (err) {
      setError('Operasyon başlatılamadı.');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteSurgery = async () => {
    setSaving(true);
    try {
      await apiClient.patch(`/api/surgeries/${surgeryId}/complete`, {
        dischargeType,
        postOpNotes,
      });
      setWorkflowData((prev) => ({ ...prev, status: 'COMPLETED', dischargeType }));
      onStatusChange?.('COMPLETED');
      setActiveStep(4);
      onComplete?.();
    } catch (err) {
      setError('Operasyon tamamlanamadı.');
    } finally {
      setSaving(false);
    }
  };

  const isPreOpChecklistComplete = () => {
    return (
      checklist.fastingConfirmed &&
      checklist.preOpExamCompleted &&
      (checklist.bloodTestCompleted || checklist.xrayCompleted) &&
      checklist.ownerContactVerified &&
      checklist.patientIdVerified
    );
  };

  const isConsentComplete = () => {
    return workflowData.anesthesiaConsentSigned && workflowData.surgeryConsentSigned;
  };

  const steps = [
    { 
      label: 'Pre-Operatif Kontroller', 
      icon: <Assignment />,
      description: 'Operasyon öncesi kontrol listesi'
    },
    { 
      label: 'Onay Formları', 
      icon: <MedicalServices />,
      description: 'Anestezi ve operasyon onayları'
    },
    { 
      label: 'Operasyon Hazırlık', 
      icon: <LocalHospital />,
      description: 'Son kontroller ve başlama'
    },
    { 
      label: 'Operasyon', 
      icon: <Vaccines />,
      description: 'Operasyon süreci'
    },
    { 
      label: 'Taburcu/Yatış', 
      icon: <EventNote />,
      description: 'Taburcu veya yatış işlemleri'
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospital color="primary" />
          Operasyon İş Akışı
        </Typography>
        <Chip
          label={workflowData.status}
          color={
            workflowData.status === 'COMPLETED' ? 'success' :
            workflowData.status === 'IN_PROGRESS' ? 'warning' :
            workflowData.status === 'CANCELLED' ? 'error' : 'default'
          }
        />
      </Box>

      {/* Patient Info Card */}
      <Card variant="outlined" sx={{ mb: 3, bgcolor: 'grey.50' }}>
        <CardContent sx={{ py: 2 }}>
          <Stack direction="row" spacing={4} flexWrap="wrap">
            <Typography variant="body2">
              <strong>Hasta:</strong> {patientName}
            </Typography>
            <Typography variant="body2">
              <strong>Sahip:</strong> {ownerName}
            </Typography>
            <Typography variant="body2">
              <strong>Tarih:</strong> {new Date(surgeryDate).toLocaleString('tr-TR')}
            </Typography>
            {veterinarianName && (
              <Typography variant="body2">
                <strong>Veteriner:</strong> {veterinarianName}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} orientation="vertical">
        {/* Step 0: Pre-Op Checklist */}
        <Step>
          <StepLabel icon={steps[0].icon}>
            {steps[0].label}
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              {steps[0].description}
            </Typography>
          </StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Pre-Operatif SMS</AlertTitle>
                {workflowData.preOpSmsSent ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" fontSize="small" />
                    Açlık talimatı SMS'i gönderildi
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="warning" fontSize="small" />
                    SMS operasyondan 1 gün önce otomatik gönderilecek (Açlık: {workflowData.fastingHours} saat)
                  </Box>
                )}
              </Alert>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.patientIdVerified}
                      onChange={() => handleChecklistChange('patientIdVerified')}
                    />
                  }
                  label="Hasta kimliği doğrulandı (çip/kulak numarası)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.ownerContactVerified}
                      onChange={() => handleChecklistChange('ownerContactVerified')}
                    />
                  }
                  label="Hasta sahibi iletişim bilgileri doğrulandı"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.fastingConfirmed}
                      onChange={() => handleChecklistChange('fastingConfirmed')}
                    />
                  }
                  label={`Açlık durumu onaylandı (${workflowData.fastingHours} saat)`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.preOpExamCompleted}
                      onChange={() => handleChecklistChange('preOpExamCompleted')}
                    />
                  }
                  label="Pre-operatif muayene tamamlandı"
                />
                
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Gerekli Testler:</Typography>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.bloodTestCompleted}
                      onChange={() => handleChecklistChange('bloodTestCompleted')}
                    />
                  }
                  label="Kan testi sonuçları değerlendirildi"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checklist.xrayCompleted}
                      onChange={() => handleChecklistChange('xrayCompleted')}
                    />
                  }
                  label="Röntgen/görüntüleme sonuçları değerlendirildi (gerekirse)"
                />
              </FormGroup>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSaveChecklist}
                disabled={!isPreOpChecklistComplete() || saving}
              >
                {saving ? <CircularProgress size={20} /> : 'Kaydet ve Devam'}
              </Button>
            </Box>
          </StepContent>
        </Step>

        {/* Step 1: Consent Forms */}
        <Step>
          <StepLabel icon={steps[1].icon}>
            {steps[1].label}
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              {steps[1].description}
            </Typography>
          </StepLabel>
          <StepContent>
            <Stack spacing={2}>
              {/* Anesthesia Consent */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {workflowData.anesthesiaConsentSigned ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Warning color="warning" />
                      )}
                      <Typography variant="subtitle1">Anestezi Onay Formu</Typography>
                    </Box>
                    {!workflowData.anesthesiaConsentSigned && (
                      <Button
                        variant="outlined"
                        onClick={() => setShowAnesthesiaForm(true)}
                        disabled={saving}
                      >
                        İmzala
                      </Button>
                    )}
                    {workflowData.anesthesiaConsentSigned && (
                      <Chip label="İmzalandı" color="success" size="small" />
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Surgery Consent */}
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {workflowData.surgeryConsentSigned ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Warning color="warning" />
                      )}
                      <Typography variant="subtitle1">Operasyon Onay Formu</Typography>
                    </Box>
                    {!workflowData.surgeryConsentSigned && (
                      <Button
                        variant="outlined"
                        onClick={() => setShowSurgeryForm(true)}
                        disabled={saving || !workflowData.anesthesiaConsentSigned}
                      >
                        İmzala
                      </Button>
                    )}
                    {workflowData.surgeryConsentSigned && (
                      <Chip label="İmzalandı" color="success" size="small" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setActiveStep(2)}
                disabled={!isConsentComplete()}
              >
                Devam
              </Button>
            </Box>
          </StepContent>
        </Step>

        {/* Step 2: Surgery Preparation */}
        <Step>
          <StepLabel icon={steps[2].icon}>
            {steps[2].label}
          </StepLabel>
          <StepContent>
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Operasyona Hazır</AlertTitle>
              Tüm kontroller ve onaylar tamamlandı. Operasyon başlatılabilir.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartSurgery}
              disabled={saving || workflowData.status === 'IN_PROGRESS'}
              startIcon={saving ? <CircularProgress size={20} /> : <LocalHospital />}
            >
              Operasyonu Başlat
            </Button>
          </StepContent>
        </Step>

        {/* Step 3: Surgery In Progress */}
        <Step>
          <StepLabel icon={steps[3].icon}>
            {steps[3].label}
          </StepLabel>
          <StepContent>
            {workflowData.status === 'IN_PROGRESS' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Operasyon Devam Ediyor</AlertTitle>
                Operasyon tamamlandığında sonraki adıma geçiniz.
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                select
                label="Taburcu Tipi"
                value={dischargeType}
                onChange={(e) => setDischargeType(e.target.value as 'SAME_DAY' | 'HOSPITALIZATION')}
                fullWidth
              >
                <MenuItem value="SAME_DAY">Günübirlik Taburcu</MenuItem>
                <MenuItem value="HOSPITALIZATION">Hastanede Yatış</MenuItem>
              </TextField>
              <TextField
                label="Post-Operatif Notlar"
                multiline
                rows={3}
                value={postOpNotes}
                onChange={(e) => setPostOpNotes(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleCompleteSurgery}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                Operasyonu Tamamla
              </Button>
            </Stack>
          </StepContent>
        </Step>

        {/* Step 4: Discharge */}
        <Step>
          <StepLabel icon={steps[4].icon}>
            {steps[4].label}
          </StepLabel>
          <StepContent>
            <Alert severity="success">
              <AlertTitle>Operasyon Tamamlandı</AlertTitle>
              {workflowData.dischargeType === 'HOSPITALIZATION' ? (
                'Hasta yatışa alındı. Takip işlemleri için hospitalizasyon modülüne gidiniz.'
              ) : (
                'Hasta taburcu edildi. Reçete ve kontrol randevusu oluşturulabilir.'
              )}
            </Alert>
          </StepContent>
        </Step>
      </Stepper>

      {/* Consent Form Dialogs */}
      {showAnesthesiaForm && (
        <ConsentFormSigner
          formType="ANESTHESIA"
          formTitle="Anestezi Onay Formu"
          formContent=""
          patientName={patientName}
          ownerName={ownerName}
          surgeryDate={surgeryDate}
          veterinarianName={veterinarianName}
          onSign={handleAnesthesiaSign}
          onCancel={() => setShowAnesthesiaForm(false)}
          existingSignature={anesthesiaSignature}
        />
      )}

      {showSurgeryForm && (
        <ConsentFormSigner
          formType="SURGERY"
          formTitle="Operasyon Onay Formu"
          formContent=""
          patientName={patientName}
          ownerName={ownerName}
          surgeryDate={surgeryDate}
          veterinarianName={veterinarianName}
          onSign={handleSurgerySign}
          onCancel={() => setShowSurgeryForm(false)}
          existingSignature={surgerySignature}
        />
      )}
    </Paper>
  );
};

export default SurgeryWorkflowStepper;
