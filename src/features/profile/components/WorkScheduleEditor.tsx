import React, { useState } from 'react';
import type { WorkSchedule } from '../services/profileService';
import '../styles/WorkScheduleEditor.css';

interface WorkScheduleEditorProps {
  schedules: WorkSchedule[];
  onUpdate: (schedules: WorkSchedule[]) => void;
}

const DAYS_OF_WEEK = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

const WorkScheduleEditor: React.FC<WorkScheduleEditorProps> = ({ schedules, onUpdate }) => {
  const [editedSchedules, setEditedSchedules] = useState<WorkSchedule[]>(schedules);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleDay = (dayIndex: number) => {
    const updated = [...editedSchedules];
    updated[dayIndex] = {
      ...updated[dayIndex],
      isActive: !updated[dayIndex].isActive,
    };
    setEditedSchedules(updated);
    setHasChanges(true);
  };

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...editedSchedules];
    updated[dayIndex] = {
      ...updated[dayIndex],
      [field]: value,
    };
    setEditedSchedules(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(editedSchedules);
    setHasChanges(false);
  };

  const handleReset = () => {
    setEditedSchedules(schedules);
    setHasChanges(false);
  };

  return (
    <div className="work-schedule-editor ui-card panel">
      <div className="schedule-header">
        <h2>Çalışma Programı</h2>
        <p className="schedule-description">
          Haftalık çalışma saatlerinizi düzenleyin. Bu bilgiler randevu planlamasında kullanılır.
        </p>
      </div>

      <div className="schedule-list">
        {editedSchedules.map((schedule, index) => (
          <div
            key={schedule.dayOfWeek}
            className={`schedule-day ${schedule.isActive ? 'active' : 'inactive'}`}
          >
            <div className="day-header">
              <label className="day-toggle">
                <input
                  type="checkbox"
                  checked={schedule.isActive}
                  onChange={() => handleToggleDay(index)}
                />
                <span className="day-name">{schedule.dayOfWeek}</span>
              </label>
            </div>

            {schedule.isActive && (
              <div className="time-inputs">
                <div className="time-input-group">
                  <label>Başlangıç</label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                  />
                </div>
                <span className="time-separator">—</span>
                <div className="time-input-group">
                  <label>Bitiş</label>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                  />
                </div>
              </div>
            )}

            {!schedule.isActive && (
              <div className="day-inactive-message">Kapalı</div>
            )}
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="schedule-actions">
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

export default WorkScheduleEditor;
