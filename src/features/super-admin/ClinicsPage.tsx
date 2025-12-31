import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  GridView as GridViewIcon,
  TableRows as ListViewIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Business as ClinicIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { motion, AnimatePresence } from 'framer-motion';
import { getClinics, createClinic, deleteClinic, Clinic, ClinicCreateRequest } from './services/clinicService';

const ClinicsPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const theme = useTheme();

  const [formData, setFormData] = useState<ClinicCreateRequest>({
    name: '',
    address: '',
    phone: '',
    email: '',
    licenseType: 'STRT',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: ''
  });

  const fetchClinics = async () => {
    try {
      const data = await getClinics();
      setClinics(data.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await createClinic(formData);
      setOpen(false);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        licenseType: 'STRT',
        adminEmail: '',
        adminFirstName: '',
        adminLastName: ''
      });
      fetchClinics();
    } catch (error) {
      console.error(error);
      alert('Error creating clinic');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this clinic?')) return;
    try {
      await deleteClinic(id);
      fetchClinics();
    } catch (error) {
      console.error(error);
      alert('Error deleting clinic');
    }
  };

  // --- Columns for DataGrid ---
  const columns: GridColDef[] = [
    { field: 'clinicId', headerName: 'ID', width: 70 },
    {
      field: 'name', headerName: 'Clinic Name', flex: 1, minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AvatarWithFallback name={params.value as string} />
          <Typography variant="body2" fontWeight={500}>{params.value}</Typography>
        </Box>
      )
    },
    { field: 'email', headerName: 'Contact Email', flex: 1, minWidth: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    {
      field: 'licenseType',
      headerName: 'Plan',
      width: 120,
      renderCell: (params) => {
        const colors: Record<string, string> = { STRT: 'info', PRO: 'primary', ENT: 'secondary' };
        const color = colors[params.value as string] || 'default';
        return <Chip label={params.value} size="small" color={color as any} sx={{ fontWeight: 'bold' }} />
      }
    },
    {
      field: 'licenseStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'ACTIVE' ? <ActiveIcon sx={{ fontSize: 16 }} /> : <InactiveIcon sx={{ fontSize: 16 }} />}
          label={params.value}
          size="small"
          color={params.value === 'ACTIVE' ? 'success' : 'error'}
          variant="outlined"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton color="error" size="small" onClick={() => handleDelete(params.row.clinicId)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manage Clinics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {clinics.length} Active Clinics inside HSS Network
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
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
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
              boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            Add Clinic
          </Button>
        </Box>
      </Box>

      {/* Content View */}
      {viewMode === 'table' ? (
        <Paper
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          elevation={0}
          sx={{
            height: 600,
            width: '100%',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <DataGrid
            rows={clinics}
            columns={columns}
            getRowId={(row) => row.clinicId}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#f8f9fa',
                color: 'text.primary',
                fontWeight: 700
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.04)
              }
            }}
          />
        </Paper>
      ) : (
        <Grid spacing={3} container component={motion.div} initial="hidden" animate="visible" variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}>
          <AnimatePresence>
            {clinics.map((clinic) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={clinic.clinicId}>
                <ClinicCard clinic={clinic} onDelete={handleDelete} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperComponent={(props) => <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><Paper {...props} sx={{ borderRadius: 3 }} /></motion.div>}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClinicIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>Add New Clinic</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              label="Clinic Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Box>
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <TextField
              select
              label="Package Plan"
              fullWidth
              value={formData.licenseType || 'STRT'}
              onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="STRT">Starter (STRT)</option>
              <option value="PRO">Professional (PRO)</option>
              <option value="ENT">Enterprise (ENT)</option>
            </TextField>

            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary">
                Initial Administrator (Auto-Provision)
              </Typography>
              <TextField
                margin="dense"
                label="Admin Email"
                fullWidth
                size="small"
                value={formData.adminEmail || ''}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                helperText="Password will defaults to 'Admin123!'"
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <TextField
                  margin="dense"
                  label="First Name"
                  fullWidth
                  size="small"
                  value={formData.adminFirstName || ''}
                  onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  fullWidth
                  size="small"
                  value={formData.adminLastName || ''}
                  onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })}
                />
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={loading}
            sx={{ px: 4, borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Clinic'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// --- Sub-components ---

const ClinicCard: React.FC<{ clinic: Clinic; onDelete: (id: number) => void }> = ({ clinic, onDelete }) => {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      layout
    >
      <Card elevation={0} sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <AvatarWithFallback name={clinic.name} size={48} />
            <IconButton size="small" onClick={() => onDelete(clinic.clinicId)}>
              <DeleteIcon fontSize="small" color="disabled" />
            </IconButton>
          </Box>

          <Typography variant="h6" fontWeight={600} noWrap gutterBottom>
            {clinic.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={clinic.licenseType} size="small" color="primary" variant="outlined" />
            <Chip label={clinic.licenseStatus} size="small" color={clinic.licenseStatus === 'ACTIVE' ? 'success' : 'error'} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            ✉️ {clinic.email || 'No email'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📞 {clinic.phone || 'No phone'}
          </Typography>

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
              {clinic.slug}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const AvatarWithFallback: React.FC<{ name: string; size?: number }> = ({ name, size = 32 }) => {
  const color = stringToColor(name);
  return (
    <React.Fragment>
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: size * 0.4
        }}
      >
        {name.substring(0, 2).toUpperCase()}
      </Box>
    </React.Fragment>
  )
}

function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
}

export default ClinicsPage;
