import React, { useState } from 'react';
import type { DashboardPreference } from '../services/profileService';
import '../styles/DashboardCustomizer.css';

interface DashboardCustomizerProps {
  preferences: DashboardPreference[];
  onUpdate: (preferences: DashboardPreference[]) => void;
}

const AVAILABLE_WIDGETS = [
  { id: 'appointments', name: 'Randevular', icon: '📅', description: 'Günlük randevu takvimi' },
  { id: 'patients', name: 'Hastalar', icon: '🐾', description: 'Son bakılan hastalar' },
  { id: 'lab-results', name: 'Laboratuvar', icon: '🧪', description: 'Bekleyen test sonuçları' },
  { id: 'notifications', name: 'Bildirimler', icon: '🔔', description: 'Sistem bildirimleri' },
  { id: 'stats', name: 'İstatistikler', icon: '📊', description: 'Genel istatistikler' },
  { id: 'stock-alerts', name: 'Stok Uyarıları', icon: '⚠️', description: 'Düşük stok bildirimleri' },
  { id: 'calendar', name: 'Takvim', icon: '📆', description: 'Aylık takvim görünümü' },
  { id: 'recent-activity', name: 'Son Aktiviteler', icon: '⚡', description: 'Son yapılan işlemler' },
];

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ preferences, onUpdate }) => {
  const [editedPreferences, setEditedPreferences] = useState<DashboardPreference[]>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleWidget = (widgetId: string) => {
    const existingIndex = editedPreferences.findIndex(p => p.widgetId === widgetId);
    
    if (existingIndex >= 0) {
      // Widget zaten var, görünürlüğünü değiştir
      const updated = [...editedPreferences];
      updated[existingIndex] = {
        ...updated[existingIndex],
        isVisible: !updated[existingIndex].isVisible,
      };
      setEditedPreferences(updated);
    } else {
      // Widget yok, ekle
      const newPreference: DashboardPreference = {
        widgetId,
        isVisible: true,
        position: editedPreferences.length + 1,
      };
      setEditedPreferences([...editedPreferences, newPreference]);
    }
    
    setHasChanges(true);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const updated = [...editedPreferences];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    
    // Pozisyonları güncelle
    updated.forEach((pref, idx) => {
      pref.position = idx + 1;
    });
    
    setEditedPreferences(updated);
    setHasChanges(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === editedPreferences.length - 1) return;
    
    const updated = [...editedPreferences];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    
    // Pozisyonları güncelle
    updated.forEach((pref, idx) => {
      pref.position = idx + 1;
    });
    
    setEditedPreferences(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(editedPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setEditedPreferences(preferences);
    setHasChanges(false);
  };

  const isWidgetVisible = (widgetId: string) => {
    const pref = editedPreferences.find(p => p.widgetId === widgetId);
    return pref?.isVisible ?? false;
  };

  return (
    <div className="dashboard-customizer ui-card panel">
      <div className="customizer-header">
        <h2>Dashboard Özelleştirme</h2>
        <p className="customizer-description">
          Dashboard'unuzda görmek istediğiniz widget'ları seçin ve sırasını düzenleyin.
        </p>
      </div>

      <div className="widgets-section">
        <h3>Mevcut Widget'lar</h3>
        <div className="available-widgets">
          {AVAILABLE_WIDGETS.map((widget) => (
            <div
              key={widget.id}
              className={`widget-card ${isWidgetVisible(widget.id) ? 'active' : 'inactive'}`}
            >
              <div className="widget-info">
                <span className="widget-icon">{widget.icon}</span>
                <div className="widget-details">
                  <h4>{widget.name}</h4>
                  <p>{widget.description}</p>
                </div>
              </div>
              <label className="widget-toggle">
                <input
                  type="checkbox"
                  checked={isWidgetVisible(widget.id)}
                  onChange={() => handleToggleWidget(widget.id)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="widgets-section">
        <h3>Widget Sıralaması</h3>
        <div className="widget-order-list">
          {editedPreferences
            .filter(p => p.isVisible)
            .sort((a, b) => a.position - b.position)
            .map((pref, index) => {
              const widget = AVAILABLE_WIDGETS.find(w => w.id === pref.widgetId);
              if (!widget) return null;

              return (
                <div key={pref.widgetId} className="order-item">
                  <div className="order-info">
                    <span className="order-position">{index + 1}</span>
                    <span className="order-icon">{widget.icon}</span>
                    <span className="order-name">{widget.name}</span>
                  </div>
                  <div className="order-actions">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="order-button"
                      title="Yukarı taşı"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === editedPreferences.filter(p => p.isVisible).length - 1}
                      className="order-button"
                      title="Aşağı taşı"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {hasChanges && (
        <div className="customizer-actions">
          <button onClick={handleReset} className="action-button secondary">
            İptal
          </button>
          <button onClick={handleSave} className="action-button primary">
            Değişiklikleri Kaydet
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardCustomizer;
