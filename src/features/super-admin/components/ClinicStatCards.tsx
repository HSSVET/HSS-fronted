import React from 'react';
import { Card, Box, Typography, Grid, alpha } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, suffix }) => {
  return (
    <Card
      elevation={0}
      className="group"
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        transition: 'all 0.3s ease',
        cursor: 'default',
        '&:hover': {
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          borderColor: alpha(color, 0.3),
        }
      }}
    >
      <Box sx={{
        p: 2,
        borderRadius: '16px',
        bgcolor: alpha(color, 0.08),
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
        '.group:hover &': {
          transform: 'scale(1.05)'
        }
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5, fontSize: '0.75rem' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {value}
          </Typography>
          {suffix && (
            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              {suffix}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};
