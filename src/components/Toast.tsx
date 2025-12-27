import React from 'react';
import { Alert, AlertTitle, IconButton, Snackbar, SnackbarContent } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useUIStore, type Toast as ToastType } from '../stores';

const Toast: React.FC = () => {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);

  const getIcon = (type: ToastType['type']) => {
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

  const getSeverity = (type: ToastType['type']) => {
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
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration === 0 ? null : (toast.duration || 5000)}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <SnackbarContent
            message={
              <Alert
                severity={getSeverity(toast.type)}
                icon={getIcon(toast.type)}
                action={
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => removeToast(toast.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ width: '100%' }}
              >
                <AlertTitle>{toast.message}</AlertTitle>
              </Alert>
            }
          />
        </Snackbar>
      ))}
    </>
  );
};

export default Toast;
