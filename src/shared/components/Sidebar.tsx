import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../context/AuthContext';
import { useKeycloak } from '@react-keycloak/web';
import '../styles/components/Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const { keycloak } = useKeycloak();
  
  React.useEffect(() => {
    if (collapsed) {
      document.body.classList.remove('sidebar-expanded');
    } else {
      document.body.classList.add('sidebar-expanded');
    }

    return () => {
      document.body.classList.remove('sidebar-expanded');
    };
  }, [collapsed]);
  
  // Menu items with permission requirements
  const allMenuItems = [
    { icon: 'icon-dashboard', text: 'Panel', path: '/dashboard', permission: 'dashboard:read' },
    { icon: 'icon-calendar', text: 'Randevular', path: '/appointments', permission: 'appointments:read' },
    { icon: 'icon-paw', text: 'Hastalar/Hayvanlar', path: '/animals', permission: 'animals:read' },
    { icon: 'icon-lab', text: 'Laboratuvar', path: '/laboratory', permission: 'laboratory:read' },
    { icon: 'icon-syringe', text: 'Aşı Yönetimi', path: '/vaccinations', permission: 'vaccinations:read' },
    { icon: 'icon-billing', text: 'Ödeme & Fatura', path: '/billing', permission: 'billing:read' },
    { icon: 'icon-box', text: 'Envanter/Stok', path: '/inventory', permission: 'inventory:read' },
    { icon: 'icon-chart', text: 'Raporlar', path: '/reports', permission: 'reports:read' },
    { icon: 'icon-settings', text: 'Ayarlar', path: '/settings', permission: 'settings:read' },
  ];

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => hasPermission(item.permission));

  // Handle logout
  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + '/login'
    });
  };

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
              <span className="user-name">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.username || 'Kullanıcı'}
              </span>
              <span className="user-role">
                {user?.roles?.includes('ADMIN') && 'Yönetici'}
                {user?.roles?.includes('VETERINER') && !user?.roles?.includes('ADMIN') && 'Veteriner Hekim'}
                {user?.roles?.includes('SEKRETER') && !user?.roles?.includes('ADMIN') && !user?.roles?.includes('VETERINER') && 'Sekreter'}
                {user?.roles?.includes('TEKNISYEN') && !user?.roles?.includes('ADMIN') && !user?.roles?.includes('VETERINER') && !user?.roles?.includes('SEKRETER') && 'Teknisyen'}
                {!user?.roles?.length && 'Kullanıcı'}
              </span>
            </div>
          )}
        </div>
        <button className="logout" onClick={handleLogout}>
          <span className="icon icon-logout"></span>
          {!collapsed && <span className="text">Çıkış</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 