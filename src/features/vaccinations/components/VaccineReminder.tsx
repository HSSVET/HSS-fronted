import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Avatar,
  Badge,
  Tooltip,
  Fade,
  Collapse
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { vaccinationService, VaccinationService } from '../services/vaccinationService';
import { VaccinationSchedule } from '../types/vaccination';
import { animalService } from '../../animals/services/animalService';
import type { BasicAnimalRecord } from '../../animals/services/animalService';
import type { Vaccine } from '../types/vaccination';
import '../styles/Vaccination.css';

interface VaccineReminderProps {
  animalId?: string;
  showAll?: boolean;
}

interface ReminderSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  phoneEnabled: boolean;
  reminderDays: number[];
  autoReminder: boolean;
  reminderTime: string;
}

interface ReminderItem {
  id: string;
  animalId: string;
  animalName: string;
  vaccineName: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'sent' | 'completed' | 'overdue';
  reminderType: 'email' | 'sms' | 'phone';
  createdAt: Date;
  sentAt?: Date;
  completedAt?: Date;
}

const VaccineReminder: React.FC<VaccineReminderProps> = ({
  animalId,
  showAll = false
}) => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [upcomingVaccines, setUpcomingVaccines] = useState<VaccinationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [expandedReminder, setExpandedReminder] = useState<string | null>(null);

  // Backend data states
  const [animals, setAnimals] = useState<BasicAnimalRecord[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    emailEnabled: true,
    smsEnabled: true,
    phoneEnabled: false,
    reminderDays: [7, 3, 1],
    autoReminder: true,
    reminderTime: '09:00'
  });

  const [newReminder, setNewReminder] = useState({
    animalId: '',
    animalName: '',
    vaccineName: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    reminderType: 'email' as 'email' | 'sms' | 'phone'
  });

  useEffect(() => {
    loadData();
    loadFormData();
  }, [animalId, showAll]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - gerçek uygulamada API'den gelecek
      const mockReminders: ReminderItem[] = [
        {
          id: '1',
          animalId: '1',
          animalName: 'Bella',
          vaccineName: 'Karma Aşı',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 gün sonra
          priority: 'high',
          status: 'pending',
          reminderType: 'email',
          createdAt: new Date()
        },
        {
          id: '2',
          animalId: '2',
          animalName: 'Max',
          vaccineName: 'Kuduz Aşısı',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra
          priority: 'critical',
          status: 'pending',
          reminderType: 'sms',
          createdAt: new Date()
        },
        {
          id: '3',
          animalId: '3',
          animalName: 'Luna',
          vaccineName: 'Parvovirus Aşısı',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gün önce
          priority: 'high',
          status: 'overdue',
          reminderType: 'phone',
          createdAt: new Date(),
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ];

      const mockUpcoming: VaccinationSchedule[] = [
        {
          animalId: '1',
          vaccineId: '1',
          vaccineName: 'Karma Aşı',
          scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          isOverdue: false,
          priority: 'high',
          notes: 'Yıllık karma aşı'
        },
        {
          animalId: '2',
          vaccineId: '2',
          vaccineName: 'Kuduz Aşısı',
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isOverdue: false,
          priority: 'critical',
          notes: 'Zorunlu kuduz aşısı'
        }
      ];

      setReminders(mockReminders);
      setUpcomingVaccines(mockUpcoming);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    setLoadingData(true);
    try {
      // Hayvanları yükle
      const animalsResponse = await animalService.getBasicAnimals();
      if (animalsResponse.success && animalsResponse.data) {
        setAnimals(animalsResponse.data);
      }

      // Aşıları yükle
      const vaccinesResponse = await VaccinationService.getVaccines();
      if (vaccinesResponse.success && vaccinesResponse.data) {
        setVaccines(vaccinesResponse.data);
      }
    } catch (error) {
      console.error('Form verileri yüklenirken hata:', error);
      setError('Form verileri yüklenirken hata oluştu');
    } finally {
      setLoadingData(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'overdue':
        return 'error';
      case 'sent':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'sms':
        return <SmsIcon />;
      case 'phone':
        return <PhoneIcon />;
      default:
        return <NotificationIcon />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredReminders = reminders.filter(reminder => {
    const statusMatch = filterStatus === 'all' || reminder.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || reminder.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleSendReminder = async (reminderId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, status: 'sent' as const, sentAt: new Date() }
          : reminder
      ));
    } catch (err) {
      setError('Hatırlatıcı gönderilirken hata oluştu');
    }
  };

  const handleMarkCompleted = async (reminderId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, status: 'completed' as const, completedAt: new Date() }
          : reminder
      ));
    } catch (err) {
      setError('Hatırlatıcı tamamlanırken hata oluştu');
    }
  };



  const handleEditReminder = (reminder: ReminderItem) => {
    // Formu düzenleme modunda doldur
    setNewReminder({
      animalId: reminder.animalId,
      animalName: reminder.animalName,
      vaccineName: reminder.vaccineName,
      dueDate: new Date(reminder.dueDate).toISOString().slice(0, 16), // datetime-local format
      priority: reminder.priority,
      reminderType: reminder.reminderType
    });
    setEditingReminder(reminder);
    setShowReminderDialog(true);
  };

  const handleSaveReminder = async () => {
    try {
      if (editingReminder) {
        // Düzenleme modu
        setReminders(prev => prev.map(reminder =>
          reminder.id === editingReminder.id
            ? {
              ...reminder,
              animalId: newReminder.animalId,
              animalName: newReminder.animalName,
              vaccineName: newReminder.vaccineName,
              dueDate: new Date(newReminder.dueDate),
              priority: newReminder.priority,
              reminderType: newReminder.reminderType
            }
            : reminder
        ));
      } else {
        // Yeni ekleme modu
        const selectedAnimal = animals.find(a => a.id.toString() === newReminder.animalId);
        const newReminderItem: ReminderItem = {
          id: Date.now().toString(),
          animalId: newReminder.animalId,
          animalName: selectedAnimal?.name || newReminder.animalName || 'Bilinmeyen',
          vaccineName: newReminder.vaccineName,
          dueDate: new Date(newReminder.dueDate),
          priority: newReminder.priority,
          status: 'pending',
          reminderType: newReminder.reminderType,
          createdAt: new Date()
        };
        setReminders(prev => [...prev, newReminderItem]);
      }

      setShowReminderDialog(false);
      setEditingReminder(null);
      setNewReminder({
        animalId: '',
        animalName: '',
        vaccineName: '',
        dueDate: '',
        priority: 'medium',
        reminderType: 'email'
      });
    } catch (err) {
      setError('Hatırlatıcı kaydedilirken hata oluştu');
    }
  };


  const handleDeleteReminder = async (reminderId: string) => {
    try {
      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    } catch (err) {
      setError('Hatırlatıcı silinirken hata oluştu');
    }
  };

  const renderReminderCard = (reminder: ReminderItem) => {
    const daysUntil = getDaysUntilDue(reminder.dueDate);
    const isOverdue = daysUntil < 0;
    const isUrgent = daysUntil <= 1 && daysUntil >= 0;

    return (
      <Fade in={true} timeout={300}>
        <Card
          key={reminder.id}
          sx={{
            mb: 2,
            borderLeft: 4,
            borderColor: isOverdue ? 'error.main' : isUrgent ? 'warning.main' : 'info.main',
            backgroundColor: isOverdue ? 'error.light' : isUrgent ? 'warning.light' : 'background.paper'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Avatar sx={{ mr: 2, bgcolor: getPriorityColor(reminder.priority) + '.main' }}>
                  <PetIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {reminder.animalName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {reminder.vaccineName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(reminder.dueDate)}
                    </Typography>
                    <Chip
                      label={isOverdue ? `${Math.abs(daysUntil)} gün gecikmiş` : `${daysUntil} gün kaldı`}
                      size="small"
                      color={isOverdue ? 'error' : isUrgent ? 'warning' : 'info'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={reminder.priority}
                      size="small"
                      color={getPriorityColor(reminder.priority) as any}
                    />
                    <Chip
                      label={reminder.status}
                      size="small"
                      color={getStatusColor(reminder.status) as any}
                    />
                    <Chip
                      icon={getReminderIcon(reminder.reminderType)}
                      label={reminder.reminderType}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {reminder.status === 'pending' && (
                  <Tooltip title="Hatırlatıcı Gönder">
                    <IconButton
                      onClick={() => handleSendReminder(reminder.id)}
                      color="primary"
                    >
                      <NotificationIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {reminder.status === 'sent' && (
                  <Tooltip title="Tamamlandı Olarak İşaretle">
                    <IconButton
                      onClick={() => handleMarkCompleted(reminder.id)}
                      color="success"
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Düzenle">
                  <IconButton
                    color="info"
                    onClick={() => handleEditReminder(reminder)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sil">
                  <IconButton
                    onClick={() => handleDeleteReminder(reminder.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Hatırlatıcılar yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <NotificationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Aşı Hatırlatıcıları
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowSettings(true)}
          >
            Filtreler
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setShowSettings(true)}
          >
            Ayarlar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingReminder(null);
              setShowReminderDialog(true);
            }}
          >
            Hatırlatıcı Ekle
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <ScheduleIcon />
              </Avatar>
              <Box>
                <Typography variant="h4">
                  {reminders.filter(r => r.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bekleyen Hatırlatıcılar
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                <WarningIcon />
              </Avatar>
              <Box>
                <Typography variant="h4">
                  {reminders.filter(r => r.status === 'overdue').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Geciken Aşılar
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <CheckIcon />
              </Avatar>
              <Box>
                <Typography variant="h4">
                  {reminders.filter(r => r.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tamamlanan
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                <NotificationIcon />
              </Avatar>
              <Box>
                <Typography variant="h4">
                  {reminders.filter(r => r.status === 'sent').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gönderilen
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          <AlertTitle>Hata</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Reminders List */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Hatırlatıcı Listesi ({filteredReminders.length})
        </Typography>
        {filteredReminders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <NotificationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Henüz hatırlatıcı bulunmuyor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Yeni hatırlatıcı eklemek için yukarıdaki butonu kullanın
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingReminder(null);
                setShowReminderDialog(true);
              }}
            >
              İlk Hatırlatıcıyı Ekle
            </Button>
          </Box>
        ) : (
          <Box>
            {filteredReminders.map(reminder => renderReminderCard(reminder))}
          </Box>
        )}
      </Paper>

      {/* Add/Edit Reminder Dialog */}
      <Dialog
        open={showReminderDialog}
        onClose={() => {
          setShowReminderDialog(false);
          setEditingReminder(null);
          setNewReminder({
            animalId: '',
            animalName: '',
            vaccineName: '',
            dueDate: '',
            priority: 'medium',
            reminderType: 'email'
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingReminder ? 'Hatırlatıcıyı Düzenle' : 'Yeni Hatırlatıcı Ekle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Hayvan Seç *</InputLabel>
              <Select
                value={newReminder.animalId}
                onChange={(e) => {
                  const selectedAnimal = animals.find(a => a.id.toString() === e.target.value);
                  setNewReminder(prev => ({
                    ...prev,
                    animalId: e.target.value,
                    animalName: selectedAnimal?.name || ''
                  }));
                }}
                label="Hayvan Seç *"
                disabled={loadingData || animals.length === 0}
              >
                {loadingData ? (
                  <MenuItem value="">Yükleniyor...</MenuItem>
                ) : animals.length === 0 ? (
                  <MenuItem value="">Hayvan bulunamadı</MenuItem>
                ) : (
                  animals.map((animal) => (
                    <MenuItem key={animal.id} value={animal.id.toString()}>
                      {animal.name} - {animal.ownerName} ({animal.speciesName})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Aşı Seç *</InputLabel>
              <Select
                value={newReminder.vaccineName}
                onChange={(e) => setNewReminder(prev => ({ ...prev, vaccineName: e.target.value }))}
                label="Aşı Seç *"
                disabled={loadingData || vaccines.length === 0}
              >
                {loadingData ? (
                  <MenuItem value="">Yükleniyor...</MenuItem>
                ) : vaccines.length === 0 ? (
                  <MenuItem value="">Aşı bulunamadı</MenuItem>
                ) : (
                  vaccines.map((vaccine) => (
                    <MenuItem key={vaccine.id} value={vaccine.name}>
                      {vaccine.name} - {vaccine.manufacturer}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Hatırlatma Tarihi"
              type="datetime-local"
              value={newReminder.dueDate}
              onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Öncelik</InputLabel>
              <Select
                value={newReminder.priority}
                onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value as any }))}
                label="Öncelik"
              >
                <MenuItem value="low">Düşük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="high">Yüksek</MenuItem>
                <MenuItem value="critical">Kritik</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Hatırlatma Türü</InputLabel>
              <Select
                value={newReminder.reminderType}
                onChange={(e) => setNewReminder(prev => ({ ...prev, reminderType: e.target.value as any }))}
                label="Hatırlatma Türü"
              >
                <MenuItem value="email">E-posta</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="phone">Telefon</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowReminderDialog(false);
            setEditingReminder(null);
            setNewReminder({
              animalId: '',
              animalName: '',
              vaccineName: '',
              dueDate: '',
              priority: 'medium',
              reminderType: 'email'
            });
          }}>
            İptal
          </Button>
          <Button
            onClick={handleSaveReminder}
            variant="contained"
            disabled={!newReminder.animalId || !newReminder.vaccineName || !newReminder.dueDate}
          >
            {editingReminder ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Hatırlatıcı Ayarları</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bildirim Kanalları
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={reminderSettings.emailEnabled}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, emailEnabled: e.target.checked }))}
                />
              }
              label="E-posta Bildirimleri"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={reminderSettings.smsEnabled}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, smsEnabled: e.target.checked }))}
                />
              }
              label="SMS Bildirimleri"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={reminderSettings.phoneEnabled}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, phoneEnabled: e.target.checked }))}
                />
              }
              label="Telefon Bildirimleri"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Otomatik Hatırlatma
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={reminderSettings.autoReminder}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, autoReminder: e.target.checked }))}
                />
              }
              label="Otomatik Hatırlatma Aktif"
            />

            <TextField
              fullWidth
              label="Hatırlatma Saati"
              type="time"
              value={reminderSettings.reminderTime}
              onChange={(e) => setReminderSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>
            Kapat
          </Button>
          <Button variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VaccineReminder;
