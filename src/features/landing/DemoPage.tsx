import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Pets as PetsIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const DemoPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Simulated effect
    setMessages(['Welcome to HSS Demo']);
  }, []); // dependencies fixed

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom align="center">
          HSS Demo
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph align="center">
          Experience the future of veterinary clinic management.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PetsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Patient Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage animal profiles, history, and treatments efficiently.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gain insights into clinic performance and trends.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
            Start Free Trial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DemoPage;
