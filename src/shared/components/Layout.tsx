import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationCenter from '../../components/common/NotificationCenter';
import ToastManager from '../../components/common/ToastManager';
import { useNotificationService } from '../../hooks/useNotificationService';
import '../styles/components/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { toasts, removeToast } = useNotificationService();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarMouseEnter = () => {
    setSidebarHovered(true);
  };

  const handleSidebarMouseLeave = () => {
    setSidebarHovered(false);
  };

  // Sidebar görünümünü belirle: hover olduğunda açık, değilse ve collapsed ise kapalı
  const isSidebarOpen = sidebarHovered || !sidebarCollapsed;

  return (
    <div className={`layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <div 
        className="sidebar-hover-area"
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <Sidebar collapsed={!isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <main className="main-content">
        <div className="main-header">
          <NotificationCenter />
        </div>
        {children}
      </main>
      
      {/* Toast Bildirimleri */}
      <ToastManager toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default Layout; 