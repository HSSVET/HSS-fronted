import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/PendingTestsWidget.css';

const PendingTestsWidget: React.FC = () => {
  const navigate = useNavigate();

  const pendingTests = [
    {
      id: 'T001',
      animalName: 'Bella (Köpek)',
      testType: 'Tam Kan Sayımı',
      priority: 'high' as const,
      requestDate: '15.06.2023',
      estimatedTime: '2 saat'
    },
    {
      id: 'T002',
      animalName: 'Tekir (Kedi)',
      testType: 'İdrar Tahlili',
      priority: 'normal' as const,
      requestDate: '15.06.2023',
      estimatedTime: '4 saat'
    },
    {
      id: 'T003',
      animalName: 'Papatya (Tavşan)',
      testType: 'Dışkı Analizi',
      priority: 'urgent' as const,
      requestDate: '14.06.2023',
      estimatedTime: '1 saat'
    },
    {
      id: 'T004',
      animalName: 'Max (Köpek)',
      testType: 'Biyokimya Paneli',
      priority: 'normal' as const,
      requestDate: '14.06.2023',
      estimatedTime: '6 saat'
    }
  ];

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'normal': return 'priority-normal';
      default: return 'priority-low';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Acil';
      case 'high': return 'Yüksek';
      case 'normal': return 'Normal';
      default: return 'Düşük';
    }
  };

  const handleTestClick = (testId: string) => {
    navigate(`/laboratory/test/${testId}`);
  };

  return (
    <div className="widget pending-tests-widget">
      <div className="widget-header">
        <h2><span className="icon icon-clock"></span> Bekleyen Testler</h2>
        <button className="view-all-btn" onClick={() => navigate('/laboratory/pending')}>
          Tümünü Gör
        </button>
      </div>
      <div className="widget-content">
        <div className="pending-tests-list">
          {pendingTests.map((test) => (
            <div 
              key={test.id} 
              className="pending-test-item"
              onClick={() => handleTestClick(test.id)}
            >
              <div className="test-header">
                <span className="test-id">#{test.id}</span>
                <span className={`priority-badge ${getPriorityClass(test.priority)}`}>
                  {getPriorityText(test.priority)}
                </span>
              </div>
              <div className="test-patient">{test.animalName}</div>
              <div className="test-type">{test.testType}</div>
              <div className="test-footer">
                <span className="test-date">{test.requestDate}</span>
                <span className="estimated-time">{test.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingTestsWidget; 