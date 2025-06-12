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
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const menuItems = [
    { icon: FaTachometerAlt({}), text: 'Panel', path: '#' },
    { icon: FaCalendarAlt({}), text: 'Randevular', path: '#' },
    { icon: FaPaw({}), text: 'Hastalar/Hayvanlar', path: '#' },
    { icon: FaBoxes({}), text: 'Envanter/Stok', path: '#' },
    { icon: FaChartBar({}), text: 'Raporlar', path: '#' },
    { icon: FaCog({}), text: 'Ayarlar', path: '#' },
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
          <a key={index} href={item.path} className="menu-item">
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
        <button className="logout">
          <span className="icon">{FaSignOutAlt({})}</span>
          {!collapsed && <span className="text">Çıkış</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 