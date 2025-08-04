import { useState, useCallback, useEffect } from 'react';
import { Toast } from '../components/common/ToastManager';
import webSocketService from '../services/websocketService';

export const useNotificationService = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  // WebSocket mesajlarını dinle ve toast bildirimleri göster
  useEffect(() => {
    // Lab sonuç bildirimleri
    webSocketService.onMessage('lab-results', (message: string) => {
      showSuccess('Lab Sonucu Hazır', message, 8000);
    });

    // Randevu bildirimleri
    webSocketService.onMessage('appointments', (message: string) => {
      showInfo('Yeni Randevu', message, 6000);
    });

    // Acil durum bildirimleri
    webSocketService.onMessage('emergency', (message: string) => {
      showError('ACİL DURUM', message, 10000);
    });

    // Genel mesajlar
    webSocketService.onMessage('public', (message: string) => {
      showInfo('Sistem Mesajı', message, 5000);
    });

    return () => {
      // Cleanup - WebSocket dinleyicilerini temizle
      // Not: webSocketService'de cleanup mekanizması yok, 
      // bu yüzden sadece component unmount olduğunda temizlenir
    };
  }, [showSuccess, showInfo, showError]);

  return {
    toasts,
    removeToast,
    showSuccess,
    showWarning,
    showError,
    showInfo,
    addToast
  };
}; 