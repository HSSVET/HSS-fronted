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
import { DataGrid, GridColDef, GridToolbar, GridRenderCellParams } from '@mui/x-data-grid';
import { motion, AnimatePresence } from 'framer-motion';
import { getClinics, createClinic, deleteClinic, Clinic, ClinicCreateRequest } from './services/clinicService';

const ClinicsPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    setFetchLoading(true);
    setError(null);
    try {
      const data = await getClinics();
      console.log('📊 Clinics API response:', data);
      setClinics(data.content || data || []);
    } catch (error) {
      console.error('❌ Error fetching clinics:', error);
      setError('Klinikler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setFetchLoading(false);
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
      renderCell: (params: GridRenderCellParams) => (
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
      renderCell: (params: GridRenderCellParams) => {
        const colors: Record<string, string> = { STRT: 'info', PRO: 'primary', ENT: 'secondary' };
        const color = colors[params.value as string] || 'default';
        return <Chip label={params.value as string} size="small" color={color as any} sx={{ fontWeight: 'bold' }} />
      }
    },
    {
      field: 'licenseStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          icon={params.value === 'ACTIVE' ? <ActiveIcon sx={{ fontSize: 16 }} /> : <InactiveIcon sx={{ fontSize: 16 }} />}
          label={params.value as string}
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
      renderCell: (params: GridRenderCellParams) => (
        <IconButton color="error" size="small" onClick={() => handleDelete(params.row.clinicId)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
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
          p: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              mb: 1,
              letterSpacing: '-0.02em'
            }}
          >
            Klinik Yönetimi
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.6)', fontWeight: 500 }}>
            {fetchLoading ? 'Yükleniyor...' : `${clinics.length} Aktif Klinik`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              display: 'flex', 
              border: '1px solid rgba(0, 0, 0, 0.08)', 
              borderRadius: '12px', 
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <IconButton
              onClick={() => setViewMode('table')}
              sx={{
                borderRadius: 0,
                px: 2,
                bgcolor: viewMode === 'table' ? 'rgba(102, 126, 234, 0.12)' : 'transparent',
                color: viewMode === 'table' ? '#667eea' : 'rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: viewMode === 'table' ? 'rgba(102, 126, 234, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListViewIcon />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('grid')}
              sx={{
                borderRadius: 0,
                px: 2,
                bgcolor: viewMode === 'grid' ? 'rgba(102, 126, 234, 0.12)' : 'transparent',
                color: viewMode === 'grid' ? '#667eea' : 'rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: viewMode === 'grid' ? 'rgba(102, 126, 234, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                }
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
              borderRadius: '12px',
              px: 3,
              py: 1.25,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
              '&:active': {
                transform: 'translateY(0)',
              }
            }}
          >
            Yeni Klinik Ekle
          </Button>
        </Box>
      </Box>

      {/* Content View */}
      {error && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: '16px',
            border: '1px solid rgba(211, 47, 47, 0.2)',
            bgcolor: 'rgba(255, 245, 245, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography color="error.main" fontWeight={500}>
            {error}
          </Typography>
          <Button 
            size="small" 
            onClick={fetchClinics} 
            sx={{ mt: 1 }}
          >
            Yeniden Dene
          </Button>
        </Paper>
      )}

      {fetchLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={48} sx={{ color: '#667eea' }} />
        </Box>
      ) : viewMode === 'table' ? (
        <Paper
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          elevation={0}
          sx={{
            height: 600,
            width: '100%',
            borderRadius: '20px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <DataGrid
            rows={clinics}
            columns={columns}
            getRowId={(row: Clinic) => row.clinicId}
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
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
              },
              '& .MuiDataGrid-row': {
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                  transform: 'scale(1.001)',
                }
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              },
              '& .MuiCheckbox-root': {
                color: '#667eea',
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
        PaperComponent={(props) => <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><Paper {...props} sx={{ borderRadius: '24px', overflow: 'hidden' }} /></motion.div>}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)', pb: 2.5, pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              <ClinicIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Yeni Klinik Ekle</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                HSS Ağına yeni klinik kaydı
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, px: 3 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              autoFocus
              label="Klinik Adı"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: '2px',
                  },
                }
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="E-posta"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: 'rgba(255, 255, 255, 0.6)',
                  }
                }}
              />
              <TextField
                label="Telefon"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: 'rgba(255, 255, 255, 0.6)',
                  }
                }}
              />
            </Box>
            <TextField
              label="Adres"
              fullWidth
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                }
              }}
            />
            <TextField
              select
              label="Paket Planı"
              fullWidth
              value={formData.licenseType || 'STRT'}
              onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
              SelectProps={{ native: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                }
              }}
            >
              <option value="STRT">Başlangıç (STRT)</option>
              <option value="PRO">Profesyonel (PRO)</option>
              <option value="ENT">Kurumsal (ENT)</option>
            </TextField>

            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2.5, 
                bgcolor: 'rgba(102, 126, 234, 0.04)',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: '#667eea', mb: 2 }}>
                Otomatik Yönetici Hesabı
              </Typography>
              <TextField
                margin="dense"
                label="Yönetici E-posta"
                fullWidth
                size="small"
                type="email"
                value={formData.adminEmail || ''}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                helperText="Varsayılan şifre: Admin123!"
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  margin="dense"
                  label="Ad"
                  fullWidth
                  size="small"
                  value={formData.adminFirstName || ''}
                  onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    }
                  }}
                />
                <TextField
                  margin="dense"
                  label="Soyad"
                  fullWidth
                  size="small"
                  value={formData.adminLastName || ''}
                  onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    }
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Button 
            onClick={() => setOpen(false)} 
            sx={{ 
              borderRadius: '10px',
              px: 3,
              color: 'rgba(0, 0, 0, 0.6)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={loading || !formData.name}
            sx={{ 
              px: 4, 
              borderRadius: '10px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Klinik Oluştur'}
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
        borderRadius: '20px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          transform: 'translateY(-8px)', 
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
            <AvatarWithFallback name={clinic.name} size={56} />
            <IconButton 
              size="small" 
              onClick={() => onDelete(clinic.clinicId)}
              sx={{
                color: 'rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#d32f2f',
                  bgcolor: 'rgba(211, 47, 47, 0.08)',
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="h6" fontWeight={700} noWrap gutterBottom sx={{ mb: 1.5 }}>
            {clinic.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
            <Chip 
              label={clinic.licenseType} 
              size="small" 
              sx={{
                bgcolor: 'rgba(102, 126, 234, 0.12)',
                color: '#667eea',
                fontWeight: 600,
                border: 'none',
              }}
            />
            <Chip 
              label={clinic.licenseStatus} 
              size="small" 
              sx={{
                bgcolor: clinic.licenseStatus === 'ACTIVE' ? 'rgba(76, 175, 80, 0.12)' : 'rgba(244, 67, 54, 0.12)',
                color: clinic.licenseStatus === 'ACTIVE' ? '#4caf50' : '#f44336',
                fontWeight: 600,
                border: 'none',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.1em' }}>✉️</span> {clinic.email || 'E-posta yok'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.1em' }}>📞</span> {clinic.phone || 'Telefon yok'}
            </Typography>
          </Box>

          <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.4)', fontFamily: 'monospace', fontSize: '0.7rem' }}>
              {clinic.slug}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const AvatarWithFallback: React.FC<{ name: string; size?: number }> = ({ name, size = 32 }) => {
  const initials = name.substring(0, 2).toUpperCase();
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];
  const index = name.charCodeAt(0) % gradients.length;
  
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: size >= 48 ? '16px' : '12px',
        background: gradients[index],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.4,
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
      }}
    >
      {initials}
    </Box>
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
