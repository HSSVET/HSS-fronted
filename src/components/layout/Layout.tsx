import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../dashboard/Dashboard';
import AppointmentSystem from '../appointments/AppointmentSystem';
import AnimalSystem from '../animals/AnimalSystem';
import '../../styles/components/Layout.css';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'appointments' | 'animals'>('dashboard');

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
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'appointments' && <AppointmentSystem />}
        {currentView === 'animals' && <AnimalSystem />}
      </main>
    </div>
  );
};

export default Layout; 