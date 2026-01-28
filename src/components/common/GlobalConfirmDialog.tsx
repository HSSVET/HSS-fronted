import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useUIStore } from '../../stores/uiStore';

const GlobalConfirmDialog = () => {
  const { confirmDialog, hideConfirmDialog } = useUIStore();

  if (!confirmDialog?.isOpen) return null;

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    hideConfirmDialog();
  };

  const handleCancel = () => {
    if (confirmDialog.onCancel) {
      confirmDialog.onCancel();
    }
    hideConfirmDialog();
  };

  return (
    <Dialog
      open={confirmDialog.isOpen}
      onClose={handleCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 600 }}>
        {confirmDialog.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {confirmDialog.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleCancel} color="inherit" sx={{ borderRadius: 2 }}>
          İptal
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          autoFocus
          sx={{ borderRadius: 2, px: 3 }}
        >
          Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlobalConfirmDialog;
