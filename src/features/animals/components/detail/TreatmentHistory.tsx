import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import treatmentService, { Treatment, TreatmentCreateRequest } from '../../services/treatmentService';
import TimelineView, { TimelineItemData } from '../../../../shared/components/TimelineView';

interface TreatmentHistoryProps {
  animalId: number;
}

const TreatmentHistory: React.FC<TreatmentHistoryProps> = ({ animalId }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<TreatmentCreateRequest>>({
    animalId,
    treatmentType: 'MEDICATION',
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'ONGOING',
  });

  useEffect(() => {
    fetchTreatments();
  }, [animalId]);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const response = await treatmentService.getTreatmentsByAnimalId(animalId);
      if (response.success && response.data) {
        setTreatments(response.data);
      }
    } catch (err) {
      setError('Tedavi geçmişi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await treatmentService.createTreatment(formData as TreatmentCreateRequest);
      if (response.success) {
        setOpenDialog(false);
        fetchTreatments();
        setFormData({
          animalId,
          treatmentType: 'MEDICATION',
          title: '',
          startDate: new Date().toISOString().split('T')[0],
          status: 'ONGOING',
        });
      }
    } catch (err) {
      setError('Tedavi eklenirken hata oluştu');
    }
  };

  const timelineItems: TimelineItemData[] = treatments.map((t) => ({
    id: t.treatmentId,
    date: t.startDate,
    title: t.title,
    description: `${t.diagnosis || ''} - ${t.status}`,
    type: t.status === 'COMPLETED' ? 'success' : t.status === 'CANCELLED' ? 'error' : 'primary',
  }));

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Tedavi Geçmişi</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Yeni Tedavi
        </Button>
      </Box>

      <TimelineView items={timelineItems} emptyMessage="Henüz tedavi kaydı bulunmuyor" />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Tedavi Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Başlık"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Tedavi Tipi</InputLabel>
              <Select
                value={formData.treatmentType}
                onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value as any })}
              >
                <MenuItem value="MEDICATION">İlaç</MenuItem>
                <MenuItem value="SURGERY">Ameliyat</MenuItem>
                <MenuItem value="THERAPY">Terapi</MenuItem>
                <MenuItem value="PROCEDURE">Prosedür</MenuItem>
                <MenuItem value="OTHER">Diğer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Tanı"
              value={formData.diagnosis || ''}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Başlangıç Tarihi"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleCreate} variant="contained">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreatmentHistory;
