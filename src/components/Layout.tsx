import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AppointmentSystem from './AppointmentSystem';
import '../styles/Layout.css';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'appointments'>('dashboard');

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
        <Sidebar 
          collapsed={!isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
      <main className="main-content">
        {currentView === 'dashboard' ? <Dashboard /> : <AppointmentSystem />}
      </main>
    </div>
  );
};

export default Layout; 