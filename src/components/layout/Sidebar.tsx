import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: 'icon-dashboard', text: 'Panel', path: '/dashboard' },
    { icon: 'icon-calendar', text: 'Randevular', path: '/appointments' },
    { icon: 'icon-paw', text: 'Hastalar/Hayvanlar', path: '/animals' },
    { icon: 'icon-lab', text: 'Laboratuvar', path: '/laboratory' },
    { icon: 'icon-box', text: 'Envanter/Stok', path: '/inventory' },
    { icon: 'icon-chart', text: 'Raporlar', path: '/reports' },
    { icon: 'icon-settings', text: 'Ayarlar', path: '/settings' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        {!collapsed && <h2>VetKlinik</h2>}
        {collapsed && <h2>VK</h2>}
        <button className="toggle-button" onClick={toggleSidebar}>
          <span className={`icon ${collapsed ? 'icon-chevron-right' : 'icon-chevron-left'}`}></span>
        </button>
      </div>
      
      <div className="menu-container">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className={`icon ${item.icon}`}></span>
            {!collapsed && <span className="text">{item.text}</span>}
          </Link>
        ))}
      </div>
      
      <div className="user-container">
        <div className="user-profile">
          <span className="icon icon-user"></span>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">Dr. Yılmaz</span>
              <span className="user-role">Veteriner Hekim</span>
            </div>
          )}
        </div>
        <button className="logout">
          <span className="icon icon-logout"></span>
          {!collapsed && <span className="text">Çıkış</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 