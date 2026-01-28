import React from 'react';
import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Mock product data - in a real app this might come from a CMS or API
const products = [
  {
    id: 'clinical',
    title: 'Clinical Management',
    description: 'Complete suite for veterinary medical records, from exams to surgeries.',
    features: ['Electronic Medical Records (EMR)', 'Surgery Tracking', 'Hospitalization Logs', 'Vaccination Reminders'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', // Placeholder
    color: '#92A78C'
  },
  {
    id: 'lab',
    title: 'Laboratory System',
    description: 'Integrated lab management for tracking tests, samples, and results.',
    features: ['Test Order Management', 'Result Attachments', 'Automated Reference Ranges', 'External Lab Integration'],
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80', // Placeholder
    color: '#45B7D1'
  },
  {
    id: 'financial',
    title: 'Financial & Billing',
    description: 'Streamlined invoicing, payments, and expense tracking.',
    features: ['Automated Invoicing', 'Payment Processing', 'Expense Reports', 'Revenue Analytics'],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80', // Placeholder
    color: '#F7CD82'
  },
  {
    id: 'crm',
    title: 'Client Relationships',
    description: 'Tools to keep pet owners engaged and informed.',
    features: ['Appointment Scheduling', 'SMS/Email Reminders', 'Client Portal', 'Feedback Collection'],
    image: 'https://images.unsplash.com/photo-1551730459-92db2a308d6b?auto=format&fit=crop&w=800&q=80', // Placeholder
    color: '#FF6B6B'
  }
];

const ProductsPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      {/* Hero Header */}
      <Box sx={{ pt: 20, pb: 10, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1.5}>
              Çözümlerimiz
            </Typography>
            <Typography variant="h2" fontWeight="800" sx={{ mb: 3 }}>
              Her İhtiyaç İçin Güçlü Modüller
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              HSS modüler bir yapıya sahiptir. İhtiyacınız olanı bugünden seçin, kliniğiniz büyüdükçe genişletin.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Products List */}
      <Container maxWidth="xl" sx={{ pb: 15 }}>
        <Stack spacing={10}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <Grid container spacing={6} alignItems="center" direction={index % 2 === 1 ? 'row-reverse' : 'row'}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        bgcolor: product.color,
                        opacity: 0.1,
                        zIndex: 1,
                      }
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ width: '100%', height: 'auto', display: 'block', minHeight: '300px', objectFit: 'cover' }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: product.color }}>
                      {product.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph>
                      {product.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      {product.features.map((feature) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={feature}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CheckCircleIcon sx={{ color: product.color }} fontSize="small" />
                            <Typography variant="body1" fontWeight="500">
                              {feature}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => window.location.href = '/register'}
                      sx={{
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: product.color,
                        color: product.color,
                        '&:hover': {
                          borderColor: product.color,
                          bgcolor: `${product.color}10`,
                        }
                      }}
                    >
                      Daha Fazla Bilgi
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          ))}
        </Stack>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Kliniğinizi Dönüştürmeye Hazır mısınız?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            HSS ile çalışan yüzlerce modern veteriner kliniğine katılın.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/register'}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              borderRadius: 8,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Hemen Başlayın
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

// Helper for Stack since it was missing from imports in my quick scan, but better to import it


export default ProductsPage;
