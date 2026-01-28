import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../context/AuthContext';
import '../styles/components/Sidebar.css';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PetsIcon from '@mui/icons-material/Pets';
import PeopleIcon from '@mui/icons-material/People';
import BiotechIcon from '@mui/icons-material/Biotech';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmsIcon from '@mui/icons-material/Sms';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QueueIcon from '@mui/icons-material/Queue';
import LoginIcon from '@mui/icons-material/Login';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const { hasPermission } = usePermissions();
  const { user, logout } = useAuth();

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
    { icon: <DashboardIcon />, text: 'Panel', path: '/dashboard', permission: 'dashboard:read' },
    { icon: <CalendarMonthIcon />, text: 'Randevular', path: '/appointments', permission: 'appointments:read' },
    { icon: <QueueIcon />, text: 'Hasta Kuyruğu', path: '/queue', permission: 'appointments:read' },
    { icon: <LoginIcon />, text: 'Hasta Girişi', path: '/check-in', permission: 'appointments:write' },
    { icon: <PetsIcon />, text: 'Hastalar/Hayvanlar', path: '/animals', permission: 'animals:read' },
    { icon: <PeopleIcon />, text: 'Müşteriler', path: '/owners', permission: 'animals:read' }, // Using animals:read as proxy for now
    { icon: <BiotechIcon />, text: 'Laboratuvar', path: '/laboratory', permission: 'laboratory:read' },
    { icon: <VaccinesIcon />, text: 'Aşı Yönetimi', path: '/vaccinations', permission: 'vaccinations:read' },
    { icon: <ReceiptLongIcon />, text: 'Ödeme & Fatura', path: '/billing', permission: 'billing:read' },
    { icon: <NotificationsIcon />, text: 'Hatırlatmalar', path: '/reminders', permission: 'reminders:read' },
    { icon: <SmsIcon />, text: 'SMS', path: '/sms', permission: 'sms:read' },
    { icon: <InventoryIcon />, text: 'Envanter/Stok', path: '/inventory', permission: 'inventory:read' },
    { icon: <DescriptionIcon />, text: 'Belgeler/Kontratlar', path: '/documents', permission: 'documents:read' },
    { icon: <SettingsIcon />, text: 'Ayarlar', path: '/settings', permission: 'settings:read' },
  ];

  // Helper to construct path
  const getFullPath = (path: string) => {
    if (slug) {
      return `/clinic/${slug}${path}`;
    }
    // Fallback if not in clinic context (though Sidebar is mainly used there)
    return path;
  };

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => hasPermission(item.permission));

  // Handle logout
  const handleLogout = () => {
    // Offline veya online fark etmeksizin AuthContext.logout kullan
    logout();
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        {!collapsed && (
          <div className="logo-wrapper">
            <img src="/logo192.png" alt="VetKlinik Logo" className="sidebar-logo" />
            <h2>VetKlinik</h2>
          </div>
        )}
        {collapsed && (
          <div className="logo-wrapper" style={{ paddingLeft: '4px' }}>
            <img src="/logo192.png" alt="VK" className="sidebar-logo" style={{ height: '24px' }} />
          </div>
        )}
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      <div className="menu-container">
        {menuItems.map((item, index) => {
          const fullPath = getFullPath(item.path);
          const isActive = location.pathname.startsWith(fullPath);
          return (
            <Link
              key={index}
              to={fullPath}
              className={`menu-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.text : ''}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="text">{item.text}</span>}
            </Link>
          );
        })}
      </div>

      <div className="user-container">
        <div className="user-profile">
          <span className="icon"><AccountCircleIcon /></span>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || 'Kullanıcı'}
              </span>
              <span className="user-role">
                {user?.roles?.includes('ADMIN') && 'Yönetici'}
                {(user?.roles?.includes('VETERINER') || user?.roles?.includes('VET') || user?.roles?.includes('VETERINARIAN')) && !user?.roles?.includes('ADMIN') && 'Veteriner Hekim'}
                {(user?.roles?.includes('SEKRETER') || user?.roles?.includes('CLINIC_STAFF') || user?.roles?.includes('STAFF')) && !user?.roles?.includes('ADMIN') && !user?.roles?.includes('VETERINER') && !user?.roles?.includes('VET') && !user?.roles?.includes('VETERINARIAN') && 'Sekreter'}
                {user?.roles?.includes('TEKNISYEN') && !user?.roles?.includes('ADMIN') && !user?.roles?.includes('VETERINER') && !user?.roles?.includes('VET') && !user?.roles?.includes('VETERINARIAN') && !user?.roles?.includes('SEKRETER') && !user?.roles?.includes('CLINIC_STAFF') && 'Teknisyen'}
                {user?.roles?.includes('OWNER') && !user?.roles?.includes('ADMIN') && !user?.roles?.includes('VETERINER') && !user?.roles?.includes('VET') && !user?.roles?.includes('VETERINARIAN') && 'Hayvan Sahibi'}
                {!user?.roles?.length && 'Kullanıcı'}
              </span>
            </div>
          )}
        </div>
        <button className="logout" onClick={handleLogout} title={collapsed ? 'Çıkış' : ''}>
          <span className="icon"><LogoutIcon /></span>
          {!collapsed && <span className="text">Çıkış</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 