import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F9F9F9' }}>
      <AppBar position="static" color="secondary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            HSS - Müşteri Portalı
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Hoşgeldiniz, {state.user?.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#e0e0e0' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} HSS Veteriner Sistemleri
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLayout;
