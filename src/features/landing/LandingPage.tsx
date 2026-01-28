import React from 'react';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';

const LandingPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </Box>
  );
};

export default LandingPage;
