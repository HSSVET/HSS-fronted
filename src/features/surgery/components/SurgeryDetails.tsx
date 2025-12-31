import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Surgery, SurgeryMedication } from '../types/surgery';
import { surgeryService } from '../services/surgeryService';
import { BillingService } from '../../billing/services/billingService';

const SurgeryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surgery, setSurgery] = useState<Surgery | null>(null);

  useEffect(() => {
    if (id) loadSurgery(id);
  }, [id]);

  const loadSurgery = async (surgeryId: string) => {
    const response = await surgeryService.getSurgery(surgeryId);
    if (response.success && response.data) {
      setSurgery(response.data);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!surgery) return;
    await surgeryService.updateStatus(surgery.surgeryId, newStatus);
    loadSurgery(surgery.surgeryId.toString());
  };

  const handleCreateInvoice = async () => {
    if (!surgery) return;
    try {
      const response = await BillingService.createFromSurgery(surgery.surgeryId);
      if (response.success) {
        alert('Invoice Created Successfully!');
        // navigate to invoice details if possible
      } else {
        alert('Failed to create invoice: ' + response.error);
      }
    } catch (e) {
      alert('Error creating invoice');
    }
  };

  if (!surgery) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Surgery Details</Typography>
        <Chip label={surgery.status} color="primary" />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1"><strong>Animal:</strong> {surgery.animalName || surgery.animalId}</Typography>
          <Typography variant="subtitle1"><strong>Description:</strong> {surgery.description}</Typography>
          <Typography variant="subtitle1"><strong>Date:</strong> {surgery.startDate ? new Date(surgery.startDate).toLocaleString() : 'TBD'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
            {surgery.status === 'PLANNED' && (
              <Button variant="contained" onClick={() => handleStatusUpdate('IN_PROGRESS')}>Start Surgery</Button>
            )}
            {surgery.status === 'IN_PROGRESS' && (
              <Button variant="contained" color="success" onClick={() => handleStatusUpdate('COMPLETED')}>Complete Surgery</Button>
            )}
            {surgery.status === 'COMPLETED' && (
              <Button variant="outlined" color="primary" onClick={handleCreateInvoice}>Create Invoice</Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Medications Used</Typography>
      <List>
        {surgery.medications && surgery.medications.length > 0 ? (
          surgery.medications.map((med: SurgeryMedication, index: number) => (
            <ListItem key={index}>
              <ListItemText primary={`Medicine ID: ${med.medicineId}`} secondary={`Quantity: ${med.quantity}`} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">No medications recorded.</Typography>
        )}
      </List>

      {/* Add Medication Form could go here */}

    </Paper>
  );
};

export default SurgeryDetails;
