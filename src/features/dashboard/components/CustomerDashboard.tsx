import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { AnimalService, type AnimalRecord } from '../../animals/services/animalService';
import { AppointmentService, type AppointmentRecord } from '../../appointments/services/appointmentService';
import { useError } from '../../../context/ErrorContext';

const CustomerDashboard: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const { clinicId } = useParams();
  const { addError } = useError();

  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState<AnimalRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);

  const fetchData = useCallback(async () => {
    if (!state.user?.ownerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const animalService = new AnimalService();
      const appointmentService = new AppointmentService();

      // Fetch Animals
      const animalResponse = await animalService.getAnimalsByOwnerId(state.user.ownerId.toString());
      let myAnimals: AnimalRecord[] = [];
      if (animalResponse.success && animalResponse.data) {
        myAnimals = animalResponse.data;
        setAnimals(myAnimals);
      }

      // Fetch Appointments (iterate over animals)
      let allAppointments: AppointmentRecord[] = [];

      const appointmentPromises = myAnimals.map(animal =>
        appointmentService.getAppointmentsByAnimalId(animal.id.toString())
      );

      const appointmentResponses = await Promise.all(appointmentPromises);

      appointmentResponses.forEach(res => {
        if (res.success && res.data) {
          allAppointments = [...allAppointments, ...res.data];
        }
      });

      // Sort appointments by date descending
      allAppointments.sort((a, b) => {
        const dateA = new Date(a.dateTime || '').getTime();
        const dateB = new Date(b.dateTime || '').getTime();
        return dateB - dateA;
      });

      setAppointments(allAppointments);

    } catch (err: any) {
      console.error('Error fetching dashboard data', err);
      // Don't show error to user immediately if it's just empty, but log it.
      // addError('Veriler yüklenirken hata oluştu', 'error', err.message);
    } finally {
      setLoading(false);
    }
  }, [state.user?.ownerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hoşgeldiniz, {state.user?.firstName || 'Değerli Müşterimiz'}
      </Typography>

      <Grid container spacing={3}>
        {/* Animals Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evcil Hayvanlarım
              </Typography>
              {animals.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Kayıtlı evcil hayvanınız bulunmamaktadır.
                </Typography>
              ) : (
                animals.map(animal => (
                  <Box key={animal.id} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {animal.name} ({animal.species?.name})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Irk: {animal.breed?.name} | Yaş: {animal.ageInYears ?? '-'}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate(`/portal/${clinicId}/animals/${animal.id}`)}
                      sx={{ mt: 1 }}
                    >
                      Detaylar
                    </Button>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Appointments Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Randevularım
              </Typography>
              {appointments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Gelecek randevunuz bulunmamaktadır.
                </Typography>
              ) : (
                appointments.slice(0, 5).map(app => ( // Show top 5
                  <Box key={app.appointmentId} sx={{ mb: 2, p: 1, borderLeft: '4px solid #92A78C', bgcolor: '#f9f9f9' }}>
                    <Typography variant="subtitle2">
                      {new Date(app.dateTime).toLocaleDateString('tr-TR')} {new Date(app.dateTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {app.animalName} - {app.subject}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {app.status}
                    </Typography>
                  </Box>
                ))
              )}
              {appointments.length > 5 && (
                <Button size="small" onClick={() => navigate(`/portal/${clinicId}/appointments`)}>Tümünü Gör</Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;
