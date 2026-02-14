import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimalService } from '../../animals/services/animalService';
import '../styles/ProfileWidgets.css';

interface MyPatientsWidgetProps {
  staffId?: string;
}

const MyPatientsWidget: React.FC<MyPatientsWidgetProps> = ({ staffId }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, [staffId]);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const animalService = new AnimalService();
      
      // Tüm hayvanları al (backend'de veteriner filtresi yoksa)
      const response = await animalService.getAnimals(0, 5);
      
      if (response.success && response.data) {
        setPatients(response.data.items.slice(0, 5));
      }
    } catch (error) {
      console.error('Hasta listesi yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAll = () => {
    if (slug) {
      navigate(`/clinic/${slug}/animals`);
    }
  };

  const handlePatientClick = (patientId: number) => {
    if (slug) {
      navigate(`/clinic/${slug}/animals/${patientId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-widget ui-card panel">
        <div className="widget-header">
          <h3>
            <span className="widget-icon">🐾</span>
            Son Bakılan Hastalar
          </h3>
        </div>
        <div className="widget-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-widget ui-card panel">
      <div className="widget-header">
        <h3>
          <span className="widget-icon">🐾</span>
          Son Bakılan Hastalar
        </h3>
        {patients.length > 0 && (
          <button onClick={handleViewAll} className="view-all-button">
            Tümünü Gör
          </button>
        )}
      </div>

      <div className="widget-content">
        {patients.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🐕</span>
            <p>Hasta kaydı bulunmuyor</p>
          </div>
        ) : (
          <div className="patients-list">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="patient-item"
                onClick={() => handlePatientClick(patient.id)}
              >
                <div className="patient-avatar">
                  {patient.species?.name === 'Köpek' ? '🐕' : patient.species?.name === 'Kedi' ? '🐈' : '🐾'}
                </div>
                <div className="patient-info">
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-details">
                    {patient.species?.name && <span className="patient-species">{patient.species.name}</span>}
                    {patient.breed?.name && <span className="patient-breed">{patient.breed.name}</span>}
                  </div>
                  {patient.owner?.name && (
                    <div className="patient-owner">
                      <span className="owner-icon">👤</span>
                      {patient.owner.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPatientsWidget;
