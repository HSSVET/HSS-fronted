import React, { useState } from 'react';
import '../../styles/components/TestRequestDialog.css';

interface TestRequestDialogProps {
  onClose: () => void;
}

interface TestRequest {
  animalId: string;
  animalName: string;
  testType: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes: string;
  requestedBy: string;
}

const TestRequestDialog: React.FC<TestRequestDialogProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<TestRequest>({
    animalId: '',
    animalName: '',
    testType: '',
    priority: 'normal',
    notes: '',
    requestedBy: 'Dr. Yılmaz'
  });

  const testTypes = [
    'Tam Kan Sayımı (CBC)',
    'Biyokimya Paneli',
    'İdrar Tahlili',
    'Dışkı Analizi',
    'Hormon Testi',
    'Alerji Testi',
    'Mikrobiyoloji Kültürü',
    'Sitoloji',
    'Histopatoloji',
    'PCR Testi',
    'Seroloji',
    'Toksikoloji'
  ];

  const mockAnimals = [
    { id: '1', name: 'Pamuk (Tavşan)' },
    { id: '2', name: 'Karabaş (Köpek)' },
    { id: '3', name: 'Minnoş (Kedi)' },
    { id: '4', name: 'Max (Köpek)' },
    { id: '5', name: 'Luna (Kedi)' },
    { id: '6', name: 'Rocky (Köpek)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Test talebini kaydet
    console.log('Test talebi:', formData);
    onClose();
  };

  const handleInputChange = (field: keyof TestRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'animalId') {
      const selectedAnimal = mockAnimals.find(animal => animal.id === value);
      if (selectedAnimal) {
        setFormData(prev => ({ ...prev, animalName: selectedAnimal.name }));
      }
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog test-request-dialog">
        <div className="dialog-header">
          <h2><span className="icon icon-lab"></span> Yeni Test Talebi</h2>
          <button className="close-button" onClick={onClose}>
            <span className="icon icon-x"></span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="test-request-form">
          <div className="form-group">
            <label>Hasta Seçimi</label>
            <select 
              value={formData.animalId}
              onChange={(e) => handleInputChange('animalId', e.target.value)}
              required
            >
              <option value="">Hasta seçiniz...</option>
              {mockAnimals.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Test Türü</label>
            <select 
              value={formData.testType}
              onChange={(e) => handleInputChange('testType', e.target.value)}
              required
            >
              <option value="">Test türü seçiniz...</option>
              {testTypes.map(test => (
                <option key={test} value={test}>
                  {test}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Öncelik</label>
            <select 
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value as any)}
            >
              <option value="low">Düşük</option>
              <option value="normal">Normal</option>
              <option value="high">Yüksek</option>
              <option value="urgent">Acil</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notlar</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Test ile ilgili özel notlar..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Talep Eden</label>
            <input 
              type="text"
              value={formData.requestedBy}
              onChange={(e) => handleInputChange('requestedBy', e.target.value)}
              required
            />
          </div>

          <div className="dialog-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="submit-button">
              Test Talebini Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestRequestDialog; 