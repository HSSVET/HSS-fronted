import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Pets, Assessment, Schedule } from '@mui/icons-material';

const Features = () => {
  const features = [
    { title: 'Patient Records', icon: Pets, description: 'Comprehensive medical history and patient profiles.' },
    { title: 'Smart Scheduling', icon: Schedule, description: 'Efficient appointment management and reminders.' },
    { title: 'Analytics', icon: Assessment, description: 'Deep insights into clinic performance.' },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Our Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    <feature.icon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
