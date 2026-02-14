import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { apiClient } from '../../services/api';
import '../styles/components/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { slug } = useParams<{ slug?: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Render sırasında set et: child (örn. OwnerPage) useQuery ile ilk isteği atarken header hazır olsun
  if (slug) {
    apiClient.setClinicContext(undefined, slug);
  }
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // useCallback ile fonksiyonları memoize et
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleSidebarMouseEnter = useCallback(() => {
    setSidebarHovered(prev => {
      if (sidebarCollapsed && !prev) {
        return true;
      }
      return prev;
    });
  }, [sidebarCollapsed]);

  const handleSidebarMouseLeave = useCallback(() => {
    setSidebarHovered(prev => {
      if (sidebarCollapsed && prev) {
        return false;
      }
      return prev;
    });
  }, [sidebarCollapsed]);

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
        {children}
      </main>
    </div>
  );
};

export default Layout; 