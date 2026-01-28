import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Collapse,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Warning,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
  Vaccines,
} from '@mui/icons-material';
import { vaccinationService } from '../services/vaccinationService';
import type { VaccinationRecord } from '../types/vaccination';

interface VaccinationHistoryCheckProps {
  animalId: string | number | null;
  animalName?: string;
  selectedVaccineId?: string;
  selectedVaccineName?: string;
  onHistoryLoaded?: (records: VaccinationRecord[]) => void;
  refreshKey?: number;
}

interface VaccinationWarning {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

const VaccinationHistoryCheck: React.FC<VaccinationHistoryCheckProps> = ({
  animalId,
  animalName,
  selectedVaccineId,
  selectedVaccineName,
  onHistoryLoaded,
  refreshKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [vaccinationHistory, setVaccinationHistory] = useState<VaccinationRecord[]>([]);
  const [warnings, setWarnings] = useState<VaccinationWarning[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (animalId) {
      fetchVaccinationHistory();
    } else {
      setVaccinationHistory([]);
      setWarnings([]);
    }
  }, [animalId, refreshKey]);

  useEffect(() => {
    if (selectedVaccineId && vaccinationHistory.length > 0) {
      checkVaccineConflicts();
    }
  }, [selectedVaccineId, vaccinationHistory]);

  const fetchVaccinationHistory = async () => {
    if (!animalId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await vaccinationService.getVaccinationRecords(String(animalId));
      const rawRecords = response.data || [];
      // Backend modelde tarih alanı "date", frontend tipinde "applicationDate"
      const normalizedRecords: VaccinationRecord[] = (rawRecords as any[]).map((r) => ({
        ...r,
        applicationDate: (r as any).applicationDate ?? (r as any).date,
      }));

      setVaccinationHistory(normalizedRecords);
      onHistoryLoaded?.(normalizedRecords);
      analyzeHistory(normalizedRecords);
    } catch (err) {
      console.error('Failed to fetch vaccination history:', err);
      setError('Aşı geçmişi yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeHistory = (records: VaccinationRecord[]) => {
    const newWarnings: VaccinationWarning[] = [];
    const today = new Date();

    // Check for overdue vaccinations
    const overdueVaccinations = records.filter((record) => {
      if (record.nextDueDate) {
        const dueDate = new Date(record.nextDueDate);
        return dueDate < today;
      }
      return false;
    });

    if (overdueVaccinations.length > 0) {
      newWarnings.push({
        type: 'error',
        title: 'Gecikmiş Aşılar',
        message: `${overdueVaccinations.length} adet gecikmiş aşı bulundu. Lütfen kontrol ediniz.`,
      });
    }

    // Check for upcoming vaccinations (within 7 days)
    const upcomingVaccinations = records.filter((record) => {
      if (record.nextDueDate) {
        const dueDate = new Date(record.nextDueDate);
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      }
      return false;
    });

    if (upcomingVaccinations.length > 0) {
      newWarnings.push({
        type: 'warning',
        title: 'Yaklaşan Aşılar',
        message: `${upcomingVaccinations.length} adet aşı önümüzdeki 7 gün içinde yapılmalı.`,
      });
    }

    // Check if no vaccination history exists
    if (records.length === 0) {
      newWarnings.push({
        type: 'info',
        title: 'Aşı Geçmişi Bulunamadı',
        message: 'Bu hasta için kayıtlı aşı geçmişi bulunmamaktadır. Bu ilk aşı kaydı olacaktır.',
      });
    }

    setWarnings(newWarnings);
  };

  const checkVaccineConflicts = () => {
    if (!selectedVaccineId || !selectedVaccineName) return;

    const newWarnings: VaccinationWarning[] = [...warnings.filter(w => !w.title.includes('Son'))];
    const today = new Date();

    // Find last vaccination of the same type
    const sameTypeVaccinations = vaccinationHistory.filter(
      (record) => record.vaccineId === selectedVaccineId || 
                  record.vaccineName?.toLowerCase() === selectedVaccineName?.toLowerCase()
    );

    if (sameTypeVaccinations.length > 0) {
      const lastVaccination = sameTypeVaccinations.sort(
        (a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
      )[0];

      const lastDate = new Date(lastVaccination.applicationDate);
      const daysSinceLast = Math.ceil((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLast < 14) {
        newWarnings.push({
          type: 'error',
          title: 'Aşı Çakışması Uyarısı',
          message: `Bu aşı ${daysSinceLast} gün önce (${lastDate.toLocaleDateString('tr-TR')}) uygulanmış. Minimum 14 gün beklemeniz önerilir.`,
        });
      } else if (lastVaccination.nextDueDate) {
        const nextDueDate = new Date(lastVaccination.nextDueDate);
        if (today < nextDueDate) {
          const daysUntilDue = Math.ceil((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          newWarnings.push({
            type: 'warning',
            title: 'Erken Aşı Uyarısı',
            message: `Bir sonraki aşı tarihi ${nextDueDate.toLocaleDateString('tr-TR')} (${daysUntilDue} gün sonra). Erken uygulama yapıyorsunuz.`,
          });
        }
      }

      // Add info about last vaccination
      newWarnings.push({
        type: 'info',
        title: `Son ${selectedVaccineName} Aşısı`,
        message: `${lastDate.toLocaleDateString('tr-TR')} tarihinde uygulanmış.`,
      });
    }

    setWarnings(newWarnings);
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const getStatusChip = (record: VaccinationRecord) => {
    const today = new Date();

    if (record.nextDueDate) {
      const dueDate = new Date(record.nextDueDate);
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return <Chip label="Gecikmiş" color="error" size="small" icon={<ErrorIcon />} />;
      } else if (diffDays <= 7) {
        return <Chip label="Yaklaşıyor" color="warning" size="small" icon={<Schedule />} />;
      }
    }

    return <Chip label="Tamamlandı" color="success" size="small" icon={<CheckCircle />} />;
  };

  if (!animalId) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Vaccines />
          <Typography variant="h6">
            Geçmiş Aşı Karnesi {animalName && `- ${animalName}`}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: 'white' }}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              {/* Warnings Section */}
              {warnings.length > 0 && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {warnings.map((warning, index) => (
                    <Alert
                      key={index}
                      severity={warning.type}
                      icon={
                        warning.type === 'error' ? <ErrorIcon /> :
                        warning.type === 'warning' ? <Warning /> :
                        warning.type === 'success' ? <CheckCircle /> : undefined
                      }
                    >
                      <AlertTitle>{warning.title}</AlertTitle>
                      {warning.message}
                    </Alert>
                  ))}
                </Stack>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Vaccination History Table */}
              {vaccinationHistory.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell><strong>Aşı Adı</strong></TableCell>
                        <TableCell><strong>Uygulama Tarihi</strong></TableCell>
                        <TableCell><strong>Sonraki Tarih</strong></TableCell>
                        <TableCell><strong>Veteriner</strong></TableCell>
                        <TableCell><strong>Parti No</strong></TableCell>
                        <TableCell align="center"><strong>Durum</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vaccinationHistory
                        .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
                        .slice(0, 10)
                        .map((record, index) => (
                          <TableRow
                            key={record.id || index}
                            sx={{
                              '&:nth-of-type(odd)': { bgcolor: 'grey.50' },
                              ...(selectedVaccineName &&
                                record.vaccineName?.toLowerCase() === selectedVaccineName.toLowerCase() && {
                                  bgcolor: 'primary.light',
                                  '&:nth-of-type(odd)': { bgcolor: 'primary.light' },
                                }),
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Vaccines fontSize="small" color="primary" />
                                {record.vaccineName}
                              </Box>
                            </TableCell>
                            <TableCell>{formatDate(record.applicationDate)}</TableCell>
                            <TableCell>{formatDate(record.nextDueDate)}</TableCell>
                            <TableCell>{record.veterinarianName || '-'}</TableCell>
                            <TableCell>{record.batchNumber || '-'}</TableCell>
                            <TableCell align="center">{getStatusChip(record)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Vaccines sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                  <Typography color="text.secondary">
                    Bu hasta için aşı kaydı bulunmamaktadır.
                  </Typography>
                </Box>
              )}

              {vaccinationHistory.length > 10 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: 'center' }}
                >
                  Son 10 kayıt gösteriliyor. Toplam: {vaccinationHistory.length} kayıt
                </Typography>
              )}
            </>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default VaccinationHistoryCheck;
