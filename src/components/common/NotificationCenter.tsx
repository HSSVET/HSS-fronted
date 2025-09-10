import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import webSocketService, { NotificationMessage } from '../../services/websocketService';
import './NotificationCenter.css';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // WebSocket mesaj dinleyicilerini ayarla
    webSocketService.onMessage('notifications', handleNotification);
    webSocketService.onMessage('appointments', handleAppointmentNotification);
    webSocketService.onMessage('lab-results', handleLabResultNotification);
    webSocketService.onMessage('emergency', handleEmergencyNotification);

    // Bağlantı durumu dinleyicisi
    webSocketService.onConnectionChange((connected) => {
      if (connected) {
        console.log('WebSocket bağlantısı kuruldu');
      } else {
        console.log('WebSocket bağlantısı kesildi');
      }
    });

    return () => {
      // Cleanup
    };
  }, []);

  const handleNotification = (notification: NotificationMessage) => {
    addNotification(notification);
  };

  const handleAppointmentNotification = (message: string) => {
    const notification: NotificationMessage = {
      id: Date.now().toString(),
      title: 'Randevu Bildirimi',
      message: message,
      type: 'INFO',
      category: 'APPOINTMENT',
      read: false,
      createdAt: new Date().toISOString()
    };
    addNotification(notification);
  };

  const handleLabResultNotification = (message: string) => {
    const notification: NotificationMessage = {
      id: Date.now().toString(),
      title: 'Laboratuvar Sonucu',
      message: message,
      type: 'INFO',
      category: 'LAB_RESULT',
      read: false,
      createdAt: new Date().toISOString()
    };
    addNotification(notification);
  };

  const handleEmergencyNotification = (message: string) => {
    const notification: NotificationMessage = {
      id: Date.now().toString(),
      title: 'Acil Durum',
      message: message,
      type: 'ERROR',
      category: 'EMERGENCY',
      read: false,
      createdAt: new Date().toISOString()
    };
    addNotification(notification);
  };

  const addNotification = (notification: NotificationMessage) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Son 10 bildirimi tut
    setUnreadCount(prev => prev + 1);
    
    // Otomatik bildirim göster
    showToastNotification(notification);
  };

  const showToastNotification = (notification: NotificationMessage) => {
    // Basit toast bildirimi
    const toast = document.createElement('div');
    toast.className = `notification-toast notification-${notification.type.toLowerCase()}`;
    toast.innerHTML = `
      <div class="toast-header">
        <span class="toast-title">${notification.title}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="toast-message">${notification.message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // 5 saniye sonra otomatik kaldır
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? Math.max(0, prev - 1) : prev;
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'ERROR':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'notification-success';
      case 'WARNING':
        return 'notification-warning';
      case 'ERROR':
        return 'notification-error';
      default:
        return 'notification-info';
    }
  };

  return (
    <div className={`notification-center ${className}`}>
      {/* Bildirim Butonu */}
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Bildirim Paneli */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3 className="notification-title">Bildirimler</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  className="mark-all-read-btn"
                  onClick={markAllAsRead}
                >
                  Tümünü Okundu İşaretle
                </button>
              )}
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell className="w-8 h-8 text-gray-400" />
                <p>Henüz bildirim yok</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${getNotificationClass(notification.type)} ${
                    !notification.read ? 'unread' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header-item">
                      <h4 className="notification-item-title">{notification.title}</h4>
                      <button
                        className="remove-notification-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 