import React from 'react';
import '../../styles/components/LabStatsWidget.css';

const LabStatsWidget: React.FC = () => {
  return (
    <div className="stats-container lab-stats">
      <div className="stat-card">
        <h3>Bekleyen Testler</h3>
        <div className="stat-value">18</div>
        <div className="stat-trend positive">+3 bugün</div>
      </div>
      <div className="stat-card">
        <h3>Tamamlanan Testler</h3>
        <div className="stat-value">127</div>
        <div className="stat-trend positive">Bu hafta</div>
      </div>
      <div className="stat-card">
        <h3>Sonuç Bekleyen</h3>
        <div className="stat-value">8</div>
        <div className="stat-trend neutral">Dış lab</div>
      </div>
      <div className="stat-card">
        <h3>Kritik Sonuçlar</h3>
        <div className="stat-value">3</div>
        <div className="stat-trend negative">Acil kontrol</div>
      </div>
    </div>
  );
};

export default LabStatsWidget; 