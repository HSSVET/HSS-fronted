import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import './ToastNotification.css';

export interface ToastNotificationProps {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animasyon için kısa gecikme
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Otomatik kapanma
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast-notification ${type} ${isVisible ? 'visible' : ''} ${isLeaving ? 'leaving' : ''}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={handleClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastNotification; 