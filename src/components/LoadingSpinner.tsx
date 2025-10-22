import React from 'react';
import { 
  Box, 
  CircularProgress, 
  LinearProgress, 
  Typography, 
  Backdrop,
  Paper 
} from '@mui/material';

interface LoadingSpinnerProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
  variant?: 'backdrop' | 'inline' | 'overlay';
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  isLoading,
  message,
  progress,
  variant = 'backdrop',
  size = 40,
}) => {
  if (!isLoading) return null;

  const renderContent = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2 
    }}>
      {progress !== undefined ? (
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {Math.round(progress)}%
          </Typography>
        </Box>
      ) : (
        <CircularProgress size={size} />
      )}
      
      {message && (
        <Typography variant="body1" textAlign="center" sx={{ maxWidth: 300 }}>
          {message}
        </Typography>
      )}
    </Box>
  );

  switch (variant) {
    case 'backdrop':
      return (
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          open={isLoading}
        >
          {renderContent()}
        </Backdrop>
      );

    case 'overlay':
      return (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            {renderContent()}
          </Paper>
        </Box>
      );

    case 'inline':
    default:
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          py: 2 
        }}>
          {renderContent()}
        </Box>
      );
  }
};

export default LoadingSpinner;
