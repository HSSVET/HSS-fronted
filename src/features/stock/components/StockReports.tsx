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
                    <h2 className="section-title">Reports & Analytics</h2>
                    <p className="section-subtitle">Track your inventory performance and trends</p>
                </div>
                <div className="export-buttons">
                    <button className="export-btn pdf-btn" onClick={downloadPDF}>
                        📄 Download PDF
                    </button>
                    <button className="export-btn excel-btn" onClick={exportExcel}>
                        📊 Export Excel
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-container">
                    <h3 className="chart-title">Monthly Stock Usage Trends</h3>
                    <div className="chart-placeholder">
                        <div className="mock-line-chart">
                            <div className="chart-lines">
                                <div className="line medications"></div>
                                <div className="line supplies"></div>
                                <div className="line vaccines"></div>
                            </div>
                            <div className="chart-legend">
                                <span className="legend-item medications">📊 Medications</span>
                                <span className="legend-item supplies">📦 Supplies</span>
                                <span className="legend-item vaccines">💉 Vaccines</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-container">
                        <h3 className="chart-title">Most Used Products</h3>
                        <div className="chart-placeholder">
                            <div className="mock-bar-chart">
                                <div className="bar" style={{ height: '80%' }}>Feline Vaccine</div>
                                <div className="bar" style={{ height: '60%' }}>Ibuprofen</div>
                                <div className="bar" style={{ height: '70%' }}>Surgical Gloves</div>
                                <div className="bar" style={{ height: '50%' }}>Amoxicillin</div>
                                <div className="bar" style={{ height: '40%' }}>Rabies Vaccine</div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3 className="chart-title">Stock Category Distribution</h3>
                        <div className="chart-placeholder">
                            <div className="mock-pie-chart">
                                <div className="pie-segment medications"></div>
                                <div className="pie-segment vaccines"></div>
                                <div className="pie-segment supplies"></div>
                                <div className="pie-segment equipment"></div>
                            </div>
                            <div className="pie-legend">
                                <span className="legend-item medications">Medications 35%</span>
                                <span className="legend-item vaccines">Vaccines 25%</span>
                                <span className="legend-item supplies">Supplies 30%</span>
                                <span className="legend-item equipment">Equipment 10%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-value">247</span>
                    <span className="stat-label">Total Products</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Low Stock Items</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">3</span>
                    <span className="stat-label">Expired Items</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">15</span>
                    <span className="stat-label">Suppliers Active</span>
                </div>
            </div>
        </div>
    );
};

export default StockReports; 