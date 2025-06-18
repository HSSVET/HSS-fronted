import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/LabEquipmentWidget.css';

const LabEquipmentWidget: React.FC = () => {
  const navigate = useNavigate();

  const equipment = [
    {
      id: 'EQ001',
      name: 'Hematoloji Cihazı',
      model: 'VetScan HM5',
      status: 'active' as const,
      lastMaintenance: '10.06.2023',
      nextMaintenance: '10.09.2023',
      testsToday: 12
    },
    {
      id: 'EQ002',
      name: 'Biyokimya Analizörü',
      model: 'IDEXX Catalyst Dx',
      status: 'maintenance' as const,
      lastMaintenance: '15.06.2023',
      nextMaintenance: '15.09.2023',
      testsToday: 0
    },
    {
      id: 'EQ003',
      name: 'Mikroskop',
      model: 'Olympus CX23',
      status: 'active' as const,
      lastMaintenance: '01.06.2023',
      nextMaintenance: '01.12.2023',
      testsToday: 8
    },
    {
      id: 'EQ004',
      name: 'Centrifüj',
      model: 'EBA 200',
      status: 'warning' as const,
      lastMaintenance: '20.05.2023',
      nextMaintenance: '20.06.2023',
      testsToday: 15
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'equipment-active';
      case 'maintenance': return 'equipment-maintenance';
      case 'warning': return 'equipment-warning';
      case 'error': return 'equipment-error';
      default: return 'equipment-unknown';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'maintenance': return 'Bakımda';
      case 'warning': return 'Uyarı';
      case 'error': return 'Hata';
      default: return 'Bilinmiyor';
    }
  };

  const handleEquipmentClick = (equipmentId: string) => {
    navigate(`/laboratory/equipment/${equipmentId}`);
  };

  return (
    <div className="widget lab-equipment-widget">
      <div className="widget-header">
        <h2><span className="icon icon-monitor"></span> Laboratuvar Ekipmanları</h2>
        <button className="view-all-btn" onClick={() => navigate('/laboratory/equipment')}>
          Tümünü Gör
        </button>
      </div>
      <div className="widget-content">
        <div className="equipment-list">
          {equipment.map((eq) => (
            <div 
              key={eq.id} 
              className="equipment-item"
              onClick={() => handleEquipmentClick(eq.id)}
            >
              <div className="equipment-header">
                <span className="equipment-name">{eq.name}</span>
                <span className={`equipment-status ${getStatusClass(eq.status)}`}>
                  {getStatusText(eq.status)}
                </span>
              </div>
              <div className="equipment-model">{eq.model}</div>
              <div className="equipment-stats">
                <div className="stat">
                  <span className="stat-label">Bugünkü Testler:</span>
                  <span className="stat-value">{eq.testsToday}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Sonraki Bakım:</span>
                  <span className="stat-value">{eq.nextMaintenance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabEquipmentWidget; 