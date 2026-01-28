import React from 'react';
import { Box, Container, Grid, Typography, Stack, Card, useTheme, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupsIcon from '@mui/icons-material/Groups';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShieldCheckIcon from '@mui/icons-material/Shield';

const AboutPage = () => {
  const theme = useTheme();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 15, md: 20 },
          pb: { xs: 10, md: 15 },
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #E8F5E9 100%)`,
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
            >
              Hakkımızda
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mt: 2,
                mb: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Hayvan Sağlığında <span style={{ color: theme.palette.secondary.main }}>Dijital</span> Dönüşüm
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
            >
              HSS, veteriner hekimlerin iş süreçlerini kolaylaştırmak ve hastalarına daha iyi hizmet vermelerini sağlamak amacıyla yola çıkmış, teknoloji odaklı bir sağlık yönetim sistemidir.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Intro Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <Typography variant="h3" fontWeight="700" gutterBottom color="primary.dark">
                Biz Kimiz?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                HSS (Hayvan Sağlık Sistemi), veteriner kliniği yönetimini modern çağın gereksinimlerine göre yeniden tanımlıyor. Deneyimli yazılımcılar ve sektör uzmanlarından oluşan ekibimizle, klinikler için sadece bir yazılım değil, bir iş ortağı sunuyoruz.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Bulut tabanlı altyapımız, her yerden erişim, yüksek güvenlik ve kullanıcı dostu arayüzümüzle veteriner hekimlerin idari işlere değil, "patili dostlarımıza" odaklanmasını sağlıyoruz.
              </Typography>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '80%',
                  height: '80%',
                  bgcolor: 'secondary.light',
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                  opacity: 0.3,
                  zIndex: -1,
                  filter: 'blur(40px)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 280, md: 400 },
                  height: { xs: 280, md: 400 },
                  bgcolor: 'primary.main',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              >
                <GroupsIcon sx={{ fontSize: 150, color: 'white' }} />
              </Avatar>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Mission & Vision */}
      <Box sx={{ bgcolor: '#F5F9F5', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                sx={{
                  p: 6,
                  height: '100%',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-10px)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'secondary.main', mb: 2 }}>
                  <RocketLaunchIcon />
                </Avatar>
                <Typography variant="h4" fontWeight="700">Misyonumuz</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  En ileri teknolojiyi veteriner hekimlerimizin hizmetine sunarak, klinik yönetimini kusursuzlaştırmak ve hayvan sağlığı standartlarını yukarı çekmek.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                sx={{
                  p: 6,
                  height: '100%',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-10px)' }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                  <VisibilityIcon />
                </Avatar>
                <Typography variant="h4" fontWeight="700">Vizyonumuz</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  Türkiye ve dünyada veteriner kliniği yönetiminde standartları belirleyen, yenilikçi ve güvenilir bir ekosistem haline gelmek.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={10}>
          <Typography variant="h3" fontWeight="800" gutterBottom>Değerlerimiz</Typography>
          <Typography variant="h6" color="text.secondary">HSS'yi biz yapan temel prensipler</Typography>
        </Box>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {[
              { title: 'Yenilikçilik', desc: 'Sürekli gelişen teknolojiye adapte oluyor, en yeni çözümleri sunuyoruz.', icon: <LightbulbIcon />, color: '#F7CD82' },
              { title: 'Güvenilirlik', desc: 'Verileriniz bizimle güvende. Bulut altyapımızla 7/24 kesintisizlik sağlıyoruz.', icon: <ShieldCheckIcon />, color: '#92A78C' },
              { title: 'Kullanıcı Odaklılık', desc: 'Veteriner hekimlerin ihtiyaçlarını dinliyor, onlara göre geliştirme yapıyoruz.', icon: <FavoriteIcon />, color: '#D5AE60' }
            ].map((value, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <motion.div variants={fadeInUp}>
                  <Stack alignItems="center" spacing={3} sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '24px',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: value.color,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        fontSize: '2rem'
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography variant="h5" fontWeight="700">{value.title}</Typography>
                    <Typography color="text.secondary">{value.desc}</Typography>
                  </Stack>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <Footer />
    </Box>
  );
};

export default AboutPage;
