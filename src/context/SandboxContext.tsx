import React, { createContext, useContext, useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, Typography, IconButton, Stack, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SandboxContextType {
  isDemo: boolean;
  openRegistrationGate: () => void;
  closeRegistrationGate: () => void;
}

const SandboxContext = createContext<SandboxContextType | undefined>(undefined);

export const useSandbox = () => {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error('useSandbox must be used within a SandboxProvider');
  }
  return context;
};

interface SandboxProviderProps {
  children: React.ReactNode;
  isDemo?: boolean;
}

export const SandboxProvider: React.FC<SandboxProviderProps> = ({ children, isDemo = false }) => {
  const [isGateOpen, setIsGateOpen] = useState(false);

  const openRegistrationGate = () => setIsGateOpen(true);
  const closeRegistrationGate = () => setIsGateOpen(false);

  return (
    <SandboxContext.Provider value={{ isDemo, openRegistrationGate, closeRegistrationGate }}>
      {children}
      <RegistrationGate open={isGateOpen} onClose={closeRegistrationGate} />
    </SandboxContext.Provider>
  );
};

export const DemoBanner = () => {
  const { isDemo } = useSandbox();
  const navigate = useNavigate();
  const theme = useTheme();

  if (!isDemo) return null;

  return (
    <Box
      component={motion.div}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      sx={{
        bgcolor: 'secondary.main',
        color: 'common.black',
        py: 1,
        px: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="body2" fontWeight="600">
        🚀 Demo Modundasınız: Veriler tarayıcınızda geçici olarak görüntülenmektedir.
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={() => navigate('/register')}
        sx={{
          bgcolor: 'common.black',
          color: 'common.white',
          '&:hover': { bgcolor: 'grey.900' },
          textTransform: 'none',
          borderRadius: 20,
          px: 3
        }}
      >
        Ücretsiz Hesap Oluştur
      </Button>
    </Box>
  );
};

interface RegistrationGateProps {
  open: boolean;
  onClose: () => void;
}

export const RegistrationGate: React.FC<RegistrationGateProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxWidth: 450,
          backgroundImage: 'none',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorative Circle */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'secondary.light',
            opacity: 0.3
          }}
        />

        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.light',
              color: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              opacity: 0.2
            }}
          >
            {/* Using Box to contain the icon for sizing */}
          </Box>
          {/* Overlay real icon */}
          <Box sx={{ mt: -12, mb: 3 }}>
            <LockIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>

          <Typography variant="h5" fontWeight="800" gutterBottom>
            Bu Özelliği Kullanmak İçin
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Verilerinizi güvenle saklamak ve tüm özellikleri kullanabilmek için ücretsiz hesabınızı oluşturun.
          </Typography>

          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              startIcon={<RocketLaunchIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 8px 16px rgba(146, 167, 140, 0.4)'
              }}
            >
              Hemen Başla (Ücretsiz)
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Zaten hesabım var, giriş yap
            </Button>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};
