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
import { Surgery } from '../types/surgery';
import { surgeryService } from '../services/surgeryService';
import { useNavigate } from 'react-router-dom';

interface SurgeryListProps {
  animalId: number;
}

const SurgeryList: React.FC<SurgeryListProps> = ({ animalId }) => {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSurgeries();
  }, [animalId]);

  const loadSurgeries = async () => {
    const response = await surgeryService.getSurgeriesByAnimal(animalId);
    if (response.success && response.data) {
      setSurgeries(response.data);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Box>
      <Typography variant="h6">Surgeries</Typography>
      {surgeries.length === 0 ? (
        <Typography variant="body2" color="textSecondary">No surgeries found.</Typography>
      ) : (
        <List>
          {surgeries.map((surgery) => (
            <Paper key={surgery.surgeryId} sx={{ mb: 1, p: 1 }}>
              <ListItem
                secondaryAction={
                  <Button size="small" onClick={() => navigate(`/surgeries/${surgery.surgeryId}`)}>
                    Details
                  </Button>
                }
              >
                <ListItemText
                  primary={surgery.description || "Surgery"}
                  secondary={`Date: ${surgery.startDate ? new Date(surgery.startDate).toLocaleDateString() : 'TBD'}`}
                />
                <Chip
                  label={surgery.status}
                  color={statusColor(surgery.status) as any}
                  size="small"
                  sx={{ mr: 2 }}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SurgeryList;
