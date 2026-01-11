import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AboutPage = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom>
          About HSS
        </Typography>
        <Typography variant="body1">
          Hayvan Sağlık Sistemi (HSS) is dedicated to providing modern solutions for veterinary clinics.
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutPage;
