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
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import behaviorNoteService, { BehaviorNote, BehaviorNoteCreateRequest } from '../../services/behaviorNoteService';

interface BehaviorNotesProps {
  animalId: number;
}

const BehaviorNotes: React.FC<BehaviorNotesProps> = ({ animalId }) => {
  const [notes, setNotes] = useState<BehaviorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<BehaviorNoteCreateRequest>>({
    animalId,
    title: '',
    description: '',
    observedDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchNotes();
  }, [animalId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await behaviorNoteService.getBehaviorNotesByAnimalId(animalId);
      if (response.success && response.data) {
        setNotes(response.data);
      }
    } catch (err) {
      setError('Davranış notları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await behaviorNoteService.createBehaviorNote(formData as BehaviorNoteCreateRequest);
      if (response.success) {
        setOpenDialog(false);
        fetchNotes();
        setFormData({
          animalId,
          title: '',
          description: '',
          observedDate: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err) {
      setError('Not eklenirken hata oluştu');
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Davranış Notları</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Yeni Not
        </Button>
      </Box>

      {notes.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz davranış notu bulunmuyor
        </Typography>
      ) : (
        <List>
          {notes.map((note, index) => (
            <React.Fragment key={note.behaviorNoteId}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {note.title}
                      {note.severity && (
                        <Chip label={note.severity} size="small" color={getSeverityColor(note.severity) as any} />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {note.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(note.observedDate).toLocaleDateString('tr-TR')} - {note.observedBy || 'Bilinmiyor'}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < notes.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Davranış Notu Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Başlık"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <MenuItem value="AGGRESSION">Saldırganlık</MenuItem>
                <MenuItem value="ANXIETY">Anksiyete</MenuItem>
                <MenuItem value="FEEDING">Beslenme</MenuItem>
                <MenuItem value="SOCIAL">Sosyal</MenuItem>
                <MenuItem value="TRAINING">Eğitim</MenuItem>
                <MenuItem value="OTHER">Diğer</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Önem Derecesi</InputLabel>
              <Select
                value={formData.severity || ''}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
              >
                <MenuItem value="LOW">Düşük</MenuItem>
                <MenuItem value="MEDIUM">Orta</MenuItem>
                <MenuItem value="HIGH">Yüksek</MenuItem>
                <MenuItem value="CRITICAL">Kritik</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Gözlem Tarihi"
              type="date"
              value={formData.observedDate}
              onChange={(e) => setFormData({ ...formData, observedDate: e.target.value })}
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

export default BehaviorNotes;
