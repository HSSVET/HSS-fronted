import React from 'react';
import { Paper, Box, Typography, Chip, IconButton, useTheme, alpha } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Clinic } from '../services/clinicService';
import { AvatarWithFallback } from './ClinicShared';

interface ClinicTableViewProps {
  clinics: Clinic[];
  onDelete: (id: number) => void;
}

export const ClinicTableView: React.FC<ClinicTableViewProps> = ({ clinics, onDelete }) => {
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: 'clinicId',
      headerName: 'ID',
      width: 60,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
          #{params.value}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Clinic Info',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
          <AvatarWithFallback name={params.value as string} size={40} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {params.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {params.row.slug ? `${params.row.slug}.hss.com` : 'No custom domain'}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'contact',
      headerName: 'Contact',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body2" sx={{ color: '#334155' }}>{params.row.email || '—'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{params.row.phone || '—'}</Typography>
        </Box>
      )
    },
    {
      field: 'licenseType',
      headerName: 'Plan',
      width: 140,
      renderCell: (params: GridRenderCellParams) => {
        const plans = {
          STRT: { label: 'Starter', color: 'info' },
          PRO: { label: 'Professional', color: 'primary' },
          ENT: { label: 'Enterprise', color: 'secondary' }
        };
        const config = plans[params.value as keyof typeof plans] || { label: params.value || 'No Plan', color: 'default' };
        return <Chip label={config.label} size="small" color={config.color as any} sx={{ fontWeight: 600, borderRadius: 1.5 }} />
      }
    },
    {
      field: 'address',
      headerName: 'Location',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {params.value || 'No address provided'}
        </Typography>
      )
    },
    {
      field: 'licenseStatus',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const isActive = params.value === 'ACTIVE';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8, height: 8, borderRadius: '50%',
                bgcolor: isActive ? 'success.main' : 'error.main',
                boxShadow: `0 0 0 4px ${alpha(isActive ? theme.palette.success.main : theme.palette.error.main, 0.1)}`
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500, color: isActive ? 'success.main' : 'error.main' }}>
              {isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: 'Oluşturulma Tarihi',
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return <Typography variant="body2" color="text.secondary">—</Typography>;
        const date = new Date(params.value);
        return (
          <Typography variant="body2" sx={{ color: '#475569' }}>
            {date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Typography>
        );
      }
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton color="error" size="small" onClick={() => onDelete(params.row.clinicId)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      elevation={0}
      sx={{
        height: 600,
        width: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: '#e2e8f0',
        overflow: 'hidden',
        bgcolor: '#fff'
      }}
    >
      <DataGrid
        rows={clinics}
        columns={columns}
        getRowId={(row: Clinic) => row.clinicId}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        rowHeight={72}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8fafc',
            color: '#64748b',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: '1px solid #e2e8f0'
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid #f1f5f9',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#f8fafc'
            }
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e2e8f0'
          }
        }}
      />
    </Paper>
  );
};
