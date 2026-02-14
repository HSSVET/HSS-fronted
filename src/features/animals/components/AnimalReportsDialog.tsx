import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import ScienceIcon from '@mui/icons-material/Science';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNotifications } from '../../../hooks/useNotifications';

interface AnimalReportsDialogProps {
  open: boolean;
  onClose: () => void;
  animalId: string;
  animalName: string;
}

interface Report {
  id: number;
  reportDate: string;
  reportType: string;
  title: string;
  veterinarianName?: string;
  description?: string;
  status?: string;
}

const AnimalReportsDialog: React.FC<AnimalReportsDialogProps> = ({
  open,
  onClose,
  animalId,
  animalName,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const { addError } = useNotifications();

  useEffect(() => {
    if (open && animalId) {
      fetchReports();
    }
  }, [open, animalId]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { apiClient } = await import('../../../services/api');
      
      // Birden fazla kaynaktan rapor toplayabiliriz
      const promises = [
        // Muayene kayıtları
        apiClient.get<any>(`/api/clinical-examinations/animal/${animalId}`).catch(() => ({ success: false, data: [] })),
        // Lab test sonuçları
        apiClient.get<any>(`/api/laboratory/tests/animal/${animalId}`).catch(() => ({ success: false, data: [] })),
        // Aşı kayıtları
        apiClient.get<any>(`/api/vaccinations/animal/${animalId}`).catch(() => ({ success: false, data: [] })),
        // Ameliyat kayıtları
        apiClient.get<any>(`/api/surgeries/animal/${animalId}`).catch(() => ({ success: false, data: [] })),
      ];

      const [examinations, labTests, vaccinations, surgeries] = await Promise.all(promises);

      const allReports: Report[] = [];

      // Muayene kayıtlarını ekle
      if (examinations.success && examinations.data) {
        const examinationReports = (Array.isArray(examinations.data) ? examinations.data : []).map((exam: any) => ({
          id: exam.id || exam.examinationId,
          reportDate: exam.examinationDate || exam.date,
          reportType: 'EXAMINATION',
          title: 'Klinik Muayene',
          veterinarianName: exam.veterinarianName,
          description: exam.diagnosis || exam.notes,
          status: exam.status,
        }));
        allReports.push(...examinationReports);
      }

      // Lab test sonuçlarını ekle
      if (labTests.success && labTests.data) {
        const labReports = (Array.isArray(labTests.data) ? labTests.data : []).map((test: any) => ({
          id: test.id || test.testId,
          reportDate: test.testDate || test.sampleDate,
          reportType: 'LAB_TEST',
          title: `Lab Test - ${test.testType || test.testName || 'Test'}`,
          veterinarianName: test.requestedBy,
          description: test.result || test.findings,
          status: test.status,
        }));
        allReports.push(...labReports);
      }

      // Aşı kayıtlarını ekle
      if (vaccinations.success && vaccinations.data) {
        const vaccinationReports = (Array.isArray(vaccinations.data) ? vaccinations.data : []).map((vacc: any) => ({
          id: vacc.id || vacc.vaccinationId,
          reportDate: vacc.vaccinationDate || vacc.administeredDate,
          reportType: 'VACCINATION',
          title: `Aşı - ${vacc.vaccineName || vacc.vaccineType}`,
          veterinarianName: vacc.administeredBy,
          description: vacc.notes,
          status: 'COMPLETED',
        }));
        allReports.push(...vaccinationReports);
      }

      // Ameliyat kayıtlarını ekle
      if (surgeries.success && surgeries.data) {
        const surgeryReports = (Array.isArray(surgeries.data) ? surgeries.data : []).map((surgery: any) => ({
          id: surgery.id || surgery.surgeryId,
          reportDate: surgery.surgeryDate || surgery.scheduledDate,
          reportType: 'SURGERY',
          title: `Ameliyat - ${surgery.surgeryType || surgery.procedure}`,
          veterinarianName: surgery.surgeonName,
          description: surgery.notes || surgery.findings,
          status: surgery.status,
        }));
        allReports.push(...surgeryReports);
      }

      // Tarihe göre sırala (en yeni en üstte)
      allReports.sort((a, b) => {
        const dateA = new Date(a.reportDate);
        const dateB = new Date(b.reportDate);
        return dateB.getTime() - dateA.getTime();
      });

      setReports(allReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      addError('Raporlar yüklenirken hata oluştu', 'error');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'EXAMINATION':
        return <MedicalInformationIcon color="primary" />;
      case 'LAB_TEST':
        return <ScienceIcon color="secondary" />;
      case 'VACCINATION':
        return <VaccinesIcon color="success" />;
      case 'SURGERY':
        return <LocalHospitalIcon color="error" />;
      default:
        return <DescriptionIcon color="action" />;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'EXAMINATION':
        return 'Muayene';
      case 'LAB_TEST':
        return 'Lab Testi';
      case 'VACCINATION':
        return 'Aşı';
      case 'SURGERY':
        return 'Ameliyat';
      default:
        return type;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <DescriptionIcon color="primary" />
            <Typography variant="h6">Geçmiş Raporlar - {animalName}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : reports.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight={200}
            gap={2}
          >
            <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="body1" color="text.secondary">
              Bu hayvan için henüz rapor kaydı bulunmuyor.
            </Typography>
          </Box>
        ) : (
          <List>
            {reports.map((report, index) => (
              <React.Fragment key={`${report.reportType}-${report.id}`}>
                {index > 0 && <Divider />}
                <ListItem
                  component={Paper}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>{getReportIcon(report.reportType)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {report.title}
                        </Typography>
                        <Chip
                          label={getReportTypeLabel(report.reportType)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Tarih:</strong> {formatDate(report.reportDate)}
                        </Typography>
                        {report.veterinarianName && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Veteriner:</strong> {report.veterinarianName}
                          </Typography>
                        )}
                        {report.description && (
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {report.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnimalReportsDialog;
