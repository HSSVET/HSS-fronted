import React, { useState, useEffect } from 'react';
import { StockMovement, MovementType } from '../types';
import { stockService } from '../services/stockService';
import '../styles/StockMovements.css';

const StockMovements: React.FC = () => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | MovementType>('all');

    useEffect(() => {
        loadMovements();
    }, []);

    const loadMovements = async () => {
        try {
            setLoading(true);
            const movementData = await stockService.getMovements();
            setMovements(movementData);
        } catch (error) {
            console.error('Error loading movements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMovementIcon = (type: MovementType) => {
        return type === MovementType.INBOUND ? '📥' : '📤';
    };

    const getMovementLabel = (type: MovementType) => {
        return type === MovementType.INBOUND ? 'Inbound' : 'Outbound';
    };

    const filteredMovements = filter === 'all'
        ? movements
        : movements.filter(movement => movement.type === filter);

    if (loading) {
        return (
            <div className="movements-container">
                <div className="loading-state">Hareketler yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="movements-container">
            {/* Header */}
            <div className="movements-header">
                <div className="section-info">
                    <h2 className="section-title">Stock Movement Log</h2>
                    <p className="section-subtitle">Track all inventory movements and transactions</p>
                </div>
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search movements..."
                        className="search-input"
                    />
                    <select
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                    >
                        <option value="all">All Movements</option>
                        <option value={MovementType.INBOUND}>Inbound</option>
                        <option value={MovementType.OUTBOUND}>Outbound</option>
                    </select>
                </div>
            </div>

            {/* Movement History */}
            <div className="movement-history">
                <h3 className="section-subtitle">Movement History</h3>

                <div className="movements-table-container">
                    <table className="movements-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Staff Member</th>
                                <th>Supplier</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMovements.map((movement) => (
                                <tr key={movement.id} className="movement-row">
                                    <td className="movement-date">
                                        📅 {new Date(movement.date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="movement-product">
                                        <div className="product-info">
                                            <span className="product-name">{movement.productName}</span>
                                            <span className="product-code">{movement.productCode}</span>
                                        </div>
                                    </td>
                                    <td className="movement-type">
                                        <span className={`movement-badge ${movement.type}`}>
                                            {getMovementIcon(movement.type)} {getMovementLabel(movement.type)}
                                        </span>
                                    </td>
                                    <td className="movement-quantity">
                                        <span className={`quantity-value ${movement.type}`}>
                                            {movement.type === MovementType.INBOUND ? '+' : '-'}{movement.quantity}
                                        </span>
                                    </td>
                                    <td className="movement-staff">{movement.staffMember}</td>
                                    <td className="movement-supplier">{movement.supplier || '-'}</td>
                                    <td className="movement-notes">{movement.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredMovements.length === 0 && (
                        <div className="empty-state">
                            <p>Hiç hareket bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Movement Stats */}
            <div className="movement-stats">
                <div className="stat-card">
                    <span className="stat-icon">📥</span>
                    <div className="stat-info">
                        <span className="stat-value">150</span>
                        <span className="stat-label">Total Inbound This Week</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📤</span>
                    <div className="stat-info">
                        <span className="stat-value">48</span>
                        <span className="stat-label">Total Outbound This Week</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📈</span>
                    <div className="stat-info">
                        <span className="stat-value">102</span>
                        <span className="stat-label">Net Stock Increase</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockMovements; 