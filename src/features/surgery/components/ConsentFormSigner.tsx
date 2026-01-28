import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import {
  Create as SignIcon,
  Clear,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

interface ConsentFormSignerProps {
  formType: 'ANESTHESIA' | 'SURGERY' | 'TREATMENT' | 'GENERAL';
  formTitle: string;
  formContent: string;
  patientName: string;
  ownerName: string;
  surgeryDate?: string;
  veterinarianName?: string;
  onSign: (signatureData: SignatureData) => void;
  onCancel: () => void;
  existingSignature?: SignatureData | null;
}

export interface SignatureData {
  signature: string; // Base64 encoded signature image
  signerName: string;
  signerRelation: string;
  signedAt: string;
  witnessName?: string;
}

const ConsentFormSigner: React.FC<ConsentFormSignerProps> = ({
  formType,
  formTitle,
  formContent,
  patientName,
  ownerName,
  surgeryDate,
  veterinarianName,
  onSign,
  onCancel,
  existingSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signerName, setSignerName] = useState(ownerName);
  const [signerRelation, setSignerRelation] = useState('Hasta Sahibi');
  const [witnessName, setWitnessName] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if ('touches' in e) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }
        
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if ('touches' in e) {
          e.preventDefault();
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }
        
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  };

  const handleSign = () => {
    if (!hasSignature) {
      setError('Lütfen imzanızı atınız.');
      return;
    }

    if (!signerName.trim()) {
      setError('Lütfen imzalayan kişi adını giriniz.');
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const signatureImage = canvas.toDataURL('image/png');
      
      const signatureData: SignatureData = {
        signature: signatureImage,
        signerName: signerName.trim(),
        signerRelation: signerRelation,
        signedAt: new Date().toISOString(),
        witnessName: witnessName.trim() || undefined,
      };

      onSign(signatureData);
    }
  };

  const getFormTypeLabel = () => {
    switch (formType) {
      case 'ANESTHESIA': return 'Anestezi Onay Formu';
      case 'SURGERY': return 'Operasyon Onay Formu';
      case 'TREATMENT': return 'Tedavi Onay Formu';
      default: return 'Onay Formu';
    }
  };

  if (existingSignature) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircle color="success" />
          <Typography variant="h6">{getFormTypeLabel()}</Typography>
          <Chip label="İmzalandı" color="success" size="small" />
        </Box>
        
        <Alert severity="success" sx={{ mb: 2 }}>
          Bu form {existingSignature.signerName} tarafından{' '}
          {new Date(existingSignature.signedAt).toLocaleString('tr-TR')} tarihinde imzalanmıştır.
        </Alert>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src={existingSignature.signature} 
            alt="İmza" 
            style={{ maxWidth: 300, border: '1px solid #ccc', borderRadius: 4 }} 
          />
        </Box>
      </Paper>
    );
  }

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SignIcon />
          {formTitle || getFormTypeLabel()}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form Content */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3, maxHeight: 200, overflow: 'auto', bgcolor: 'grey.50' }}>
          <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
            {formContent || `
${getFormTypeLabel()}

Hasta Adı: ${patientName}
Hasta Sahibi: ${ownerName}
${surgeryDate ? `Operasyon Tarihi: ${new Date(surgeryDate).toLocaleDateString('tr-TR')}` : ''}
${veterinarianName ? `Veteriner Hekim: ${veterinarianName}` : ''}

Ben, aşağıda imzası bulunan kişi, yukarıda belirtilen işlem hakkında bilgilendirildiğimi, işlemin riskleri ve olası komplikasyonları hakkında bilgi aldığımı ve bu işleme onay verdiğimi beyan ederim.

${formType === 'ANESTHESIA' ? `
Anestezi ile ilgili riskler (alerjik reaksiyon, solunum problemleri, kalp ritim bozuklukları vb.) hakkında bilgilendirildim ve bu riskleri kabul ediyorum.
` : ''}

${formType === 'SURGERY' ? `
Operasyon sırasında ve sonrasında oluşabilecek komplikasyonlar (kanama, enfeksiyon, yara iyileşme problemleri vb.) hakkında bilgilendirildim ve bu riskleri kabul ediyorum.
` : ''}
            `.trim()}
          </Typography>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Signer Information */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="İmzalayan Kişi Adı Soyadı"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            fullWidth
            required
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Yakınlık Derecesi"
              value={signerRelation}
              onChange={(e) => setSignerRelation(e.target.value)}
              fullWidth
              placeholder="Hasta Sahibi, Veli, vb."
            />
            <TextField
              label="Tanık Adı (İsteğe Bağlı)"
              value={witnessName}
              onChange={(e) => setWitnessName(e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>

        {/* Signature Canvas */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SignIcon fontSize="small" />
            İmza Alanı
          </Typography>
          <Box
            sx={{
              border: '2px solid',
              borderColor: hasSignature ? 'success.main' : 'grey.400',
              borderRadius: 1,
              display: 'inline-block',
            }}
          >
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ 
                cursor: 'crosshair', 
                touchAction: 'none',
                display: 'block',
              }}
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              startIcon={<Clear />}
              onClick={clearSignature}
              disabled={!hasSignature}
            >
              İmzayı Temizle
            </Button>
          </Box>
        </Box>

        <Alert severity="info" icon={<Warning />}>
          Yukarıdaki imza alanına parmağınızla veya mouse ile imzanızı atınız.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit">
          İptal
        </Button>
        <Button
          onClick={handleSign}
          variant="contained"
          color="primary"
          startIcon={<CheckCircle />}
          disabled={!hasSignature || !signerName.trim()}
        >
          İmzala ve Onayla
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentFormSigner;
