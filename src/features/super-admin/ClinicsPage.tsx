import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  GridView as GridViewIcon,
  TableRows as ListViewIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Storefront as StorefrontIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Hooks
import { useClinics } from './hooks/useClinics';

// Components
import { StatCard } from './components/ClinicStatCards';
import { ClinicTableView } from './components/ClinicTableView';
import { ClinicGridView } from './components/ClinicGridView';
import { ProvisionClinicModal } from './components/ProvisionClinicModal';

const ClinicsPage: React.FC = () => {
  const theme = useTheme();

  // SRP: All state and logic extracted to custom hook
  const {
    clinics,
    filteredClinics,
    loading,
    modalOpen,
    searchQuery,
    statusFilter,
    planFilter,
    viewMode,
    formData,
    setModalOpen,
    setSearchQuery,
    setStatusFilter,
    setPlanFilter,
    setViewMode,
    setFormData,
    handleCreateClinic,
    handleDeleteClinic
  } = useClinics();

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 1 }}>
      {/* Header & Metrics */}
      <Box component={motion.div} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Network Overview
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
          Monitor and manage all tenant clinics connected to the HSS platform.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              title="Total Clinics"
              value={clinics.length}
              icon={<StorefrontIcon fontSize="large" />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              title="Active Subscriptions"
              value={clinics.filter(c => c.licenseStatus === 'ACTIVE').length}
              icon={<ActiveIcon fontSize="large" />}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              title="Premium Tenants"
              value={clinics.filter(c => ['PRO', 'ENT'].includes(c.licenseType)).length}
              icon={<StarIcon fontSize="large" />}
              color={theme.palette.warning.main}
              suffix="PRO/ENT"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Toolbar */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <TextField
          placeholder="Search clinics by name or email..."
          size="small"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
            sx: { borderRadius: 2, width: { xs: '100%', sm: 300 }, bgcolor: '#fff' }
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
          <FormControl size="small" sx={{ minWidth: 140, bgcolor: '#fff', borderRadius: 2 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, bgcolor: '#fff', borderRadius: 2 }}>
            <Select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="ALL">All Plans</MenuItem>
              <MenuItem value="STRT">Starter</MenuItem>
              <MenuItem value="PRO">Professional</MenuItem>
              <MenuItem value="ENT">Enterprise</MenuItem>
              <MenuItem value="NONE">No Plan</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
          <Paper elevation={0} sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <IconButton
              onClick={() => setViewMode('table')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: viewMode === 'table' ? 'primary.main' : 'text.secondary'
              }}
            >
              <ListViewIcon />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('grid')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: viewMode === 'grid' ? 'primary.main' : 'text.secondary'
              }}
            >
              <GridViewIcon />
            </IconButton>
          </Paper>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #0ea5e9 0%, #2563eb 100%)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)' }
            }}
          >
            Provision Clinic
          </Button>
        </Box>
      </Box>

      {/* Content View */}
      {viewMode === 'table' ? (
        <ClinicTableView clinics={filteredClinics} onDelete={handleDeleteClinic} />
      ) : (
        <ClinicGridView clinics={filteredClinics} onDelete={handleDeleteClinic} />
      )}

      {/* Create Dialog (Provisioning Workflow) */}
      <ProvisionClinicModal
        open={modalOpen}
        loading={loading}
        formData={formData}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateClinic}
        onChange={setFormData}
      />
    </Box>
  );
};

export default ClinicsPage;
