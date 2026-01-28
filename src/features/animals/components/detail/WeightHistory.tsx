import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import * as yup from 'yup'; // Assuming yup is installed and used across project
// If yup is not available, I can use simple validation. package.json has yup.
import weightService, { WeightRecord } from '../../services/weightService';
import WeightChart from './WeightChart';
import { useParams } from 'react-router-dom';

const validationSchema = yup.object({
  weight: yup.number()
    .required('Kilo zorunludur')
    .positive('Kilo pozitif olmalıdır')
    .max(999, 'Kilo 999 dan küçük olmalıdır'),
  measuredAt: yup.date().required('Tarih zorunludur'),
  note: yup.string().max(500, 'Not 500 karakterden uzun olamaz')
});

const WeightHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [history, setHistory] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchHistory = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await weightService.getWeightHistory(id);
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      weight: 0,
      measuredAt: new Date().toISOString().split('T')[0],
      note: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!id) return;
      try {
        if (editingId) {
          await weightService.updateWeightRecord(editingId, {
            weight: Number(values.weight),
            measuredAt: values.measuredAt,
            note: values.note
          });
        } else {
          await weightService.addWeightRecord(id, {
            weight: Number(values.weight),
            measuredAt: values.measuredAt,
            note: values.note
          });
        }
        setOpenDialog(false);
        fetchHistory();
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    formik.resetForm({
      values: {
        weight: 0,
        measuredAt: new Date().toISOString().split('T')[0],
        note: ''
      }
    });
    setOpenDialog(true);
  };

  const handleEdit = (record: WeightRecord) => {
    setEditingId(record.id);
    formik.setValues({
      weight: record.weight,
      measuredAt: record.measuredAt, // Depending on format from backend
      note: record.note || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (recordId: number) => {
    if (window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      try {
        await weightService.deleteWeightRecord(recordId);
        fetchHistory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Kilo Takibi & Gelişim</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Yeni Kayıt
        </Button>
      </Box>

      {/* Chart Section */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <WeightChart data={history} />
      </Box>

      {/* History Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tarih</TableCell>
              <TableCell>Kilo (kg)</TableCell>
              <TableCell>Not</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
            ) : history.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">Kayıt bulunamadı.</TableCell></TableRow>
            ) : (
              history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.measuredAt).toLocaleDateString()}</TableCell>
                  <TableCell>{record.weight} kg</TableCell>
                  <TableCell>{record.note || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(record)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(record.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingId ? 'Kaydı Düzenle' : 'Yeni Kilo Kaydı'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Kilo (kg)"
              type="number"
              fullWidth
              name="weight"
              value={formik.values.weight}
              onChange={formik.handleChange}
              error={formik.touched.weight && Boolean(formik.errors.weight)}
              helperText={formik.touched.weight && formik.errors.weight}
              inputProps={{ step: 0.1, min: 0 }}
            />
            <TextField
              margin="dense"
              label="Tarih"
              type="date"
              fullWidth
              name="measuredAt"
              value={formik.values.measuredAt}
              onChange={formik.handleChange}
              error={formik.touched.measuredAt && Boolean(formik.errors.measuredAt)}
              helperText={formik.touched.measuredAt && formik.errors.measuredAt}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Not"
              type="text"
              fullWidth
              multiline
              rows={2}
              name="note"
              value={formik.values.note}
              onChange={formik.handleChange}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>İptal</Button>
            <Button type="submit" variant="contained">Kaydet</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default WeightHistory;
