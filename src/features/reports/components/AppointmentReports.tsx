import React from 'react';

const AppointmentReports: React.FC = () => {
  return (
    <div className="appointment-reports">
      <h2>Randevu Raporları</h2>
      <div className="report-cards">
        <div className="report-card">
          <h3>Bu Ay Toplam</h3>
          <div className="report-value">89</div>
        </div>
        <div className="report-card">
          <h3>Tamamlanan</h3>
          <div className="report-value">76</div>
        </div>
        <div className="report-card">
          <h3>İptal Edilen</h3>
          <div className="report-value">8</div>
        </div>
        <div className="report-card">
          <h3>Bekleyen</h3>
          <div className="report-value">5</div>
        </div>
      </div>
      
      <div className="report-charts">
        <div className="chart-placeholder">
          <p>Günlük Randevu Dağılımı</p>
        </div>
        <div className="chart-placeholder">
          <p>Randevu Türleri</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReports; 