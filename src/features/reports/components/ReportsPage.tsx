import React from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import '../styles/Reports.css';

const ReportsPage: React.FC = () => {
  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Raporlar</h1>
        <p>Klinik raporlarınızı görüntüleyin ve analiz edin</p>
      </div>

      <div className="reports-navigation">
        <NavLink 
          to="/reports/animals" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Hayvan Raporları
        </NavLink>
        <NavLink 
          to="/reports/appointments" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Randevu Raporları
        </NavLink>
        <NavLink 
          to="/reports/financial" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Mali Raporlar
        </NavLink>
      </div>

      <div className="reports-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ReportsPage; 