import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/TestResultsWidget.css';

const TestResultsWidget: React.FC = () => {
  const navigate = useNavigate();

  const criticalResults = [
    {
      id: 'R001',
      animalName: 'Karabaş (Köpek)',
      testType: 'Biyokimya Paneli',
      parameter: 'Kreatinin',
      value: '8.5 mg/dL',
      normalRange: '0.5-1.5 mg/dL',
      status: 'critical' as const,
      date: '15.06.2023'
    },
    {
      id: 'R002',
      animalName: 'Luna (Kedi)',
      testType: 'Tam Kan Sayımı',
      parameter: 'Lökosit',
      value: '25,000/µL',
      normalRange: '5,500-19,500/µL',
      status: 'high' as const,
      date: '15.06.2023'
    },
    {
      id: 'R003',
      animalName: 'Minnoş (Kedi)',
      testType: 'İdrar Tahlili',
      parameter: 'Protein',
      value: '300 mg/dL',
      normalRange: '0-30 mg/dL',
      status: 'high' as const,
      date: '14.06.2023'
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'critical': return 'result-critical';
      case 'high': return 'result-high';
      case 'low': return 'result-low';
      default: return 'result-normal';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return 'Kritik';
      case 'high': return 'Yüksek';
      case 'low': return 'Düşük';
      default: return 'Normal';
    }
  };

  const handleResultClick = (resultId: string) => {
    navigate(`/laboratory/result/${resultId}`);
  };

  return (
    <div className="widget test-results-widget">
      <div className="widget-header">
        <h2><span className="icon icon-warning"></span> Kritik Test Sonuçları</h2>
        <button className="view-all-btn" onClick={() => navigate('/laboratory/critical')}>
          Tümünü Gör
        </button>
      </div>
      <div className="widget-content">
        <div className="critical-results-list">
          {criticalResults.map((result) => (
            <div 
              key={result.id} 
              className="critical-result-item"
              onClick={() => handleResultClick(result.id)}
            >
              <div className="result-header">
                <span className="result-patient">{result.animalName}</span>
                <span className={`result-status ${getStatusClass(result.status)}`}>
                  {getStatusText(result.status)}
                </span>
              </div>
              <div className="result-test">{result.testType}</div>
              <div className="result-parameter">
                <span className="parameter-name">{result.parameter}:</span>
                <span className="parameter-value">{result.value}</span>
              </div>
              <div className="result-range">Normal: {result.normalRange}</div>
              <div className="result-date">{result.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestResultsWidget; 