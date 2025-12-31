import React, { useState, useEffect } from 'react';
import { InvoiceRuleService, InvoiceRule, InvoiceRuleType } from '../services/invoiceRuleService';
import './InvoiceRules.css';

export const InvoiceRules: React.FC = () => {
  const [rules, setRules] = useState<InvoiceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadRules();
  }, [showActiveOnly]);

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = showActiveOnly
        ? await InvoiceRuleService.getActiveRules()
        : await InvoiceRuleService.getAllRules();

      if (response.success) {
        setRules(response.data);
      } else {
        setError(response.error || 'Fatura kuralları yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kuralı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await InvoiceRuleService.deleteRule(id);
      if (response.success) {
        await loadRules();
      } else {
        setError(response.error || 'Kural silinemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (rule: InvoiceRule) => {
    setLoading(true);
    setError(null);
    try {
      const response = await InvoiceRuleService.updateRule(rule.ruleId, {
        isActive: !rule.isActive,
      });

      if (response.success) {
        await loadRules();
      } else {
        setError(response.error || 'Kural güncellenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await InvoiceRuleService.processAllRules();
      if (response.success) {
        alert('Tüm kurallar işlendi');
      } else {
        setError(response.error || 'Kurallar işlenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getRuleTypeLabel = (type: InvoiceRuleType): string => {
    const labels: Record<InvoiceRuleType, string> = {
      APPOINTMENT_AFTER: 'Randevu Sonrası',
      MONTHLY_SUBSCRIPTION: 'Aylık Abonelik',
      TREATMENT_AFTER: 'Tedavi Sonrası',
      VACCINATION_AFTER: 'Aşı Sonrası',
      LAB_TEST_AFTER: 'Lab Test Sonrası',
      CUSTOM: 'Özel Kural',
    };
    return labels[type];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="invoice-rules">
      <div className="rules-header">
        <h2>Fatura Oluşturma Kuralları</h2>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
          >
            Yeni Kural
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleProcessAll}
            disabled={loading}
          >
            Tümünü İşle
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="rules-filters">
        <label>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />
          Sadece Aktif Kurallar
        </label>
        <button
          className="btn btn-secondary btn-sm"
          onClick={loadRules}
          disabled={loading}
        >
          Yenile
        </button>
      </div>

      {loading && rules.length === 0 ? (
        <div className="loading">Yükleniyor...</div>
      ) : rules.length === 0 ? (
        <div className="no-rules">Fatura kuralı bulunmamaktadır.</div>
      ) : (
        <div className="rules-list">
          {rules.map((rule) => (
            <div
              key={rule.ruleId}
              className={`rule-item ${!rule.isActive ? 'inactive' : ''}`}
            >
              <div className="rule-header">
                <div className="rule-title">
                  <strong>{rule.ruleName}</strong>
                  <span className="rule-type">{getRuleTypeLabel(rule.ruleType)}</span>
                </div>
                <div className="rule-badges">
                  <span className={`status-badge ${rule.isActive ? 'active' : 'inactive'}`}>
                    {rule.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  {rule.priority > 0 && (
                    <span className="priority-badge">Öncelik: {rule.priority}</span>
                  )}
                </div>
              </div>

              <div className="rule-details">
                {rule.triggerEntity && (
                  <div className="detail-row">
                    <span className="detail-label">Tetikleyici:</span>
                    <span className="detail-value">{rule.triggerEntity}</span>
                  </div>
                )}
                {rule.triggerStatus && (
                  <div className="detail-row">
                    <span className="detail-label">Durum:</span>
                    <span className="detail-value">{rule.triggerStatus}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Vade Günü:</span>
                  <span className="detail-value">{rule.dueDays} gün</span>
                </div>
                {rule.description && (
                  <div className="detail-row">
                    <span className="detail-label">Açıklama:</span>
                    <span className="detail-value">{rule.description}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Oluşturulma:</span>
                  <span className="detail-value">{formatDate(rule.createdAt)}</span>
                </div>
              </div>

              <div className="rule-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleToggleActive(rule)}
                  disabled={loading}
                >
                  {rule.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(rule.ruleId)}
                  disabled={loading}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Yeni Fatura Kuralı</h3>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Fatura kuralı oluşturma formu burada olacak.</p>
              <p className="info-text">
                Şu anda basit bir görünüm gösteriliyor. Detaylı form implementasyonu için
                ayrı bir component oluşturulabilir.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

