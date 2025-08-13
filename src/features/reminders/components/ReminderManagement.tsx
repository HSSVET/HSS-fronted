import React, { useState, useEffect } from 'react';
import './ReminderManagement.css';

interface Reminder {
  id: string;
  appointmentId: string;
  channel: 'SMS' | 'EMAIL';
  sendTime: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  animalName?: string;
  ownerName?: string;
  appointmentDate?: string;
}

interface ReminderManagementProps {
  appointmentId?: string;
  showCreateButton?: boolean;
}

const ReminderManagement: React.FC<ReminderManagementProps> = ({
  appointmentId,
  showCreateButton = true
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    appointmentId: appointmentId || '',
    channel: 'SMS' as 'SMS' | 'EMAIL',
    sendTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    fetchReminders();
    fetchSystemStatus();
  }, [appointmentId]);

  const fetchReminders = async () => {
    try {
      // API çağrısı placeholder - gerçek API implement edildiğinde güncellenecek
      // const response = await fetch('/api/reminders');
      // const data = await response.json();
      
      // Şimdilik mock data
      const mockReminders: Reminder[] = [
        {
          id: '1',
          appointmentId: '123',
          channel: 'SMS',
          sendTime: '2024-01-14T09:00:00',
          status: 'PENDING',
          animalName: 'Max',
          ownerName: 'Ahmet Yılmaz',
          appointmentDate: '2024-01-15T10:00:00'
        },
        {
          id: '2',
          appointmentId: '123',
          channel: 'EMAIL',
          sendTime: '2024-01-14T09:00:00',
          status: 'SENT',
          animalName: 'Max',
          ownerName: 'Ahmet Yılmaz',
          appointmentDate: '2024-01-15T10:00:00'
        }
      ];
      
      setReminders(appointmentId ? 
        mockReminders.filter(r => r.appointmentId === appointmentId) : 
        mockReminders
      );
    } catch (error) {
      console.error('Hatırlatmalar alınırken hata:', error);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      // API çağrısı placeholder
      setSystemStatus({
        schedulerEnabled: true,
        lastProcessTime: new Date().toISOString(),
        totalProcessed: 156,
        successRate: 95.2
      });
    } catch (error) {
      console.error('Sistem durumu alınırken hata:', error);
    }
  };

  const createReminder = async () => {
    if (!newReminder.appointmentId || !newReminder.sendTime) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      // API çağrısı placeholder
      const response = await fetch('/api/reminders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReminder)
      });

      if (response.ok) {
        fetchReminders();
        setShowCreateForm(false);
        setNewReminder({
          appointmentId: appointmentId || '',
          channel: 'SMS',
          sendTime: ''
        });
        alert('Hatırlatma oluşturuldu!');
      } else {
        alert('Hatırlatma oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Hatırlatma oluşturulurken hata:', error);
      alert('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const processReminders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reminders/process', {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.processedCount} hatırlatma işlendi`);
        fetchReminders();
      } else {
        alert('Hatırlatmalar işlenirken hata oluştu');
      }
    } catch (error) {
      console.error('Hatırlatmalar işlenirken hata:', error);
      alert('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async (channel: 'SMS' | 'EMAIL') => {
    const destination = prompt(`Test ${channel} için ${channel === 'SMS' ? 'telefon numarası' : 'email adresi'} girin:`);
    if (!destination) return;

    setLoading(true);
    try {
      const response = await fetch('/api/reminders/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel, destination })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        alert('Test bildirimi gönderilirken hata oluştu');
      }
    } catch (error) {
      console.error('Test bildirimi gönderilirken hata:', error);
      alert('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('tr-TR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return '#22c55e';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SENT': return 'Gönderildi';
      case 'PENDING': return 'Beklemede';
      case 'FAILED': return 'Başarısız';
      default: return status;
    }
  };

  return (
    <div className="reminder-management">
      <div className="reminder-management-header">
        <h2>🔔 Hatırlatma Yönetimi</h2>
        
        {systemStatus && (
          <div className="system-status">
            <div className="status-item">
              <span className="status-label">Sistem:</span>
              <span className={`status-value ${systemStatus.schedulerEnabled ? 'active' : 'inactive'}`}>
                {systemStatus.schedulerEnabled ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Başarı Oranı:</span>
              <span className="status-value">{systemStatus.successRate}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="reminder-actions">
        {showCreateButton && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={loading}
          >
            ➕ Yeni Hatırlatma
          </button>
        )}
        
        <button 
          className="btn btn-secondary"
          onClick={processReminders}
          disabled={loading}
        >
          🔄 Hatırlatmaları İşle
        </button>

        <button 
          className="btn btn-info"
          onClick={() => testNotification('SMS')}
          disabled={loading}
        >
          📱 SMS Test
        </button>

        <button 
          className="btn btn-info"
          onClick={() => testNotification('EMAIL')}
          disabled={loading}
        >
          ✉️ Email Test
        </button>
      </div>

      {showCreateForm && (
        <div className="create-reminder-form">
          <h3>Yeni Hatırlatma Oluştur</h3>
          <div className="form-group">
            <label>Randevu ID:</label>
            <input
              type="text"
              value={newReminder.appointmentId}
              onChange={(e) => setNewReminder({...newReminder, appointmentId: e.target.value})}
              placeholder="Randevu ID"
              disabled={!!appointmentId}
            />
          </div>
          
          <div className="form-group">
            <label>Kanal:</label>
            <select
              value={newReminder.channel}
              onChange={(e) => setNewReminder({...newReminder, channel: e.target.value as 'SMS' | 'EMAIL'})}
            >
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Gönderim Zamanı:</label>
            <input
              type="datetime-local"
              value={newReminder.sendTime}
              onChange={(e) => setNewReminder({...newReminder, sendTime: e.target.value})}
            />
          </div>
          
          <div className="form-actions">
            <button 
              className="btn btn-primary"
              onClick={createReminder}
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowCreateForm(false)}
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="reminders-list">
        <h3>Hatırlatmalar</h3>
        {reminders.length === 0 ? (
          <p className="no-reminders">Henüz hatırlatma bulunmuyor.</p>
        ) : (
          <div className="reminders-table">
            <div className="table-header">
              <div>ID</div>
              <div>Hayvan</div>
              <div>Sahip</div>
              <div>Kanal</div>
              <div>Gönderim Zamanı</div>
              <div>Durum</div>
            </div>
            {reminders.map((reminder) => (
              <div key={reminder.id} className="table-row">
                <div>{reminder.id}</div>
                <div>{reminder.animalName || '-'}</div>
                <div>{reminder.ownerName || '-'}</div>
                <div>
                  <span className={`channel-badge ${reminder.channel.toLowerCase()}`}>
                    {reminder.channel}
                  </span>
                </div>
                <div>{formatDateTime(reminder.sendTime)}</div>
                <div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(reminder.status) }}
                  >
                    {getStatusText(reminder.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderManagement;
