import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/Laboratory.css';

interface TestType {
  id: string;
  name: string;
  category: string;
  icon: string;
  duration: number;
  price: number;
  description: string;
  sampleType: string;
  normalRange?: string;
  isActive: boolean;
}

const LabTestTypes: React.FC = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const testTypes: TestType[] = [
    {
      id: 'CBC',
      name: 'Tam Kan Sayımı (CBC)',
      category: 'Hematoloji',
      icon: '🩸',
      duration: 30,
      price: 150,
      description: 'Hemoglobin, hematokrit, eritrosit ve lökosit sayımı',
      sampleType: 'EDTA Kan',
      normalRange: 'RBC: 5.5-8.5 M/μL, WBC: 6.0-17.0 K/μL',
      isActive: true
    },
    {
      id: 'BIOCHEM',
      name: 'Biyokimya Panel',
      category: 'Biyokimya',
      icon: '🧪',
      duration: 45,
      price: 250,
      description: 'ALT, AST, ALP, Üre, Kreatinin, Glukoz analizi',
      sampleType: 'Serum',
      normalRange: 'ALT: 10-100 U/L, Glukoz: 70-143 mg/dL',
      isActive: true
    },
    {
      id: 'FIV_FELV',
      name: 'FIV/FeLV Test',
      category: 'Seroloji',
      icon: '🦠',
      duration: 15,
      price: 180,
      description: 'Feline Immunodeficiency Virus ve Feline Leukemia Virus testi',
      sampleType: 'Serum/Plazma',
      normalRange: 'Negatif',
      isActive: true
    },
    {
      id: 'PARASITE',
      name: 'Kan Parazit Taraması',
      category: 'Parazitoloji',
      icon: '🔬',
      duration: 20,
      price: 120,
      description: 'Babesia, Ehrlichia, Anaplasma araştırması',
      sampleType: 'EDTA Kan',
      normalRange: 'Negatif',
      isActive: true
    },
    {
      id: 'USG',
      name: 'Ultrasonografi',
      category: 'Görüntüleme',
      icon: '📡',
      duration: 60,
      price: 300,
      description: 'Batın ultrasonografi muayenesi',
      sampleType: 'İnvaziv Değil',
      normalRange: 'Normal anatomi',
      isActive: true
    },
    {
      id: 'XRAY',
      name: 'Röntgen',
      category: 'Görüntüleme',
      icon: '📷',
      duration: 30,
      price: 200,
      description: 'Dijital röntgen çekimi ve yorumlanması',
      sampleType: 'İnvaziv Değil',
      normalRange: 'Normal anatomi',
      isActive: true
    },
    {
      id: 'URINALYSIS',
      name: 'İdrar Analizi',
      category: 'Üroloji',
      icon: '🧫',
      duration: 25,
      price: 100,
      description: 'Fiziksel, kimyasal ve mikroskobik idrar analizi',
      sampleType: 'İdrar',
      normalRange: 'Protein: Negatif, Glukoz: Negatif',
      isActive: true
    },
    {
      id: 'THYROID',
      name: 'Tiroid Paneli',
      category: 'Endokrinoloji',
      icon: '⚡',
      duration: 60,
      price: 280,
      description: 'T4, TSH hormon seviyelerinin ölçümü',
      sampleType: 'Serum',
      normalRange: 'T4: 1.0-4.0 μg/dL',
      isActive: true
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', count: testTypes.length },
    { id: 'Hematoloji', name: 'Hematoloji', count: testTypes.filter(t => t.category === 'Hematoloji').length },
    { id: 'Biyokimya', name: 'Biyokimya', count: testTypes.filter(t => t.category === 'Biyokimya').length },
    { id: 'Seroloji', name: 'Seroloji', count: testTypes.filter(t => t.category === 'Seroloji').length },
    { id: 'Parazitoloji', name: 'Parazitoloji', count: testTypes.filter(t => t.category === 'Parazitoloji').length },
    { id: 'Görüntüleme', name: 'Görüntüleme', count: testTypes.filter(t => t.category === 'Görüntüleme').length },
    { id: 'Üroloji', name: 'Üroloji', count: testTypes.filter(t => t.category === 'Üroloji').length },
    { id: 'Endokrinoloji', name: 'Endokrinoloji', count: testTypes.filter(t => t.category === 'Endokrinoloji').length }
  ];

  const filteredTests = testTypes.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory && test.isActive;
  });

  const handleQuickOrder = (testId: string) => {
    navigate('/laboratory', { state: { quickOrderTest: testId } });
  };

  return (
    <div className="lab-test-types">
      <div className="lab-test-header">
        <div className="header-content">
          <h1>📋 Laboratuvar Test Türleri</h1>
          <p>Mevcut test türlerini görüntüleyin ve hızlı sipariş verin</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/laboratory')}
          >
            🔬 Test Paneline Dön
          </button>
        </div>
      </div>

      <div className="test-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Test ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="test-grid">
        {filteredTests.map(test => (
          <div key={test.id} className="test-card">
            <div className="test-icon">{test.icon}</div>
            <div className="test-content">
              <h3 className="test-name">{test.name}</h3>
              <span className="test-category">{test.category}</span>
              <p className="test-description">{test.description}</p>
              
              <div className="test-details">
                <div className="detail-row">
                  <span className="detail-label">Süre:</span>
                  <span className="detail-value">{test.duration} dakika</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fiyat:</span>
                  <span className="detail-value">{test.price} ₺</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Örnek:</span>
                  <span className="detail-value">{test.sampleType}</span>
                </div>
                {test.normalRange && (
                  <div className="detail-row">
                    <span className="detail-label">Normal Aralık:</span>
                    <span className="detail-value">{test.normalRange}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="test-actions">
              <button 
                className="btn-quick-order"
                onClick={() => handleQuickOrder(test.id)}
              >
                ⚡ Hızlı Sipariş
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Test Bulunamadı</h3>
          <p>Arama kriterlerinize uygun test türü bulunamadı.</p>
        </div>
      )}

      <div className="test-stats">
        <div className="stat-card">
          <h4>Toplam Test Türü</h4>
          <span className="stat-number">{testTypes.length}</span>
        </div>
        <div className="stat-card">
          <h4>Aktif Testler</h4>
          <span className="stat-number">{testTypes.filter(t => t.isActive).length}</span>
        </div>
        <div className="stat-card">
          <h4>Ortalama Süre</h4>
          <span className="stat-number">
            {Math.round(testTypes.reduce((acc, test) => acc + test.duration, 0) / testTypes.length)} dk
          </span>
        </div>
        <div className="stat-card">
          <h4>Kategoriler</h4>
          <span className="stat-number">{categories.length - 1}</span>
        </div>
      </div>
    </div>
  );
};

export default LabTestTypes; 