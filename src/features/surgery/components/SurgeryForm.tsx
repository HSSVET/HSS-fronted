import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { surgeryService } from '../services/surgeryService';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  description: yup.string().required('Description is required'),
  startDate: yup.string().required('Start Date is required'),
});

interface SurgeryFormProps {
  animalId: number;
  onSuccess?: () => void;
}

const SurgeryForm: React.FC<SurgeryFormProps> = ({ animalId, onSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      description: '',
      startDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await surgeryService.createSurgery({
          animalId,
          description: values.description,
          startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
        });
        if (onSuccess) {
          onSuccess();
        } else {
          // navigate back or show success
        }
      } catch (err) {
        setError('Failed to create surgery');
        console.error(err);
      }
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Schedule Surgery
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description / Procedure Name"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              id="startDate"
              name="startDate"
              label="Planned Date"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formik.values.startDate}
              onChange={formik.handleChange}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={formik.touched.startDate && formik.errors.startDate}
            />
          </Grid>
          <Grid size={12}>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Schedule
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SurgeryForm;
