import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  QrCodeScanner,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Inventory,
  Clear,
} from '@mui/icons-material';
import { apiClient } from '../../../services/api';

interface BarcodeScanResponse {
  productId: number | null;
  name: string | null;
  barcode: string;
  lotNo: string | null;
  serialNumber: string | null;
  productionDate: string | null;
  expirationDate: string | null;
  currentStock: number | null;
  unitCost: number | null;
  sellingPrice: number | null;
  category: string | null;
  supplier: string | null;
  location: string | null;
  isActive: boolean | null;
  isValid: boolean;
  isExpired: boolean | null;
  isLowStock: boolean | null;
  warningMessage: string | null;
}

interface BarcodeScannerProps {
  onProductSelect: (product: BarcodeScanResponse | null) => void;
  selectedProductId?: number | string | null;
  disabled?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onProductSelect,
  selectedProductId,
  disabled = false,
}) => {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<BarcodeScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleScan = async () => {
    if (!barcode.trim()) {
      setError('Lütfen barkod girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await apiClient.get<BarcodeScanResponse>(
        `/api/vaccinations/scan-barcode/${encodeURIComponent(barcode.trim())}`
      );

      const result = response.data;
      setScanResult(result);

      if (result.isValid) {
        onProductSelect(result);
      } else {
        onProductSelect(null);
      }
    } catch (err: any) {
      console.error('Barcode scan error:', err);
      setError(err.response?.data?.message || 'Barkod taraması başarısız oldu.');
      onProductSelect(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScan();
    }
  };

  const handleClear = () => {
    setBarcode('');
    setScanResult(null);
    setError(null);
    onProductSelect(null);
    inputRef.current?.focus();
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR');
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <QrCodeScanner color="primary" />
        <Typography variant="h6">Barkod Tarama</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          label="Barkod"
          placeholder="Barkodu okutun veya girin..."
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled || loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QrCodeScanner color="action" />
              </InputAdornment>
            ),
            endAdornment: barcode && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear} disabled={loading}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="off"
        />
        <Button
          variant="contained"
          onClick={handleScan}
          disabled={disabled || loading || !barcode.trim()}
          sx={{ minWidth: 100 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Tara'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {scanResult && (
        <Box>
          <Divider sx={{ my: 2 }} />

          {scanResult.isValid ? (
            <Alert
              severity={scanResult.isLowStock ? 'warning' : 'success'}
              icon={scanResult.isLowStock ? <Warning /> : <CheckCircle />}
              sx={{ mb: 2 }}
            >
              <AlertTitle>
                {scanResult.isLowStock ? 'Ürün Bulundu (Düşük Stok)' : 'Ürün Bulundu'}
              </AlertTitle>
              {scanResult.warningMessage || `${scanResult.name} stoktan kullanıma hazır.`}
            </Alert>
          ) : (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
              <AlertTitle>Ürün Kullanılamaz</AlertTitle>
              {scanResult.warningMessage || 'Ürün bulunamadı veya kullanılamaz durumda.'}
            </Alert>
          )}

          {scanResult.productId && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {scanResult.name}
                  </Typography>
                  {scanResult.category && (
                    <Chip label={scanResult.category} size="small" color="primary" variant="outlined" />
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Barkod:</strong> {scanResult.barcode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Lot No:</strong> {scanResult.lotNo || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Mevcut Stok:</strong>{' '}
                    <Chip
                      label={scanResult.currentStock ?? 0}
                      size="small"
                      color={
                        scanResult.currentStock && scanResult.currentStock > 0
                          ? scanResult.isLowStock
                            ? 'warning'
                            : 'success'
                          : 'error'
                      }
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Son Kullanma:</strong>{' '}
                    <span
                      style={{
                        color: scanResult.isExpired ? 'red' : 'inherit',
                        fontWeight: scanResult.isExpired ? 'bold' : 'normal',
                      }}
                    >
                      {formatDate(scanResult.expirationDate)}
                    </span>
                  </Typography>
                  {scanResult.supplier && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tedarikçi:</strong> {scanResult.supplier}
                    </Typography>
                  )}
                  {scanResult.location && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Konum:</strong> {scanResult.location}
                    </Typography>
                  )}
                </Box>

                {scanResult.sellingPrice && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Birim Fiyat:</strong> ₺{scanResult.sellingPrice.toFixed(2)}
                  </Typography>
                )}
              </Stack>
            </Paper>
          )}
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Barkod okuyucu ile tarayın veya manuel olarak girin. Enter tuşu ile tarama yapabilirsiniz.
      </Typography>
    </Paper>
  );
};

export default BarcodeScanner;
