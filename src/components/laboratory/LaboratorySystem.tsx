import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/LaboratorySystem.css';
import TestRequestDialog from './TestRequestDialog';
import TestResultsWidget from './TestResultsWidget';
import LabStatsWidget from './LabStatsWidget';
import RecentTestsWidget from './RecentTestsWidget';
import PendingTestsWidget from './PendingTestsWidget';
import LabEquipmentWidget from './LabEquipmentWidget';

const LaboratorySystem: React.FC = () => {
  const navigate = useNavigate();
  const [showTestRequestDialog, setShowTestRequestDialog] = useState(false);

  const handleNewTestRequest = () => {
    setShowTestRequestDialog(true);
  };

  const handleViewAllTests = () => {
    navigate('/laboratory/tests');
  };

  const handleViewResults = () => {
    navigate('/laboratory/results');
  };

  return (
    <div className="laboratory-system">
      <div className="laboratory-header">
        <h1>Laboratuvar Yönetimi</h1>
        <div className="quick-actions">
          <button className="action-button primary" onClick={handleNewTestRequest}>
            <span className="icon icon-plus"></span>
            Yeni Test Talebi
          </button>
          <button className="action-button" onClick={handleViewAllTests}>
            <span className="icon icon-list"></span>
            Tüm Testler
          </button>
          <button className="action-button" onClick={handleViewResults}>
            <span className="icon icon-chart"></span>
            Sonuçlar
          </button>
        </div>
      </div>

      <LabStatsWidget />

      <div className="widgets-container three-column">
        <PendingTestsWidget />
        <RecentTestsWidget />
        <TestResultsWidget />
        <LabEquipmentWidget />
      </div>

      {showTestRequestDialog && (
        <TestRequestDialog onClose={() => setShowTestRequestDialog(false)} />
      )}
    </div>
  );
};

export default LaboratorySystem; 