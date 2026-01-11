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
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import OwnerForm from '../components/OwnerForm'; // We will update this later

// Mock data (replace with API call)
const MOCK_OWNERS = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', phone: '5551234567', email: 'ahmet@example.com', type: 'INDIVIDUAL' },
  { id: 2, firstName: '', lastName: '', corporateName: 'Veteriner Kliniği A.Ş.', phone: '5329876543', email: 'info@vet.com', type: 'CORPORATE' },
];

const OwnerPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);

  // TODO: Use React Query to fetch owners
  const owners = MOCK_OWNERS;

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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Müşteri Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
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

      {/* Owners Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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
              {owners.map((owner) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={owner.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(owner.id)}
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
                      <IconButton size="small" onClick={() => handleRowClick(owner.id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={owners.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default OwnerPage;
