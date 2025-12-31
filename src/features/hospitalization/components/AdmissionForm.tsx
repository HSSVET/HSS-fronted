import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { hospitalizationService } from '../services/hospitalizationService';

const validationSchema = yup.object({
  diagnosis: yup.string().required('Diagnosis is required'),
  carePlan: yup.string().required('Care Plan is required'),
});

interface AdmissionFormProps {
  animalId: number;
  onSuccess?: () => void;
}

interface FormValues {
  diagnosis: string;
  carePlan: string;
  cageNumber: string;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ animalId, onSuccess }) => {
  const formik = useFormik<FormValues>({
    initialValues: {
      diagnosis: '',
      carePlan: '',
      cageNumber: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await hospitalizationService.admitPatient({
          animalId,
          diagnosis: values.diagnosis,
          carePlan: values.carePlan,
          cageNumber: values.cageNumber
        });
        if (onSuccess) onSuccess();
      } catch (e) {
        console.error(e);
        alert('Failed to admit patient');
      }
    }
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Admit Patient</Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              name="diagnosis"
              label="Diagnosis"
              value={formik.values.diagnosis}
              onChange={formik.handleChange}
              error={formik.touched.diagnosis && Boolean(formik.errors.diagnosis)}
              helperText={formik.touched.diagnosis && formik.errors.diagnosis}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              name="carePlan"
              label="Care Plan"
              multiline
              rows={3}
              value={formik.values.carePlan}
              onChange={formik.handleChange}
              error={formik.touched.carePlan && Boolean(formik.errors.carePlan)}
              helperText={formik.touched.carePlan && formik.errors.carePlan}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              name="cageNumber"
              label="Cage Number (Optional)"
              value={formik.values.cageNumber}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={12}>
            <Button fullWidth variant="contained" type="submit">Admit</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AdmissionForm;
