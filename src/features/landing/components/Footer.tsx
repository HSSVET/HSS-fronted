import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PetsIcon from '@mui/icons-material/Pets';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: 'white', pt: 10, pb: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={8} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PetsIcon sx={{ color: 'primary.main', fontSize: 30 }} />
              <Typography variant="h5" fontWeight="bold">
                HSS
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 300 }}>
              Modern veteriner klinikleri için eksiksiz işletim sistemi. Daha iyi bakım, daha iyi iş yönetimi.
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Ürün
            </Typography>
            <Stack spacing={2}>
              {['Özellikler', 'Fiyatlandırma', 'Entegrasyonlar', 'Güncellemeler'].map((item) => (
                <Link key={item} href="#" color="inherit" sx={{ opacity: 0.7, textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Şirket
            </Typography>
            <Stack spacing={2}>
              <Link href="/about" color="inherit" sx={{ opacity: 0.7, textDecoration: 'none', '&:hover': { opacity: 1 } }}>Hakkımızda</Link>
              <Link href="#" color="inherit" sx={{ opacity: 0.7, textDecoration: 'none', '&:hover': { opacity: 1 } }}>Kariyer</Link>
              <Link href="#" color="inherit" sx={{ opacity: 0.7, textDecoration: 'none', '&:hover': { opacity: 1 } }}>İletişim</Link>
              <Link href="#" color="inherit" sx={{ opacity: 0.7, textDecoration: 'none', '&:hover': { opacity: 1 } }}>Partnerler</Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Bülten
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              En son güncellemeleri ve sektör haberlerini almak için abone olun.
            </Typography>
            {/* Simple input field here could be added */}
          </Grid>
        </Grid>

        <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} HSS A.Ş. Tüm hakları saklıdır.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', opacity: 0.5, textDecoration: 'none' }}>Gizlilik Politikası</Link>
            <Link href="#" color="inherit" sx={{ fontSize: '0.875rem', opacity: 0.5, textDecoration: 'none' }}>Kullanım Şartları</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
