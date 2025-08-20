import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LabTestTypes.css';

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
      icon: 'CBC',
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
      icon: 'BIO',
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
      icon: 'VIR',
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
      icon: 'PAR',
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
      icon: 'USG',
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
      icon: 'XRY',
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
      icon: 'URI',
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
      icon: 'THY',
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

  const [sortBy, setSortBy] = React.useState<string>('name');
  const [quickFilters, setQuickFilters] = React.useState<string[]>([]);

  const filteredTests = testTypes.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesQuickFilters = quickFilters.length === 0 || quickFilters.some(filter => {
      switch(filter) {
        case 'quick': return test.duration <= 20;
        case 'expensive': return test.price >= 200;
        case 'blood': return test.sampleType.toLowerCase().includes('kan');
        default: return true;
      }
    });
    return matchesSearch && matchesCategory && matchesQuickFilters && test.isActive;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'price': return a.price - b.price;
      case 'duration': return a.duration - b.duration;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const handleQuickOrder = (testId: string) => {
    navigate('/laboratory', { state: { quickOrderTest: testId } });
  };

  return (
    <div className="lab-test-types">
      <div className="lab-test-header">
        <div className="header-content">
          <h1>Laboratuvar Test Türleri</h1>
          <p>Mevcut test türlerini görüntüleyin ve hızlı sipariş verin</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/laboratory')}
          >
            Test Paneline Dön
          </button>
        </div>
      </div>

      <div className="test-filters-modern">
        <div className="filter-row">
          <div className="search-container">
            <input
              type="text"
              placeholder="Test, kategori veya örnek türü ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modern-search"
            />
          </div>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="modern-select"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.slice(1).map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="modern-select"
          >
            <option value="name">İsme Göre</option>
            <option value="price">Fiyata Göre</option>
            <option value="duration">Süreye Göre</option>
          </select>
        </div>
        
        <div className="quick-filters">
          <span className="filter-label">Hızlı Filtreler:</span>
          {[
            { id: 'quick', label: 'Hızlı Testler (≤20dk)', color: 'green' },
            { id: 'expensive', label: 'Pahalı Testler (≥200₺)', color: 'orange' },
            { id: 'blood', label: 'Kan Testleri', color: 'red' }
          ].map(filter => (
            <button
              key={filter.id}
              className={`quick-filter-btn ${quickFilters.includes(filter.id) ? 'active' : ''} ${filter.color}`}
              onClick={() => {
                if (quickFilters.includes(filter.id)) {
                  setQuickFilters(prev => prev.filter(f => f !== filter.id));
                } else {
                  setQuickFilters(prev => [...prev, filter.id]);
                }
              }}
            >
              {filter.label}
            </button>
          ))}
          {quickFilters.length > 0 && (
            <button 
              className="clear-filters-btn"
              onClick={() => setQuickFilters([])}
            >
              Temizle
            </button>
          )}
        </div>
        
        <div className="results-info">
          <span>{filteredTests.length} test bulundu</span>
        </div>
      </div>

      <div className="test-list-modern">
        {filteredTests.map(test => (
          <div key={test.id} className="test-item-modern">
            <div className="test-header-modern">
              <div className="test-title-group">
                <div className="test-badge">{test.icon}</div>
                <div className="test-info">
                  <h3 className="test-title">{test.name}</h3>
                  <span className="test-cat">{test.category}</span>
                </div>
              </div>
              <div className="test-price">{test.price} ₺</div>
            </div>
            
            <div className="test-body-modern">
              <p className="test-desc">{test.description}</p>
              <div className="test-meta-grid">
                <div className="meta-group">
                  <span className="meta-label">Süre</span>
                  <span className={`meta-value ${test.duration <= 20 ? 'quick' : test.duration >= 60 ? 'slow' : ''}`}>
                    {test.duration} dk
                  </span>
                </div>
                <div className="meta-group">
                  <span className="meta-label">Örnek</span>
                  <span className="meta-value">{test.sampleType}</span>
                </div>
                <div className="meta-group">
                  <span className="meta-label">Durum</span>
                  <span className="meta-value active">Aktif</span>
                </div>
                {test.normalRange && (
                  <div className="meta-group full-width">
                    <span className="meta-label">Normal Aralık</span>
                    <span className="meta-value small">{test.normalRange}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="test-footer-modern">
              <button 
                className="btn-order-modern"
                onClick={() => handleQuickOrder(test.id)}
              >
                Sipariş Ver
              </button>
            </div>
          </div>
        ))}
      </div>

             {filteredTests.length === 0 && (
         <div className="empty-state">
           <div className="empty-icon">-</div>
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