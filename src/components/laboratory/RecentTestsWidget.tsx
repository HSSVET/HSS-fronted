import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/RecentTestsWidget.css';

const RecentTestsWidget: React.FC = () => {
  const navigate = useNavigate();

  const recentTests = [
    {
      id: 'T005',
      animalName: 'Luna (Kedi)',
      testType: 'Tam Kan Sayımı',
      status: 'completed' as const,
      completedDate: '15.06.2023',
      completedTime: '11:32',
      result: 'Normal'
    },
    {
      id: 'T006',
      animalName: 'Rocky (Köpek)',
      testType: 'Biyokimya Paneli',
      status: 'completed' as const,
      completedDate: '15.06.2023',
      completedTime: '10:45',
      result: 'Yüksek kreatinin'
    },
    {
      id: 'T007',
      animalName: 'Minnoş (Kedi)',
      testType: 'İdrar Tahlili',
      status: 'in-progress' as const,
      completedDate: '15.06.2023',
      completedTime: '09:15',
      result: 'İşlemde'
    },
    {
      id: 'T008',
      animalName: 'Çomar (Köpek)',
      testType: 'Dışkı Analizi',
      status: 'completed' as const,
      completedDate: '14.06.2023',
      completedTime: '16:20',
      result: 'Parazit (-)'
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return 'status-unknown';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in-progress': return 'İşlemde';
      case 'pending': return 'Bekliyor';
      default: return 'Bilinmiyor';
    }
  };

  const handleTestClick = (testId: string) => {
    navigate(`/laboratory/test/${testId}`);
  };

  return (
    <div className="widget recent-tests-widget">
      <div className="widget-header">
        <h2><span className="icon icon-lab"></span> Son Test Aktiviteleri</h2>
        <button className="view-all-btn" onClick={() => navigate('/laboratory/history')}>
          Geçmişi Gör
        </button>
      </div>
      <div className="widget-content">
        <div className="recent-tests-list">
          {recentTests.map((test) => (
            <div 
              key={test.id} 
              className="recent-test-item"
              onClick={() => handleTestClick(test.id)}
            >
              <div className="test-info">
                <div className="test-patient">{test.animalName}</div>
                <div className="test-type">{test.testType}</div>
              </div>
              <div className="test-details">
                <div className="test-time">
                  {test.completedTime} - {test.completedDate}
                </div>
                <div className={`test-status ${getStatusClass(test.status)}`}>
                  {getStatusText(test.status)}
                </div>
                <div className="test-result">{test.result}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTestsWidget; 