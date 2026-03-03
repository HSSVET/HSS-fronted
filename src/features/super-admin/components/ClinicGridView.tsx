import React from 'react';
import { Grid, Card, CardContent, Box, IconButton, Typography, Chip } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Clinic } from '../services/clinicService';
import { AvatarWithFallback } from './ClinicShared';

interface ClinicGridViewProps {
  clinics: Clinic[];
  onDelete: (id: number) => void;
}

export const ClinicGridView: React.FC<ClinicGridViewProps> = ({ clinics, onDelete }) => {
  return (
    <Grid spacing={3} container component={motion.div} initial="hidden" animate="visible" variants={{
      visible: { transition: { staggerChildren: 0.1 } }
    }}>
      <AnimatePresence>
        {clinics.map((clinic) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={clinic.clinicId}>
            <ClinicCard clinic={clinic} onDelete={onDelete} />
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  );
};

const ClinicCard: React.FC<{ clinic: Clinic; onDelete: (id: number) => void }> = ({ clinic, onDelete }) => {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      layout
    >
      <Card elevation={0} sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.06)', borderColor: '#cbd5e1' }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <AvatarWithFallback name={clinic.name} size={48} />
            <IconButton size="small" onClick={() => onDelete(clinic.clinicId)}>
              <MoreVertIcon fontSize="small" sx={{ color: '#94a3b8' }} />
            </IconButton>
          </Box>

          <Typography variant="h6" fontWeight={700} noWrap gutterBottom sx={{ color: '#0f172a' }}>
            {clinic.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip label={clinic.licenseType} size="small" sx={{ fontWeight: 600, bgcolor: '#f1f5f9', color: '#475569' }} />
            <Chip
              label={clinic.licenseStatus === 'ACTIVE' ? 'Active' : 'Offline'}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: clinic.licenseStatus === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                color: clinic.licenseStatus === 'ACTIVE' ? '#16a34a' : '#ef4444'
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#64748b' }}>
            <span style={{ marginRight: 8, opacity: 0.5 }}>✉️</span> {clinic.email || '—'}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <span style={{ marginRight: 8, opacity: 0.5 }}>📞</span> {clinic.phone || '—'}
          </Typography>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9' }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#94a3b8', display: 'block', textAlign: 'center', bgcolor: '#f8fafc', py: 0.5, borderRadius: 1 }}>
              {clinic.slug ? `${clinic.slug}.hss.com` : 'No custom domain'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
