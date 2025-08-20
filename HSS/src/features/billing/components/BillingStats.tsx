import React from 'react';
import { BillingStatsData } from '../types';

interface BillingStatsProps {
  stats: BillingStatsData;
}

export const BillingStats: React.FC<BillingStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="billing-stats">
      <div className="stat-card revenue">
        <div className="stat-title">Toplam Gelir</div>
        <div className="stat-value currency">{formatCurrency(stats.totalRevenue)}</div>
        <div className="stat-change positive">+12% bu ay</div>
      </div>

      <div className="stat-card pending">
        <div className="stat-title">Bekleyen Ödemeler</div>
        <div className="stat-value currency">{formatCurrency(stats.pendingPayments)}</div>
        <div className="stat-change">{stats.unpaidInvoices} fatura</div>
      </div>

      <div className="stat-card overdue">
        <div className="stat-title">Geciken Ödemeler</div>
        <div className="stat-value currency negative">{formatCurrency(stats.overduePayments)}</div>
        <div className="stat-change negative">⚠️ Takip gerekli</div>
      </div>

      <div className="stat-card invoices">
        <div className="stat-title">Toplam Fatura</div>
        <div className="stat-value">{stats.totalInvoices}</div>
        <div className="stat-change positive">{stats.paidInvoices} ödendi</div>
      </div>
    </div>
  );
}; 