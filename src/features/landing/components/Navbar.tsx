import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';

const Navbar = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']
  );

  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(10px)']
  );

  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ['none', '0 4px 6px -1px rgba(0, 0, 0, 0.1)']
  );

  return (
    <motion.header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor,
        backdropFilter,
        boxShadow,
      }}
      className="transition-all duration-300"
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <PetsIcon />
            </Box>
            <Typography variant="h5" fontWeight="700" color="primary.dark">
              HSS
            </Typography>
          </Box>

          {/* Desktop Nav */}
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography
              component={motion.a}
              href="/"
              whileHover={{ scale: 1.05 }}
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Özellikler
            </Typography>
            <Typography
              component={motion.a}
              href="/products"
              whileHover={{ scale: 1.05 }}
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Çözümler
            </Typography>
            <Typography
              component={motion.a}
              href="#"
              whileHover={{ scale: 1.05 }}
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Fiyatlandırma
            </Typography>
            <Typography
              component={motion.a}
              href="/about"
              whileHover={{ scale: 1.05 }}
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Hakkımızda
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ fontWeight: 600 }}
            >
              Giriş Yap
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/register')}
              sx={{
                borderRadius: '20px',
                px: 3,
                boxShadow: '0 4px 14px 0 rgba(146, 167, 140, 0.39)',
              }}
            >
              Hemen Başla
            </Button>
          </Stack>
        </Box>
      </Container>
    </motion.header>
  );
};

export default Navbar;
