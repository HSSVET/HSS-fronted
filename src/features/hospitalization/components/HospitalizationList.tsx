import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Paper,
  Box,
  Button
} from '@mui/material';
import { Hospitalization } from '../types/hospitalization';
import { hospitalizationService } from '../services/hospitalizationService';
import { useNavigate } from 'react-router-dom';

interface HospitalizationListProps {
  animalId: number;
}

const HospitalizationList: React.FC<HospitalizationListProps> = ({ animalId }) => {
  const [hospitalizations, setHospitalizations] = useState<Hospitalization[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [animalId]);

  const loadData = async () => {
    const response = await hospitalizationService.getHospitalizationsByAnimal(animalId);
    if (response.success && response.data) {
      setHospitalizations(response.data);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Hospitalizations</Typography>
      {hospitalizations.length === 0 ? (
        <Typography variant="body2" color="textSecondary">No records found.</Typography>
      ) : (
        <List>
          {hospitalizations.map((h) => (
            <Paper key={h.hospitalizationId} sx={{ mb: 1, p: 1 }}>
              <ListItem
                secondaryAction={
                  <Button size="small" onClick={() => navigate(`/hospitalizations/${h.hospitalizationId}`)}>
                    Details
                  </Button>
                }
              >
                <ListItemText
                  primary={h.diagnosis}
                  secondary={`Admitted: ${new Date(h.admissionDate).toLocaleDateString()}`}
                />
                <Chip label={h.status} color={h.status === 'ACTIVE' ? 'primary' : 'default'} size="small" sx={{ mr: 2 }} />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HospitalizationList;
