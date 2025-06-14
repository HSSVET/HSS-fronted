import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from '@mui/material';

interface AddAnimalDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (animal: {
    name: string;
    species: string;
    breed: string;
    health: string;
    lastCheckup: string;
    owner: string;
    nextVaccine: string;
  }) => void;
}

const AddAnimalDialog: React.FC<AddAnimalDialogProps> = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    health: '',
    lastCheckup: '',
    owner: '',
    nextVaccine: '',
  });

  const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    onAdd(formData);
    setFormData({
      name: '',
      species: '',
      breed: '',
      health: '',
      lastCheckup: '',
      owner: '',
      nextVaccine: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Hayvan Ekle</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Hayvan Adı"
            value={formData.name}
            onChange={handleTextChange('name')}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Tür</InputLabel>
            <Select
              value={formData.species}
              label="Tür"
              onChange={handleSelectChange('species')}
            >
              <MenuItem value="Kedi">Kedi</MenuItem>
              <MenuItem value="Köpek">Köpek</MenuItem>
              <MenuItem value="Kuş">Kuş</MenuItem>
              <MenuItem value="İnek">İnek</MenuItem>
              <MenuItem value="Koyun">Koyun</MenuItem>
              <MenuItem value="Keçi">Keçi</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Irk"
            value={formData.breed}
            onChange={handleTextChange('breed')}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Sağlık Durumu</InputLabel>
            <Select
              value={formData.health}
              label="Sağlık Durumu"
              onChange={handleSelectChange('health')}
            >
              <MenuItem value="İyi">İyi</MenuItem>
              <MenuItem value="Kontrol Gerekli">Kontrol Gerekli</MenuItem>
              <MenuItem value="Tedavi Altında">Tedavi Altında</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Son Kontrol Tarihi"
            type="date"
            value={formData.lastCheckup}
            onChange={handleTextChange('lastCheckup')}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Sahibi"
            value={formData.owner}
            onChange={handleTextChange('owner')}
            fullWidth
            required
          />
          <TextField
            label="Sonraki Aşı Tarihi"
            type="date"
            value={formData.nextVaccine}
            onChange={handleTextChange('nextVaccine')}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!formData.name || !formData.species || !formData.breed || !formData.health || !formData.lastCheckup || !formData.owner || !formData.nextVaccine}
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAnimalDialog; 