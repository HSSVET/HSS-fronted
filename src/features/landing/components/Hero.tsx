import React from 'react';
import { Box, Button, Container, Grid, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// @ts-ignore
import heroImage from '../../../assets/images/anding-hero-v2.png';

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 15, md: 20 },
        pb: { xs: 10, md: 15 },
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #E8F5E9 100%)`,
      }}
    >
      {/* Abstract Background Shapes */}
      <Box
        component={motion.div}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(146, 167, 140, 0.2) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  mb: 2,
                  display: 'block',
                }}
              >
                Yeni Nesil Veterinerlik Hizmeti
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  lineHeight: 1.1,
                  mb: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Kliniğinizi <span style={{ color: theme.palette.secondary.main }}>Sevgi</span> & Zeka ile Yönetin
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 5, lineHeight: 1.6, maxWidth: '600px' }}
              >
                Veteriner kliniğiniz için tasarlanmış kapsamlı, bulut tabanlı bir platform.
                Randevulardan tıbbi kayıtlara kadar her detayı biz halledelim, siz iyileştirmeye odaklanın.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.location.href = '/register'}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 20px rgba(146, 167, 140, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 24px rgba(146, 167, 140, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Ücretsiz Dene
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.location.href = '/demo'}
                  startIcon={<PlayCircleOutlineIcon />}
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Demoyu İzle
                </Button>
              </Box>

              <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                {[
                  { label: 'Aktif Klinik', value: '500+' },
                  { label: 'Tedavi Edilen Patiler', value: '50k+' },
                  { label: 'Kullanıcı Puanı', value: '4.9/5' },
                ].map((stat, index) => (
                  <Box key={index}>
                    <Typography variant="h4" fontWeight="800" color="primary.dark">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative' }}
            >
              {/* Image Container with Glow */}
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -20,
                    background: 'radial-gradient(circle, rgba(146, 167, 140, 0.4) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: -1,
                    filter: 'blur(20px)',
                  }
                }}
              >
                <img
                  src={heroImage}
                  alt="Veterinary System 3D Illustration"
                  style={{
                    width: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))',
                    borderRadius: '20px', // Fallback if image has corners
                  }}
                />
              </Box>

              {/* Floating Cards Over Image - Decorative */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '-5%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '15px 25px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  zIndex: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">Appointments</Typography>
                <Typography variant="caption" color="success.main">● Upcoming: 12</Typography>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
                style={{
                  position: 'absolute',
                  bottom: '20%',
                  right: '-5%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '15px 25px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  zIndex: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">Analytics</Typography>
                <Typography variant="caption" color="primary.main">↗ +24% Growth</Typography>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
