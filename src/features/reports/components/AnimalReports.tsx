import React from 'react';

const AnimalReports: React.FC = () => {
  return (
    <div className="animal-reports">
      <h2>Hayvan Raporları</h2>
      <div className="report-cards">
        <div className="report-card">
          <h3>Toplam Hayvan Sayısı</h3>
          <div className="report-value">156</div>
        </div>
        <div className="report-card">
          <h3>Bu Ay Kayıt Olan</h3>
          <div className="report-value">12</div>
        </div>
        <div className="report-card">
          <h3>Aktif Tedaviler</h3>
          <div className="report-value">23</div>
        </div>
        <div className="report-card">
          <h3>Aşı Bekleyen</h3>
          <div className="report-value">8</div>
        </div>
      </div>
      
      <div className="report-charts">
        <div className="chart-placeholder">
          <p>Tür Dağılımı Grafiği</p>
        </div>
        <div className="chart-placeholder">
          <p>Yaş Dağılımı Grafiği</p>
        </div>
      </div>
    </div>
  );
};

export default AnimalReports; 