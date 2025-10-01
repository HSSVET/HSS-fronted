import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AddItemModal from './AddItemModal';
import '../styles/Inventory.css';

const InventoryPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <h1>Envanter Yönetimi</h1>
        <div className="header-actions">
          <button 
            className="add-item-button"
            onClick={() => setShowAddModal(true)}
          >
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      <div className="inventory-navigation">
        <NavLink 
          to="/inventory/medicines" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          İlaç Stoku
        </NavLink>
        <NavLink 
          to="/inventory/supplies" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Malzeme Stoku
        </NavLink>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <h3>Toplam Ürün</h3>
          <div className="stat-value">245</div>
        </div>
        <div className="stat-card">
          <h3>Düşük Stok</h3>
          <div className="stat-value warning">12</div>
        </div>
        <div className="stat-card">
          <h3>Süresi Dolacak</h3>
          <div className="stat-value danger">3</div>
        </div>
        <div className="stat-card">
          <h3>Bu Ay Kullanım</h3>
          <div className="stat-value">₺8,450</div>
        </div>
      </div>

      <div className="inventory-content">
        <Outlet />
      </div>

      {showAddModal && (
        <AddItemModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default InventoryPage; 