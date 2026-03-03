import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Business as ClinicIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Cached as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ClinicCreateRequest } from '../services/clinicService';

interface ProvisionClinicModalProps {
  open: boolean;
  loading: boolean;
  formData: ClinicCreateRequest;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (data: ClinicCreateRequest) => void;
}

const AnimatedPaper = React.forwardRef<HTMLDivElement, any>((props, ref) => (
  <motion.div
    ref={ref}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
  >
    <Paper {...props} sx={{ borderRadius: 4, boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }} />
  </motion.div>
));

export const ProvisionClinicModal: React.FC<ProvisionClinicModalProps> = ({
  open,
  loading,
  formData,
  onClose,
  onSubmit,
  onChange
}) => {

  const toEnglishChars = (str: string) => {
    return str
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C')
      .replace(/[^a-zA-Z0-9\s.,@_+-]/g, '');
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onChange({ ...formData, adminPassword: password });
  };

  React.useEffect(() => {
    if (open && !formData.adminPassword) {
      generatePassword();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperComponent={AnimatedPaper}
    >
      <DialogTitle sx={{ p: 4, pb: 2, borderBottom: '1px solid #f1f5f9' }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>Provision New Tenant</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.9rem' }}>
          Create a new isolated clinic workspace and assign the initial administrator.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, pt: 1 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 1 }}>

          {/* Section 1: General Info */}
          <Box>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
              <ClinicIcon fontSize="small" sx={{ color: '#3b82f6' }} /> Clinic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Clinic Name"
                  placeholder="e.g. Acme Veterinary"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => onChange({ ...formData, name: toEnglishChars(e.target.value) })}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="URL Slug (Optional)"
                  placeholder="e.g. acmevet"
                  fullWidth
                  value={formData.slug || ''}
                  onChange={(e) => onChange({ ...formData, slug: toEnglishChars(e.target.value).toLowerCase() })}
                  variant="outlined"
                  helperText="Leave empty to auto-generate"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Contact Email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => onChange({ ...formData, email: toEnglishChars(e.target.value) })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => onChange({ ...formData, phone: toEnglishChars(e.target.value) })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Physical Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => onChange({ ...formData, address: toEnglishChars(e.target.value) })}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: '#f1f5f9' }} />

          {/* Section 2: Plan & Subscription */}
          <Box>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
              <PaymentIcon fontSize="small" sx={{ color: '#3b82f6' }} /> Subscription Plan
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="Select Tier"
                  fullWidth
                  value={formData.licenseType || 'STRT'}
                  onChange={(e) => onChange({ ...formData, licenseType: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="STRT">Starter (STRT) - Up to 5 users</option>
                  <option value="PRO">Professional (PRO) - Unlimited</option>
                  <option value="ENT">Enterprise (ENT) - Dedicated Support</option>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: '#f1f5f9' }} />

          {/* Section 3: Super Admin */}
          <Box>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
              <PersonIcon fontSize="small" sx={{ color: '#3b82f6' }} /> Initial Administrator
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This user will be granted the 'OWNER' role and acts as the root administrator for this tenant.
              An automatic welcome email will be dispatched.
            </Typography>

            <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.01)' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Admin Email Address"
                    fullWidth
                    required
                    value={formData.adminEmail || ''}
                    onChange={(e) => onChange({ ...formData, adminEmail: toEnglishChars(e.target.value) })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Initial Password"
                    fullWidth
                    required
                    value={formData.adminPassword || ''}
                    onChange={(e) => onChange({ ...formData, adminPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={generatePassword} edge="end" color="primary">
                            <RefreshIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Please share this securely with the user."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="First Name"
                    fullWidth
                    required
                    value={formData.adminFirstName || ''}
                    onChange={(e) => onChange({ ...formData, adminFirstName: toEnglishChars(e.target.value) })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    required
                    value={formData.adminLastName || ''}
                    onChange={(e) => onChange({ ...formData, adminLastName: toEnglishChars(e.target.value) })}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>

        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #f1f5f9', bgcolor: '#ffffff' }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600, px: 3 }}>Cancel</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.adminEmail}
          sx={{
            px: 4,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: '#3b82f6',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            '&:hover': {
              bgcolor: '#2563eb',
              boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Provision Clinic'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
