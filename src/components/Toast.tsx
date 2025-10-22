import React from 'react';
import { Alert, AlertTitle, IconButton, Snackbar, SnackbarContent } from '@mui/material';
import { 
  CheckCircle as SuccessIcon, 
  Error as ErrorIcon, 
  Warning as WarningIcon, 
  Info as InfoIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { useError, type ErrorInfo } from '../context/ErrorContext';

const Toast: React.FC = () => {
  const { errors, removeError } = useError();

  const getIcon = (type: ErrorInfo['type']) => {
    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverity = (type: ErrorInfo['type']) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <>
      {errors.map((error) => (
        <Snackbar
          key={error.id}
          open={true}
          autoHideDuration={error.type === 'error' ? null : 6000}
          onClose={() => removeError(error.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <SnackbarContent
            message={
              <Alert 
                severity={getSeverity(error.type)}
                icon={getIcon(error.type)}
                action={
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => removeError(error.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ width: '100%' }}
              >
                <AlertTitle>{error.message}</AlertTitle>
                {error.details && (
                  <div style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                    {error.details}
                  </div>
                )}
                {error.action && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={error.action.onClick}
                      style={{
                        background: 'none',
                        border: '1px solid currentColor',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      {error.action.label}
                    </button>
                  </div>
                )}
              </Alert>
            }
          />
        </Snackbar>
      ))}
    </>
  );
};

export default Toast;
