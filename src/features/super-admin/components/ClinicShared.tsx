import React from 'react';
import { Box, alpha } from '@mui/material';
import { stringToColor } from '../utils/uiUtils';

export const AvatarWithFallback: React.FC<{ name: string; size?: number }> = ({ name, size = 32 }) => {
  const color = stringToColor(name || 'Unknown');
  const initial = name ? name.substring(0, 2).toUpperCase() : '??';

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 2,
        bgcolor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 800,
        fontSize: size * 0.4,
        boxShadow: `0 4px 10px ${alpha(color, 0.4)}`
      }}
    >
      {initial}
    </Box>
  );
};
