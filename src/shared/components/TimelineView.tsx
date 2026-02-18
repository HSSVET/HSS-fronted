import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export interface TimelineItemData {
  id: string | number;
  date: string;
  title: string;
  description?: string;
  type?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  icon?: React.ReactNode;
}

interface TimelineViewProps {
  items: TimelineItemData[];
  emptyMessage?: string;
}

const typeColorMap: Record<string, string> = {
  primary: '#92A78C',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  secondary: '#F7CD82',
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
};

const TimelineView: React.FC<TimelineViewProps> = ({ items, emptyMessage = 'Henüz kayıt bulunmuyor.' }) => {
  if (!items || items.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, color: 'text.secondary' }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', pl: 3 }}>
      {/* Dikey çizgi */}
      <Box
        sx={{
          position: 'absolute',
          left: '11px',
          top: 8,
          bottom: 8,
          width: '2px',
          bgcolor: 'divider',
        }}
      />

      {items.map((item, index) => {
        const dotColor = typeColorMap[item.type || 'primary'] || typeColorMap.primary;

        return (
          <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 3, position: 'relative' }}>
            {/* Nokta */}
            <Box
              sx={{
                position: 'absolute',
                left: '-24px',
                top: '12px',
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: dotColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              {item.icon || <FiberManualRecordIcon sx={{ fontSize: 12 }} />}
            </Box>

            {/* İçerik */}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                flex: 1,
                borderLeft: `3px solid ${dotColor}`,
                '&:hover': { elevation: 3 },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                  {formatDate(item.date)}
                </Typography>
              </Box>
              {item.description && (
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default TimelineView;
