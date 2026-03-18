import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Container,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Refresh,
  PlayArrow,
  CheckCircle,
  Cancel,
  AccessTime,
  Person,
  MeetingRoom,
} from '@mui/icons-material';
import { useQueue } from '../hooks/useQueue';
import { queueApi } from '../services/queueApi';
import type { QueueEntry, QueueStatus } from '../types/queue.types';

const STATUS_COLORS: Record<QueueStatus, string> = {
  WAITING: '#FFA726',
  IN_PROGRESS: '#42A5F5',
  COMPLETED: '#66BB6A',
  CANCELLED: '#EF5350',
  NO_SHOW: '#BDBDBD',
};

const STATUS_LABELS: Record<QueueStatus, string> = {
  WAITING: 'Bekliyor',
  IN_PROGRESS: 'Muayenede',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal',
  NO_SHOW: 'Gelmedi',
};

const PRIORITY_COLORS = {
  LOW: '#9E9E9E',
  NORMAL: '#2196F3',
  HIGH: '#FF9800',
  URGENT: '#F44336',
  EMERGENCY: '#D50000',
};

const QueueDashboard: React.FC = () => {
  const theme = useTheme();
  const { queue, loading, error, refreshQueue } = useQueue(30000); // Refresh every 30 seconds
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<QueueEntry | null>(null);
  const [assignmentData, setAssignmentData] = useState({ veterinarianId: '', room: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const handleStatusUpdate = async (entryId: number, newStatus: QueueStatus) => {
    setActionLoading(true);
    try {
      const response = await queueApi.updateStatus(entryId, { status: newStatus });
      if (response.success) {
        await refreshQueue();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenAssignDialog = (entry: QueueEntry) => {
    setSelectedEntry(entry);
    setAssignmentData({
      veterinarianId: entry.assignedVeterinarianId?.toString() || '',
      room: entry.assignedRoom || '',
    });
    setAssignDialogOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedEntry || !assignmentData.veterinarianId) return;

    setActionLoading(true);
    try {
      const response = await queueApi.assignVeterinarian(selectedEntry.queueEntryId, {
        veterinarianId: parseInt(assignmentData.veterinarianId),
        room: assignmentData.room || undefined,
      });

      if (response.success) {
        setAssignDialogOpen(false);
        await refreshQueue();
      }
    } catch (err) {
      console.error('Failed to assign:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes <= 0) return 'Hazır';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  const waitingCount = queue.filter(q => q.status === 'WAITING').length;
  const inProgressCount = queue.filter(q => q.status === 'IN_PROGRESS').length;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, md: 2.75 },
          mb: { xs: 2, md: 2.5 },
          borderRadius: 4,
          background:
            'radial-gradient(circle at 15% 25%, rgba(140, 169, 154, 0.30) 0%, rgba(140, 169, 154, 0) 55%), radial-gradient(circle at 85% 25%, rgba(134, 200, 181, 0.22) 0%, rgba(134, 200, 181, 0) 55%), linear-gradient(135deg, rgba(250,253,255,0.92) 0%, rgba(240,248,252,0.86) 100%)',
          border: '1px solid rgba(90,140,180,0.22)',
          boxShadow: '0 12px 30px rgba(40, 70, 90, 0.14)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, letterSpacing: '-0.6px', color: 'rgba(31, 43, 38, 0.92)' }}
            >
              Hasta Kuyruğu
            </Typography>
            <Typography sx={{ mt: 0.5, color: 'rgba(31, 43, 38, 0.62)' }}>
              Bekleyenleri yönetin, muayene akışını tek ekrandan takip edin.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshQueue}
            disabled={loading}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 900,
              borderColor: 'rgba(140,169,154,0.35)',
              bgcolor: 'rgba(255,255,255,0.55)',
              '&:hover': { bgcolor: 'rgba(140, 169, 154, 0.10)', borderColor: 'rgba(140,169,154,0.45)' },
            }}
          >
            Yenile
          </Button>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: { xs: 2, md: 2.5 } }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: 'linear-gradient(180deg, rgba(250,253,255,0.90), rgba(240,248,252,0.82))',
              border: '1px solid rgba(90,140,180,0.22)',
              boxShadow: '0 12px 28px rgba(40, 70, 90, 0.12)',
            }}
          >
            <CardContent>
              <Typography sx={{ color: 'rgba(31, 43, 38, 0.62)', fontWeight: 800 }} gutterBottom>
                Bekleyen
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: theme.palette.primary.dark }}>
                {waitingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: 'linear-gradient(180deg, rgba(250,253,255,0.90), rgba(240,248,252,0.82))',
              border: '1px solid rgba(90,140,180,0.22)',
              boxShadow: '0 12px 28px rgba(40, 70, 90, 0.12)',
            }}
          >
            <CardContent>
              <Typography sx={{ color: 'rgba(31, 43, 38, 0.62)', fontWeight: 800 }} gutterBottom>
                Muayenede
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: theme.palette.primary.dark }}>
                {inProgressCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: 'linear-gradient(180deg, rgba(250,253,255,0.90), rgba(240,248,252,0.82))',
              border: '1px solid rgba(90,140,180,0.22)',
              boxShadow: '0 12px 28px rgba(40, 70, 90, 0.12)',
            }}
          >
            <CardContent>
              <Typography sx={{ color: 'rgba(31, 43, 38, 0.62)', fontWeight: 800 }} gutterBottom>
                Toplam
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'rgba(31, 43, 38, 0.92)' }}>
                {queue.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && !queue.length && <LinearProgress sx={{ mb: 2 }} />}

      {/* Queue List */}
      <Grid container spacing={2}>
        {queue.map((entry) => (
          <Grid size={{ xs: 12 }} key={entry.queueEntryId}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid rgba(90,140,180,0.22)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderLeft: `5px solid ${STATUS_COLORS[entry.status]}`,
                  pointerEvents: 'none',
                },
                transition: 'transform 200ms cubic-bezier(.2,.6,.2,1), box-shadow 200ms cubic-bezier(.2,.6,.2,1)',
                '&:hover': { boxShadow: '0 18px 40px rgba(40, 70, 90, 0.16)', transform: 'translateY(-2px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Left Side - Patient Info */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.2px' }}>
                        #{entry.queueNumber}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {entry.animalName}
                      </Typography>
                      {entry.priority !== 'NORMAL' && (
                        <Chip
                          label={entry.priority}
                          size="small"
                          sx={{
                            bgcolor: PRIORITY_COLORS[entry.priority],
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 999,
                          }}
                        />
                      )}
                    </Box>

                    <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                      Sahip: {entry.ownerName}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2">
                          Giriş: {formatTime(entry.checkInTime)}
                        </Typography>
                      </Box>

                      {entry.estimatedStartTime && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">
                            Tahmini: {formatTime(entry.estimatedStartTime)}
                          </Typography>
                        </Box>
                      )}

                      {entry.assignedVeterinarianId && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2">
                            Veteriner: {entry.assignedVeterinarianName || entry.assignedVeterinarianId}
                          </Typography>
                        </Box>
                      )}

                      {entry.assignedRoom && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MeetingRoom fontSize="small" color="action" />
                          <Typography variant="body2">
                            Oda: {entry.assignedRoom}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {entry.notes && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                        Not: {entry.notes}
                      </Typography>
                    )}
                  </Box>

                  {/* Right Side - Status & Actions */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Chip
                      label={STATUS_LABELS[entry.status]}
                      sx={{
                        bgcolor: STATUS_COLORS[entry.status],
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 999,
                      }}
                    />

                    {entry.status === 'WAITING' && (
                      <Typography
                        variant="body2"
                        sx={{
                          bgcolor: '#FFF9C4',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 600,
                        }}
                      >
                        Bekleme: {formatWaitTime(entry.estimatedWaitMinutes)}
                      </Typography>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {entry.status === 'WAITING' && (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenAssignDialog(entry)}
                            title="Atama Yap"
                            sx={{
                              border: '1px solid rgba(90,140,180,0.18)',
                              bgcolor: 'rgba(255,255,255,0.55)',
                              '&:hover': { bgcolor: 'rgba(140, 169, 154, 0.10)' },
                            }}
                          >
                            <Person />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleStatusUpdate(entry.queueEntryId, 'IN_PROGRESS')}
                            title="Başlat"
                            disabled={actionLoading}
                            sx={{
                              border: '1px solid rgba(90,140,180,0.18)',
                              bgcolor: 'rgba(255,255,255,0.55)',
                              '&:hover': { bgcolor: 'rgba(134, 200, 181, 0.14)' },
                            }}
                          >
                            <PlayArrow />
                          </IconButton>
                        </>
                      )}

                      {entry.status === 'IN_PROGRESS' && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleStatusUpdate(entry.queueEntryId, 'COMPLETED')}
                          title="Tamamla"
                          disabled={actionLoading}
                          sx={{
                            border: '1px solid rgba(90,140,180,0.18)',
                            bgcolor: 'rgba(255,255,255,0.55)',
                            '&:hover': { bgcolor: 'rgba(134, 200, 181, 0.14)' },
                          }}
                        >
                          <CheckCircle />
                        </IconButton>
                      )}

                      {(entry.status === 'WAITING' || entry.status === 'IN_PROGRESS') && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleStatusUpdate(entry.queueEntryId, 'CANCELLED')}
                          title="İptal"
                          disabled={actionLoading}
                          sx={{
                            border: '1px solid rgba(90,140,180,0.18)',
                            bgcolor: 'rgba(255,255,255,0.55)',
                            '&:hover': { bgcolor: 'rgba(229,127,115,0.12)' },
                          }}
                        >
                          <Cancel />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {!loading && queue.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.70)',
            border: '1px dashed rgba(90,140,180,0.28)',
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Kuyrukta hasta bulunmuyor
          </Typography>
        </Box>
      )}

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Veteriner ve Oda Atama</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Veteriner ID"
              type="number"
              value={assignmentData.veterinarianId}
              onChange={(e) => setAssignmentData({ ...assignmentData, veterinarianId: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Oda"
              value={assignmentData.room}
              onChange={(e) => setAssignmentData({ ...assignmentData, room: e.target.value })}
              fullWidth
              select
            >
              <MenuItem value="">Seçiniz</MenuItem>
              <MenuItem value="Muayene 1">Muayene 1</MenuItem>
              <MenuItem value="Muayene 2">Muayene 2</MenuItem>
              <MenuItem value="Muayene 3">Muayene 3</MenuItem>
              <MenuItem value="Ameliyathane">Ameliyathane</MenuItem>
              <MenuItem value="Röntgen">Röntgen</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>İptal</Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={!assignmentData.veterinarianId || actionLoading}
          >
            Ata
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QueueDashboard;
