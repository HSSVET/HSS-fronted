import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { vaccinationService } from '../services/vaccinationService';
import { VaccinationSchedule as VaccinationScheduleType } from '../types/vaccination';
import '../styles/Vaccination.css';

interface VaccinationScheduleProps {
  animalId?: string;
  showAll?: boolean;
}

const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({
  animalId,
  showAll = false
}) => {
  const [schedules, setSchedules] = useState<VaccinationScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchedules();
  }, [animalId, showAll]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (animalId) {
        // Mock response for single animal
        response = { success: true, data: [], error: null };
      } else if (showAll) {
        // Mock response for all animals
        response = { success: true, data: [], error: null };
      } else {
        setSchedules([]);
        return;
      }

      if (response.success && response.data) {
        setSchedules(response.data);
      } else {
        setError(response.error || 'Aşı takvimi yüklenirken hata oluştu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <WarningIcon color="error" />;
      case 'high':
        return <WarningIcon color="warning" />;
      case 'medium':
        return <ScheduleIcon color="info" />;
      case 'low':
        return <CheckIcon color="success" />;
      default:
        return <ScheduleIcon />;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate: Date | string) => {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    return due < new Date();
  };

  const getDaysUntilDue = (dueDate: Date | string) => {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Aşı takvimi yükleniyor...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (schedules.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={4}>
            <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aşı Takvimi Bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {animalId ? 'Bu hayvan için aşı takvimi bulunmuyor.' : 'Henüz aşı takvimi oluşturulmamış.'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Aşı Takvimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // Yeni aşı takvimi ekleme modalını aç
            console.log('Yeni aşı takvimi ekle');
          }}
        >
          Yeni Aşı Takvimi
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
        {schedules.map((schedule) => (
          <Box key={schedule.animalId + schedule.vaccineId}>
            <Card 
              sx={{ 
                height: '100%',
                border: isOverdue(schedule.scheduledDate) ? '2px solid #f44336' : '1px solid #e0e0e0'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h3" noWrap>
                    {schedule.vaccineName}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Tooltip title={schedule.priority}>
                      {getPriorityIcon(schedule.priority)}
                    </Tooltip>
                    <Chip
                      label={schedule.priority.toUpperCase()}
                      color={getPriorityColor(schedule.priority) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Hayvan ID: {schedule.animalId}
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatDate(schedule.scheduledDate)}
                  </Typography>
                </Box>

                {isOverdue(schedule.scheduledDate) && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Bu aşı {Math.abs(getDaysUntilDue(schedule.scheduledDate))} gün gecikmiş!
                    </Typography>
                  </Alert>
                )}

                {!isOverdue(schedule.scheduledDate) && getDaysUntilDue(schedule.scheduledDate) <= 7 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Bu aşı {getDaysUntilDue(schedule.scheduledDate)} gün sonra yapılacak
                    </Typography>
                  </Alert>
                )}

                {schedule.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Not: {schedule.notes}
                  </Typography>
                )}

                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Tooltip title="Düzenle">
                    <IconButton
                      size="small"
                      onClick={() => {
                        console.log('Aşı takvimi düzenle:', schedule);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        console.log('Aşı takvimi sil:', schedule);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Tablo Görünümü (Mobil için) */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Aşı</TableCell>
                <TableCell>Hayvan</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Öncelik</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.animalId + schedule.vaccineId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {schedule.vaccineName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {schedule.animalId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      color={isOverdue(schedule.scheduledDate) ? 'error' : 'text.primary'}
                    >
                      {formatDate(schedule.scheduledDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={schedule.priority.toUpperCase()}
                      color={getPriorityColor(schedule.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default VaccinationSchedule;
