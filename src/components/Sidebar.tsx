import React from 'react';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaPaw, 
  FaBoxes, 
  FaChartBar, 
  FaCog, 
  FaUser,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import '../styles/Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  currentView: 'dashboard' | 'appointments';
  onViewChange: (view: 'dashboard' | 'appointments') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar, currentView, onViewChange }) => {
  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange('dashboard');
  };

  const handleAppointmentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange('appointments');
  };

  const menuItems = [
    { icon: FaTachometerAlt({}), text: 'Panel', href: '#dashboard', onClick: handleDashboardClick, active: currentView === 'dashboard' },
    { icon: FaCalendarAlt({}), text: 'Randevular', href: '#appointments', onClick: handleAppointmentsClick, active: currentView === 'appointments' },
    { icon: FaPaw({}), text: 'Hastalar/Hayvanlar', href: '#patients' },
    { icon: FaBoxes({}), text: 'Envanter/Stok', href: '#inventory' },
    { icon: FaChartBar({}), text: 'Raporlar', href: '#reports' },
    { icon: FaCog({}), text: 'Ayarlar', href: '#settings' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        {!collapsed && <h2>VetKlinik</h2>}
        {collapsed && <h2>VK</h2>}
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? FaChevronRight({}) : FaChevronLeft({})}
        </button>
      </div>
      
      <div className="menu-container">
        {menuItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className={`menu-item ${item.active ? 'active' : ''}`}
            onClick={item.onClick}
            title={collapsed ? item.text : ''}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="text">{item.text}</span>}
          </a>
        ))}
      </div>
      
      <div className="user-container">
        <div className="user-profile">
          <span className="icon">{FaUser({})}</span>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">Dr. Yılmaz</span>
              <span className="user-role">Veteriner Hekim</span>
            </div>
          )}
        </div>
        <a 
          href="#logout" 
          className="logout"
          title={collapsed ? 'Çıkış' : ''}
        >
          <span className="icon">{FaSignOutAlt({})}</span>
          {!collapsed && <span className="text">Çıkış</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar; 