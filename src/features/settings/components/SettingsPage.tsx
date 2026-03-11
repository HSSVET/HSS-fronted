import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/Settings.css';

const SettingsPage: React.FC = () => {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Ayarlar</h1>
        <p>Sistem ayarlarınızı yönetin</p>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          <NavLink
            to="profile"
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            Profil Ayarları
          </NavLink>
          <NavLink
            to="clinic"
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            Klinik Ayarları
          </NavLink>
          <NavLink
            to="users"
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            Kullanıcı Yönetimi
          </NavLink>
        </nav>

        <div className="settings-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 