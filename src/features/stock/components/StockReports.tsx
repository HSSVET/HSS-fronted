import React from 'react';
import '../styles/StockReports.css';

const StockReports: React.FC = () => {
    const downloadPDF = () => {
        alert('PDF raporu indiriliyor...');
    };

    const exportExcel = () => {
        alert('Excel raporu dışa aktarılıyor...');
    };

    return (
        <div className="reports-container">
            {/* Header */}
            <div className="reports-header">
                <div className="section-info">
                    <h2 className="section-title">Raporlar ve Analizler</h2>
                    <p className="section-subtitle">Envanter performansınızı ve trendlerinizi takip edin</p>
                </div>
                <div className="export-buttons">
                    <button className="export-btn pdf-btn" onClick={downloadPDF}>
                        📄 PDF İndir
                    </button>
                    <button className="export-btn excel-btn" onClick={exportExcel}>
                        📊 Excel'e Aktar
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-container">
                    <h3 className="chart-title">Aylık Stok Kullanım Trendleri</h3>
                    <div className="chart-placeholder">
                        <div className="mock-line-chart">
                            <div className="chart-lines">
                                <div className="line medications"></div>
                                <div className="line supplies"></div>
                                <div className="line vaccines"></div>
                            </div>
                            <div className="chart-legend">
                                <span className="legend-item medications">📊 İlaçlar</span>
                                <span className="legend-item supplies">📦 Malzemeler</span>
                                <span className="legend-item vaccines">💉 Aşılar</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-container">
                        <h3 className="chart-title">En Çok Kullanılan Ürünler</h3>
                        <div className="chart-placeholder">
                            <div className="mock-bar-chart">
                                <div className="bar" style={{ height: '80%' }}>Kedi Aşısı</div>
                                <div className="bar" style={{ height: '60%' }}>İbuprofen</div>
                                <div className="bar" style={{ height: '70%' }}>Cerrahi Eldiven</div>
                                <div className="bar" style={{ height: '50%' }}>Amoksisilin</div>
                                <div className="bar" style={{ height: '40%' }}>Kuduz Aşısı</div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3 className="chart-title">Stok Kategori Dağılımı</h3>
                        <div className="chart-placeholder">
                            <div className="mock-pie-chart">
                                <div className="pie-segment medications"></div>
                                <div className="pie-segment vaccines"></div>
                                <div className="pie-segment supplies"></div>
                                <div className="pie-segment equipment"></div>
                            </div>
                            <div className="pie-legend">
                                <span className="legend-item medications">İlaçlar 35%</span>
                                <span className="legend-item vaccines">Aşılar 25%</span>
                                <span className="legend-item supplies">Malzemeler 30%</span>
                                <span className="legend-item equipment">Ekipman 10%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-value">247</span>
                    <span className="stat-label">Toplam Ürün</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Düşük Stoklu Ürünler</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">3</span>
                    <span className="stat-label">Süresi Dolmuş Ürünler</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">15</span>
                    <span className="stat-label">Aktif Tedarikçi</span>
                </div>
            </div>
        </div>
    );
};

export default StockReports; 