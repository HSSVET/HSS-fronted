import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OwnerForm from '../components/OwnerForm';
import { ownerService, Owner } from '../../../services/ownerService';
import { useUIStore } from '../../../stores/uiStore';
import type { ApiResponse } from '../../../types/common';

const OwnerPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError, showConfirmDialog } = useUIStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<any | undefined>(undefined);

  // Fetch Owners
  const { data: ownersData, isLoading, error } = useQuery({
    queryKey: ['owners', page, rowsPerPage],
    queryFn: () => ownerService.getAllOwners(page, rowsPerPage),
    placeholderData: (previousData) => previousData,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => ownerService.createOwner(data),
    onSuccess: (response: ApiResponse<Owner>) => {
      if (response.success) {
        showSuccess('Müşteri başarıyla oluşturuldu');
        setOpenForm(false);
        queryClient.invalidateQueries({ queryKey: ['owners'] });
      } else {
        showError(response.error || 'Oluşturma başarısız');
      }
    },
    onError: () => {
      showError('Bir hata oluştu');
    }
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number, formData: any }) => ownerService.updateOwner(data.id, data.formData),
    onSuccess: (response: ApiResponse<Owner>) => {
      if (response.success) {
        showSuccess('Müşteri başarıyla güncellendi');
        setOpenForm(false);
        setSelectedOwner(undefined);
        queryClient.invalidateQueries({ queryKey: ['owners'] });
      } else {
        showError(response.error || 'Güncelleme başarısız');
      }
    },
    onError: () => {
      showError('Bir hata oluştu');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => ownerService.deleteOwner(id),
    onSuccess: (response: ApiResponse<void>) => {
      // Check for 204 No Content which might come as empty success or specific status
      // The service returns ApiResponse<void> possibly with success:true
      if (response.success || response.status === 204) {
        showSuccess('Müşteri başarıyla silindi');
        queryClient.invalidateQueries({ queryKey: ['owners'] });
      } else {
        showError(response.error || 'Silme işlemi başarısız');
      }
    },
    onError: () => {
      showError('Bir hata oluştu');
    }
  });

  const owners = ownersData?.success ? ownersData.data.items : [];
  const totalElements = ownersData?.success ? ownersData.data.total : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (id: number) => {
    navigate(`${id}`);
  };

  const handleAddClick = () => {
    setSelectedOwner(undefined);
    setOpenForm(true);
  };

  const handleEditClick = (e: React.MouseEvent, owner: Owner) => {
    e.stopPropagation();
    // Convert owner to form data format if needed, mostly matching
    setSelectedOwner(owner);
    setOpenForm(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    showConfirmDialog({
      title: 'Müşteriyi Sil',
      message: 'Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      onConfirm: () => {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleFormSubmit = (formData: any) => {
    if (selectedOwner) {
      updateMutation.mutate({ id: selectedOwner.ownerId || selectedOwner.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Filter owners locally for now if search API is not fully integrated with pagination
  // ideally we should use the search API
  const filteredOwners = owners.filter((owner: any) =>
    !searchTerm ||
    owner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone?.includes(searchTerm)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Müşteri Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Yeni Müşteri Ekle
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Ad, Soyad, Telefon veya E-posta ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ bgcolor: 'white' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Veriler yüklenirken bir hata oluştu.
        </Alert>
      )}

      {/* Owners Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Ad Soyad / Ünvan</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tip</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Telefon</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>E-Posta</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOwners.map((owner: any) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={owner.ownerId || owner.id}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleRowClick(owner.ownerId || owner.id)}
                    >
                      <TableCell>
                        {owner.type === 'CORPORATE' ? owner.corporateName : `${owner.firstName} ${owner.lastName}`}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={owner.type === 'CORPORATE' ? 'Kurumsal' : 'Bireysel'}
                          color={owner.type === 'CORPORATE' ? 'secondary' : 'primary'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{owner.phone}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell align="right">
                        <Box onClick={(e) => e.stopPropagation()}>
                          <IconButton size="small" onClick={() => handleRowClick(owner.ownerId || owner.id)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => handleEditClick(e, owner)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(e, owner.ownerId || owner.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOwners.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        Müşteri bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Create/Edit Helper Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <OwnerForm
            owner={selectedOwner}
            onSubmit={handleFormSubmit}
            onCancel={() => setOpenForm(false)}
            loading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OwnerPage;
