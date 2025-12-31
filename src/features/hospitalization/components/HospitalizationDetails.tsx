import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Hospitalization, HospitalizationLog } from '../types/hospitalization';
import { hospitalizationService } from '../services/hospitalizationService';
import { BillingService } from '../../billing/services/billingService';

const HospitalizationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospitalization, setHospitalization] = useState<Hospitalization | null>(null);
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [logNote, setLogNote] = useState('');

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (hId: string) => {
    const response = await hospitalizationService.getHospitalization(hId);
    if (response.success && response.data) {
      setHospitalization(response.data);
    }
  };

  const handleDischarge = async () => {
    if (!hospitalization) return;
    await hospitalizationService.dischargePatient(hospitalization.hospitalizationId);
    loadData(hospitalization.hospitalizationId.toString());
  };

  const handleCreateInvoice = async () => {
    if (!hospitalization) return;
    try {
      const response = await BillingService.createFromHospitalization(hospitalization.hospitalizationId);
      if (response.success) {
        alert('Invoice Created Successfully!');
      } else {
        alert('Failed to create invoice: ' + response.error);
      }
    } catch (e) {
      alert('Error creating invoice');
    }
  };

  const handleAddLog = async () => {
    if (!hospitalization || !logNote) return;
    await hospitalizationService.addLog(hospitalization.hospitalizationId, { notes: logNote });
    setOpenLogDialog(false);
    setLogNote('');
    loadData(hospitalization.hospitalizationId.toString());
  };

  if (!hospitalization) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Hospitalization Details</Typography>
        <Chip label={hospitalization.status} color={hospitalization.status === 'ACTIVE' ? 'primary' : 'default'} />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1"><strong>Diagnosis:</strong> {hospitalization.diagnosis}</Typography>
          <Typography variant="subtitle1"><strong>Care Plan:</strong> {hospitalization.carePlan}</Typography>
          <Typography variant="subtitle1"><strong>Separation:</strong> {new Date(hospitalization.admissionDate).toLocaleString()} - {hospitalization.dischargeDate ? new Date(hospitalization.dischargeDate).toLocaleString() : 'Present'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'right' }}>
          {hospitalization.status === 'ACTIVE' && (
            <Box>
              <Button variant="contained" onClick={() => setOpenLogDialog(true)} sx={{ mr: 1 }}>Add Log</Button>
              <Button variant="contained" color="warning" onClick={handleDischarge}>Discharge</Button>
            </Box>
          )}
          {hospitalization.status === 'DISCHARGED' && (
            <Button variant="outlined" onClick={handleCreateInvoice}>Create Invoice</Button>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Daily Logs / Vitals</Typography>
      <List>
        {hospitalization.logs && hospitalization.logs.map((log) => (
          <ListItem key={log.logId} divider>
            <ListItemText
              primary={log.notes}
              secondary={new Date(log.logTime).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={openLogDialog} onClose={() => setOpenLogDialog(false)}>
        <DialogTitle>Add Daily Log</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes / Vitals"
            fullWidth
            multiline
            rows={3}
            value={logNote}
            onChange={(e) => setLogNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLog} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
};

export default HospitalizationDetails;
