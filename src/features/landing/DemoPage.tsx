import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Dashboard } from '../dashboard';
import { SandboxProvider, DemoBanner } from '../../context/SandboxContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const DemoPage = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <SandboxProvider isDemo={true}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <DemoBanner />

        {/* Main Content Area - padded for Navbar and Banner */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f5f7fa', // Dashboard background color
            pt: { xs: 10, md: 12 }, // Padding top for navbar + banner
            px: { xs: 2, md: 4 },
            pb: 6
          }}
        >
          <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            <Dashboard />
          </Box>
        </Box>

        <Footer />
      </Box>
    </SandboxProvider>
  );
};

export default DemoPage;
