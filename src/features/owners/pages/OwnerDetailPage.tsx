import React, { useState, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Person as PersonIcon,
  Pets as PetsIcon,
  AttachMoney as MoneyIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Note as NoteIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ownerService, type OwnerInvoice, type OwnerPayment } from '../../../services/ownerService';
import { animalService, type AnimalRecord } from '../../animals/services/animalService';
import { BillingProvider } from '../../billing/hooks/useBilling';
import { CreatePaymentModal } from '../../billing/components/payments/CreatePaymentModal';
import { useQueryClient } from '@tanstack/react-query';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`owner-tabpanel-${index}`}
      aria-labelledby={`owner-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

type FinancialActivity = {
  type: 'invoice' | 'payment';
  date: string;
  description: string;
  amount: number;
  id: number;
  invoiceNumber?: string;
};

const OwnerDetailPage = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(0);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const ownerId = parseInt(id || '0', 10);

  // Fetch Owner Details
  const { data: ownerWrapper, isLoading: loadingOwner, error: ownerError } = useQuery({
    queryKey: ['owner', ownerId],
    queryFn: () => ownerService.getOwnerById(ownerId),
    enabled: !!ownerId
  });

  // Fetch Financial Summary
  const { data: financialWrapper, isLoading: loadingFin } = useQuery({
    queryKey: ['owner-financial', ownerId],
    queryFn: () => ownerService.getFinancialSummary(ownerId),
    enabled: !!ownerId
  });

  // Fetch pets (animals) for this owner
  const { data: petsWrapper } = useQuery({
    queryKey: ['animals', 'owner', ownerId],
    queryFn: () => animalService.getAnimalsByOwnerId(ownerId.toString()),
    enabled: !!ownerId
  });
  const pets: AnimalRecord[] = petsWrapper?.success && Array.isArray(petsWrapper.data) ? petsWrapper.data : [];

  // Fetch owner invoices and payments for Finans tab
  const { data: invoicesWrapper } = useQuery({
    queryKey: ['owner-invoices', ownerId],
    queryFn: () => ownerService.getInvoicesByOwnerId(ownerId),
    enabled: !!ownerId && value === 2
  });
  const { data: paymentsWrapper } = useQuery({
    queryKey: ['owner-payments', ownerId],
    queryFn: () => ownerService.getPaymentsByOwnerId(ownerId),
    enabled: !!ownerId && value === 2
  });
  const ownerInvoices: OwnerInvoice[] = invoicesWrapper?.success && Array.isArray(invoicesWrapper.data) ? invoicesWrapper.data : [];
  const ownerPayments: OwnerPayment[] = paymentsWrapper?.success && Array.isArray(paymentsWrapper.data) ? paymentsWrapper.data : [];

  const financialActivities = useMemo((): FinancialActivity[] => {
    const list: FinancialActivity[] = [];
    ownerInvoices.forEach((inv) => {
      const invId = inv.id ?? inv.invoiceId ?? 0;
      const date = inv.issueDate ?? inv.date ?? '';
      const amount = Number(inv.total ?? inv.totalAmount ?? inv.amount ?? 0);
      list.push({ type: 'invoice', date, description: `Fatura ${inv.invoiceNumber}`, amount, id: invId, invoiceNumber: inv.invoiceNumber });
    });
    ownerPayments.forEach((pay) => {
      const payId = pay.id ?? pay.paymentId ?? 0;
      const date = pay.paymentDate ?? '';
      const amount = Number(pay.amount ?? 0);
      list.push({ type: 'payment', date, description: `Ödeme #${payId}`, amount, id: payId });
    });
    list.sort((a, b) => (b.date.localeCompare(a.date)));
    return list;
  }, [ownerInvoices, ownerPayments]);

  const owner = ownerWrapper?.success ? ownerWrapper.data : null;
  const financial = financialWrapper?.success ? financialWrapper.data : null;

  const refetchFinancial = () => {
    queryClient.invalidateQueries({ queryKey: ['owner-financial', ownerId] });
    queryClient.invalidateQueries({ queryKey: ['owner-invoices', ownerId] });
    queryClient.invalidateQueries({ queryKey: ['owner-payments', ownerId] });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loadingOwner) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  if (ownerError || !owner) {
    return <Alert severity="error">Müşteri bulunamadı veya yüklenirken bir hata oluştu.</Alert>;
  }

  // Helper types for safe access
  const safeOwner = owner as any;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('..')} // Go back to list
          sx={{ mr: 2 }}
        >
          Geri
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600, flexGrow: 1 }}>
          {safeOwner.type === 'CORPORATE' ? safeOwner.corporateName : `${safeOwner.firstName} ${safeOwner.lastName}`}
          {safeOwner.type === 'CORPORATE' && <Chip label="Kurumsal" color="secondary" size="small" sx={{ ml: 2, verticalAlign: 'middle' }} />}
        </Typography>
        <Button variant="outlined" startIcon={<EditIcon />}>
          Düzenle
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', borderRadius: 3, mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Genel Bakış" iconPosition="start" />
          <Tab icon={<PetsIcon />} label="Evcil Hayvanlar" iconPosition="start" />
          <Tab icon={<MoneyIcon />} label="Finansal Durum" iconPosition="start" />
          <Tab icon={<MessageIcon />} label="İletişim" iconPosition="start" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>İletişim Bilgileri</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><PhoneIcon /></ListItemIcon>
                      <ListItemText primary="Telefon" secondary={safeOwner.phone || '-'} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><EmailIcon /></ListItemIcon>
                      <ListItemText primary="E-Posta" secondary={safeOwner.email || '-'} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><HomeIcon /></ListItemIcon>
                      <ListItemText primary="Adres" secondary={safeOwner.address || '-'} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            {safeOwner.type === 'CORPORATE' && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Kurumsal Bilgiler</Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><BusinessIcon /></ListItemIcon>
                        <ListItemText primary="Vergi Dairesi" secondary={safeOwner.taxOffice || '-'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><BusinessIcon /></ListItemIcon>
                        <ListItemText primary="Vergi No" secondary={safeOwner.taxNo || '-'} />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ bgcolor: '#fff8e1' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NoteIcon color="warning" /> Notlar & Uyarılar
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {safeOwner.notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Notlar:</Typography>
                      <Typography variant="body2">{safeOwner.notes}</Typography>
                    </Box>
                  )}
                  {safeOwner.warnings && (
                    <Box>
                      <Typography variant="subtitle2" color="error">Özel Uyarılar:</Typography>
                      <Typography variant="body2" color="error" fontWeight="bold">{safeOwner.warnings}</Typography>
                    </Box>
                  )}
                  {!safeOwner.notes && !safeOwner.warnings && (
                    <Typography variant="body2" color="text.secondary">Herhangi bir not veya uyarı bulunmuyor.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Pets Tab */}
        <TabPanel value={value} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<PetsIcon />}
              onClick={() => navigate(`/clinic/${slug}/animals/new?ownerId=${ownerId}`)}
            >
              Yeni Pet Ekle
            </Button>
          </Box>
          {pets.length === 0 ? (
            <Alert severity="info">Henüz kayıtlı evcil hayvan bulunmuyor.</Alert>
          ) : (
            <Grid container spacing={2}>
              {pets.map((pet) => {
                const petId = pet.id ?? (pet as { animalId?: number }).animalId ?? 0;
                return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={petId}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar src={pet.profileImageUrl ? `/api/animals/${petId}/photo` : undefined} alt={pet.name} sx={{ width: 56, height: 56 }}>
                          {pet.name?.[0] ?? '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{pet.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pet.species?.name ?? '-'} - {pet.breed?.name ?? '-'}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">Yaş: {pet.ageInYears ?? '-'}</Typography>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined" fullWidth onClick={() => navigate(`/clinic/${slug}/animals/${petId}`)}>
                          Detay
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );})}
            </Grid>
          )}
        </TabPanel>

        {/* Financial Tab */}
        <TabPanel value={value} index={2}>
          {loadingFin ? <CircularProgress /> : (
            <>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card sx={{ bgcolor: '#e8f5e9' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>Toplam Bakiye</Typography>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {(financial?.balance || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card sx={{ bgcolor: '#ffebee' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>Gecikmiş Ödeme</Typography>
                      <Typography variant="h4" color="error.main" fontWeight="bold">
                        {(financial?.overdueAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<MoneyIcon />}
                      onClick={() => setOpenPaymentModal(true)}
                    >
                      Ödeme Al
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Son Hareketler</Typography>
              {financialActivities.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Henüz fatura veya ödeme kaydı yok.</Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tarih</TableCell>
                        <TableCell>Tür</TableCell>
                        <TableCell>Açıklama</TableCell>
                        <TableCell align="right">Tutar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {financialActivities.map((row) => (
                        <TableRow key={`${row.type}-${row.id}`}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>
                            <Chip label={row.type === 'invoice' ? 'Fatura' : 'Ödeme'} size="small" variant={row.type === 'invoice' ? 'outlined' : 'filled'} color={row.type === 'payment' ? 'success' : 'default'} />
                          </TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell align="right">
                            {(row.amount ?? 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </TabPanel>

        {/* Communication Tab */}
        <TabPanel value={value} index={3}>
          <Box sx={{ mb: 3 }}>
            <Button variant="contained" startIcon={<MessageIcon />} sx={{ mr: 2 }}>
              SMS Gönder
            </Button>
            <Button variant="contained" startIcon={<EmailIcon />} color="secondary">
              E-Posta Gönder
            </Button>
          </Box>
          <Typography variant="h6" gutterBottom>İletişim Geçmişi</Typography>
          <Typography variant="body2" color="text.secondary">
            İletişim geçmişi ve SMS/E-posta gönderimi yakında eklenecek.
          </Typography>
        </TabPanel>
      </Paper>

      {openPaymentModal && (
        <BillingProvider>
          <CreatePaymentModal
            onClose={() => setOpenPaymentModal(false)}
            onSuccess={() => {
              refetchFinancial();
              setOpenPaymentModal(false);
            }}
            ownerInvoices={ownerInvoices}
          />
        </BillingProvider>
      )}
    </Box>
  );
};

export default OwnerDetailPage;
