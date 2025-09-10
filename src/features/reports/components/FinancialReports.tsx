import React from 'react';

const FinancialReports: React.FC = () => {
  return (
    <div className="financial-reports">
      <h2>Mali Raporlar</h2>
      <div className="report-cards">
        <div className="report-card">
          <h3>Bu Ay Gelir</h3>
          <div className="report-value">₺45,670</div>
        </div>
        <div className="report-card">
          <h3>Bekleyen Ödemeler</h3>
          <div className="report-value">₺12,340</div>
        </div>
        <div className="report-card">
          <h3>Tamamlanan Ödemeler</h3>
          <div className="report-value">₺33,330</div>
        </div>
        <div className="report-card">
          <h3>Ortalama Fatura</h3>
          <div className="report-value">₺285</div>
        </div>
      </div>
      
      <div className="report-charts">
        <div className="chart-placeholder">
          <p>Aylık Gelir Trendi</p>
        </div>
        <div className="chart-placeholder">
          <p>Ödeme Yöntemleri Dağılımı</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports; 