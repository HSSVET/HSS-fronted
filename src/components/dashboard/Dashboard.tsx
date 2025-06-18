import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/Dashboard.css';
import CalendarWidget from '../ui/CalendarWidget';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data mapping animal names to IDs for navigation
  const animalIdMap: { [key: string]: number } = {
    'Max': 4,
    'Bıdık': 1, // Using Pamuk's ID as fallback
    'Karabaş': 2,
    'Pamuk': 1,
    'Minnoş': 1, // Using Pamuk's ID as fallback
    'Luna': 1, // Using Pamuk's ID as fallback
    'Rocky': 2, // Using Karabaş's ID as fallback
    'Çomar': 2, // Using Karabaş's ID as fallback
  };

  const handleAnimalClick = (animalName: string) => {
    // Extract just the animal name (before parentheses if they exist)
    const cleanName = animalName.split(' (')[0];
    const animalId = animalIdMap[cleanName] || 1; // Default to ID 1 if not found
    navigate(`/animals/${animalId}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Veteriner Paneli</h1>
        <div className="quick-actions">
          <button className="action-button">
            <span className="icon icon-plus"></span>
            Yeni Randevu
          </button>
          <button className="action-button">
            <span className="icon icon-plus"></span>
            Yeni Hasta Kaydı
          </button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Toplam Aktif Hasta</h3>
          <div className="stat-value">248</div>
        </div>
        <div className="stat-card">
          <h3>Bugünkü Randevular</h3>
          <div className="stat-value">14</div>
        </div>
        <div className="stat-card">
          <h3>Klinikte Bulunan Hayvanlar</h3>
          <div className="stat-value">5</div>
        </div>
      </div>

      <div className="widgets-container three-column">
        <div className="widget hospitalized-patients-widget">
          <div className="widget-header">
            <h2><span className="icon icon-hospital"></span> Klinikte Yatan Hastalar</h2>
          </div>
          <div className="widget-content">
            <table className="hospitalized-patients-table">
              <thead>
                <tr>
                  <th>Hasta</th>
                  <th>Yatış Tarihi</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span 
                      className="clickable-animal-name" 
                      onClick={() => handleAnimalClick('Max (Köpek)')}
                    >
                      Max (Köpek)
                    </span>
                  </td>
                  <td>12.06.2023</td>
                  <td><span className="status-stable">Stabil</span></td>
                </tr>
                <tr>
                  <td>
                    <span 
                      className="clickable-animal-name" 
                      onClick={() => handleAnimalClick('Bıdık (Kedi)')}
                    >
                      Bıdık (Kedi)
                    </span>
                  </td>
                  <td>13.06.2023</td>
                  <td><span className="status-improving">İyileşiyor</span></td>
                </tr>
                <tr>
                  <td>
                    <span 
                      className="clickable-animal-name" 
                      onClick={() => handleAnimalClick('Karabaş (Köpek)')}
                    >
                      Karabaş (Köpek)
                    </span>
                  </td>
                  <td>11.06.2023</td>
                  <td><span className="status-critical">Kritik</span></td>
                </tr>
                <tr>
                  <td>
                    <span 
                      className="clickable-animal-name" 
                      onClick={() => handleAnimalClick('Pamuk (Tavşan)')}
                    >
                      Pamuk (Tavşan)
                    </span>
                  </td>
                  <td>14.06.2023</td>
                  <td><span className="status-observation">Gözlem</span></td>
                </tr>
                <tr>
                  <td>
                    <span 
                      className="clickable-animal-name" 
                      onClick={() => handleAnimalClick('Minnoş (Kedi)')}
                    >
                      Minnoş (Kedi)
                    </span>
                  </td>
                  <td>10.06.2023</td>
                  <td><span className="status-recovering">Nekahet</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="widget recent-activity-widget">
          <div className="widget-header">
            <h2><span className="icon icon-paw"></span> Son Hasta Aktiviteleri</h2>
          </div>
          <div className="widget-content">
            <ul className="activity-list">
              <li>
                <div className="activity-info">
                  <span className="activity-time">11:32</span>
                  <span 
                    className="activity-name clickable-animal-name" 
                    onClick={() => handleAnimalClick('Luna (Kedi)')}
                  >
                    Luna (Kedi)
                  </span>
                </div>
                <div className="activity-status">Kan tahlili tamamlandı</div>
              </li>
              <li>
                <div className="activity-info">
                  <span className="activity-time">10:45</span>
                  <span 
                    className="activity-name clickable-animal-name" 
                    onClick={() => handleAnimalClick('Rocky (Köpek)')}
                  >
                    Rocky (Köpek)
                  </span>
                </div>
                <div className="activity-status">Röntgen çekildi</div>
              </li>
              <li>
                <div className="activity-info">
                  <span className="activity-time">09:15</span>
                  <span 
                    className="activity-name clickable-animal-name" 
                    onClick={() => handleAnimalClick('Minnoş (Kedi)')}
                  >
                    Minnoş (Kedi)
                  </span>
                </div>
                <div className="activity-status">Aşı yapıldı</div>
              </li>
              <li>
                <div className="activity-info">
                  <span className="activity-time">Dün</span>
                  <span 
                    className="activity-name clickable-animal-name" 
                    onClick={() => handleAnimalClick('Çomar (Köpek)')}
                  >
                    Çomar (Köpek)
                  </span>
                </div>
                <div className="activity-status">Ameliyat sonrası - stabil</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="widget calendar-wrapper">
          <CalendarWidget />
        </div>

        <div className="widget low-stock-widget">
          <div className="widget-header">
            <h2><span className="icon icon-warning"></span> Düşük Stok Uyarıları</h2>
          </div>
          <div className="widget-content">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Mevcut</th>
                  <th>Min.</th>
                </tr>
              </thead>
              <tbody>
                <tr className="critical">
                  <td>Amoksisilin 250mg</td>
                  <td>5</td>
                  <td>20</td>
                </tr>
                <tr className="warning">
                  <td>Kedi Aşıları</td>
                  <td>8</td>
                  <td>10</td>
                </tr>
                <tr className="critical">
                  <td>Cerrahi Eldiven (M)</td>
                  <td>12</td>
                  <td>50</td>
                </tr>
                <tr className="warning">
                  <td>Bandaj 2"</td>
                  <td>15</td>
                  <td>25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="widget lab-results-widget clickable-widget" onClick={() => navigate('/laboratory')}>
          <div className="widget-header">
            <h2><span className="icon icon-lab"></span> Bekleyen Laboratuvar Sonuçları</h2>
          </div>
          <div className="widget-content">
            <ul className="lab-list">
              <li>
                <div className="lab-info">
                  <span className="lab-patient">Bella (Köpek)</span>
                  <span className="lab-test">Tam Kan Sayımı</span>
                </div>
                <div className="lab-date">Bugün</div>
              </li>
              <li>
                <div className="lab-info">
                  <span className="lab-patient">Tekir (Kedi)</span>
                  <span className="lab-test">İdrar Tahlili</span>
                </div>
                <div className="lab-date">Yarın</div>
              </li>
              <li>
                <div className="lab-info">
                  <span className="lab-patient">Papatya (Tavşan)</span>
                  <span className="lab-test">Dışkı Analizi</span>
                </div>
                <div className="lab-date">15.06</div>
              </li>
            </ul>
            <div className="widget-action">
              <span className="action-text">Laboratuvar Paneline Git →</span>
            </div>
          </div>
        </div>

        <div className="widget notifications-widget">
          <div className="widget-header">
            <h2><span className="icon icon-bell"></span> Sistem Bildirimleri</h2>
          </div>
          <div className="widget-content">
            <ul className="notification-list">
              <li className="notification priority-high">
                <div className="notification-content">
                  <div className="notification-title">Aşı Hatırlatmaları</div>
                  <div className="notification-details">12 aşı hatırlatması</div>
                </div>
              </li>
              <li className="notification priority-medium">
                <div className="notification-content">
                  <div className="notification-title">Takip Aramaları</div>
                  <div className="notification-details">5 takip araması</div>
                </div>
              </li>
              <li className="notification priority-low">
                <div className="notification-content">
                  <div className="notification-title">Ekipman Bakımı</div>
                  <div className="notification-details">Röntgen bakımı</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 