import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/Laboratory.css';

interface Patient {
  id: string;
  name: string;
  owner: string;
  species: string;
}

interface Test {
  id: number;
  patient: Patient;
  testType: string;
  vet: string;
  isSTAT: boolean;
  duration: number;
  status: 'pending' | 'working' | 'completed';
  createdAt: Date;
  result?: {
    file: File;
    url: string;
    uploadedAt: Date;
  };
  isCritical: boolean;
}

const LabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [currentTestId, setCurrentTestId] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSTAT, setIsSTAT] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'info' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const patients: Patient[] = [
    { id: 'P001', name: 'Pamuk', owner: 'Ayşe Kaya', species: 'Kedi' },
    { id: 'P002', name: 'Karamel', owner: 'Mehmet Öz', species: 'Köpek' },
    { id: 'P003', name: 'Boncuk', owner: 'Zeynep Ak', species: 'Kedi' },
    { id: 'P004', name: 'Simba', owner: 'Ali Yılmaz', species: 'Köpek' },
    { id: 'P005', name: 'Minnoş', owner: 'Fatma Demir', species: 'Kedi' }
  ];

  const testTypes = [
    { code: 'CBC', name: '🩸 CBC (Tam Kan)', duration: 30 },
    { code: 'BIOCHEM', name: '🧪 Biyokimya Panel', duration: 45 },
    { code: 'FIV_FELV', name: '🦠 FIV/FeLV Test', duration: 15 },
    { code: 'PARASITE', name: '🔬 Kan Parazit', duration: 20 },
    { code: 'USG', name: '📡 USG', duration: 60 }
  ];

  const vets = ['Dr. Ayşe Kaya', 'Dr. Mehmet Öz', 'Dr. Zeynep Ak'];

  useEffect(() => {
    setTimeout(() => {
      setShowSkeleton(false);
      addSampleData();
    }, 1000);
  }, []);

  const addSampleData = () => {
    const sampleTests: Omit<Test, 'id'>[] = [
      {
        patient: patients[0],
        testType: 'CBC',
        vet: 'Dr. Ayşe Kaya',
        isSTAT: true,
        duration: 30,
        status: 'working',
        createdAt: new Date(Date.now() - 30 * 60000),
        isCritical: false
      },
      {
        patient: patients[1],
        testType: 'BIOCHEM',
        vet: 'Dr. Mehmet Öz',
        isSTAT: false,
        duration: 45,
        status: 'pending',
        createdAt: new Date(Date.now() - 15 * 60000),
        isCritical: false
      },
      {
        patient: patients[2],
        testType: 'FIV_FELV',
        vet: 'Dr. Zeynep Ak',
        isSTAT: false,
        duration: 15,
        status: 'completed',
        createdAt: new Date(Date.now() - 60 * 60000),
        isCritical: true
      }
    ];

    sampleTests.forEach(testData => {
      addTest(testData);
    });
  };

  const addTest = (testData: Omit<Test, 'id'>) => {
    const test: Test = {
      id: currentTestId,
      ...testData
    };

    setTests(prev => {
      const newTests = test.isSTAT ? [test, ...prev] : [...prev, test];
      return newTests;
    });

    setCurrentTestId(prev => prev + 1);
    showSnackbarMessage(`${getTestDisplayName(testData.testType)} testi eklendi!`, 'success');
  };

  const searchPatients = (query: string) => {
    if (query.length < 2) {
      setShowSearchResults(false);
      return [];
    }

    return patients.filter(patient => 
      patient.id.toLowerCase().includes(query.toLowerCase()) ||
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.owner.toLowerCase().includes(query.toLowerCase())
    );
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchQuery(`${patient.name} (${patient.id})`);
    setShowSearchResults(false);
  };

  const quickAddTest = (testType: string, duration: number) => {
    if (!selectedPatient) {
      showSnackbarMessage('Lütfen önce bir hasta seçin!', 'warning');
      return;
    }

    const vet = vets[Math.floor(Math.random() * vets.length)];
    
    addTest({
      patient: selectedPatient,
      testType: testType,
      vet: vet,
      isSTAT: isSTAT,
      duration: duration,
      status: 'pending',
      createdAt: new Date(),
      isCritical: false
    });
  };

  const advanceTestStatus = (testId: number) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        switch (test.status) {
          case 'pending':
            return { ...test, status: 'working' as const };
          case 'working':
            const isCritical = Math.random() < 0.3;
            if (isCritical) {
              showSnackbarMessage(`⚠️ KRİTİK DEĞER: ${test.patient.name} - ${getTestDisplayName(test.testType)}`, 'critical');
            }
            return { ...test, status: 'completed' as const, isCritical };
          default:
            return test;
        }
      }
      return test;
    }));
  };

  const selectTest = (testId: number) => {
    setSelectedTestId(testId);
  };

  const handleFileUpload = (file: File) => {
    if (!selectedTestId) {
      showSnackbarMessage('Lütfen önce bir test seçin!', 'warning');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showSnackbarMessage('Dosya boyutu 15 MB\'dan büyük olamaz!', 'error');
      return;
    }

    simulateFileUpload(file);
  };

  const simulateFileUpload = (file: File) => {
    setShowUploadProgress(true);
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      progress = Math.min(progress, 100);
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          completeFileUpload(file);
          setShowUploadProgress(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 100);
  };

  const completeFileUpload = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    
    setTests(prev => prev.map(test => {
      if (test.id === selectedTestId) {
        const isCritical = Math.random() < 0.2;
        if (isCritical) {
          showSnackbarMessage('⚠️ KRİTİK DEĞER TESPİT EDİLDİ!', 'critical');
        }
        
        return {
          ...test,
          result: {
            file,
            url: fileURL,
            uploadedAt: new Date()
          },
          status: 'completed' as const,
          isCritical
        };
      }
      return test;
    }));

    showSnackbarMessage('Sonuç başarıyla yüklendi!', 'success');
  };

  const getTestDisplayName = (testType: string) => {
    const test = testTypes.find(t => t.code === testType);
    return test ? test.name : testType;
  };

  const getStatusClass = (status: string, isCritical: boolean) => {
    if (isCritical) return 'status-critical';
    
    switch (status) {
      case 'pending': return 'status-pending';
      case 'working': return 'status-working';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'working': return '🔬';
      case 'completed': return '✅';
      default: return '⏳';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'working': return 'Çalışılıyor';
      case 'completed': return 'Tamam';
      default: return 'Beklemede';
    }
  };

  const showSnackbarMessage = (message: string, type: string = 'info') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const searchResults = searchQuery.length >= 2 ? searchPatients(searchQuery) : [];
  const pendingCount = tests.filter(t => t.status === 'pending').length;
  const workingCount = tests.filter(t => t.status === 'working').length;
  const completedCount = tests.filter(t => t.status === 'completed').length;
  const selectedTest = selectedTestId ? tests.find(t => t.id === selectedTestId) : null;

  return (
    <div className="lab-dashboard">
      {/* Top Bar */}
      <header className="lab-top-bar">
        <div className="clinic-selector">
          <select>
            <option value="1">VetKlinik İstanbul</option>
            <option value="2">Paw Health Center</option>
            <option value="3">AnimalCare Plus</option>
          </select>
        </div>
        
        <div className="patient-search">
          <input 
            type="text" 
            placeholder="Hasta ara (ID, isim, sahip)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length >= 2);
            }}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(patient => (
                <div 
                  key={patient.id}
                  className="search-result-item"
                  onClick={() => selectPatient(patient)}
                >
                  <strong>{patient.name}</strong> ({patient.id})<br/>
                  <small>{patient.owner} - {patient.species}</small>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="top-controls">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/laboratory/test-types')}
          >
            📋 Test Türleri
          </button>
          <button className="fab-button" onClick={() => setShowModal(true)}>
            <span>+</span> Yeni Test
          </button>
        </div>
      </header>

      <main className="lab-main-grid">
        {/* Quick Order Panel */}
        <aside className="quick-order-panel">
          <h2>Hızlı Test Siparişi</h2>
          
          <div className="stat-toggle">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isSTAT}
                onChange={(e) => setIsSTAT(e.target.checked)}
              />
              <span className="slider"></span>
              <span className="label">STAT</span>
            </label>
          </div>

          <div className="quick-tests">
            <h3>⭐ Sık Kullanılan Testler</h3>
            {testTypes.map(test => (
              <button 
                key={test.code}
                className="test-button" 
                onClick={() => quickAddTest(test.code, test.duration)}
              >
                {test.name}
              </button>
            ))}
          </div>

          <div className="bulk-select">
            <details>
              <summary>Toplu Seç</summary>
              <div className="bulk-options">
                <label>
                  <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                      quickAddTest('CBC', 30);
                      quickAddTest('BIOCHEM', 45);
                      e.target.checked = false;
                    }
                  }} />
                  Temel Panel
                </label>
                <label>
                  <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                      quickAddTest('FIV_FELV', 15);
                      quickAddTest('PARASITE', 20);
                      e.target.checked = false;
                    }
                  }} />
                  Enfeksiyon Panel
                </label>
                <label>
                  <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                      quickAddTest('CBC', 30);
                      quickAddTest('BIOCHEM', 45);
                      quickAddTest('USG', 60);
                      e.target.checked = false;
                    }
                  }} />
                  Tam Check-up
                </label>
              </div>
            </details>
          </div>
        </aside>

        {/* Test Queue */}
        <section className="test-queue">
          <div className="queue-header">
            <h2>Test Kuyruğu</h2>
            <div className="queue-stats">
              <span className="stat-item">Beklemede: <span>{pendingCount}</span></span>
              <span className="stat-item">Çalışılıyor: <span>{workingCount}</span></span>
              <span className="stat-item">Tamam: <span>{completedCount}</span></span>
            </div>
          </div>

          {showSkeleton ? (
            <div className="skeleton-loader">
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          ) : (
            <div className="queue-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Hasta</th>
                    <th>Test</th>
                    <th>Durum</th>
                    <th>Veteriner</th>
                    <th>Saat</th>
                    <th>Aksiyon</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map(test => (
                    <tr 
                      key={test.id}
                      className={selectedTestId === test.id ? 'selected' : ''}
                      onClick={() => selectTest(test.id)}
                      onDoubleClick={() => advanceTestStatus(test.id)}
                    >
                      <td>{test.id}</td>
                      <td>
                        <strong>{test.patient.name}</strong><br/>
                        <small>{test.patient.owner}</small>
                      </td>
                      <td>
                        {getTestDisplayName(test.testType)}
                        {test.isSTAT && <span className="stat-badge">⚡ STAT</span>}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(test.status, test.isCritical)}`}>
                          {getStatusIcon(test.status)} {getStatusText(test.status)}
                        </span>
                      </td>
                      <td>{test.vet}</td>
                      <td>{test.createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        {test.status !== 'completed' && (
                          <button 
                            className="action-button btn-upload"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTestId(test.id);
                              fileInputRef.current?.click();
                            }}
                          >
                            📁 Sonuç
                          </button>
                        )}
                        {test.status === 'completed' && (
                          <button 
                            className="action-button btn-view"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectTest(test.id);
                            }}
                          >
                            👁️ Görüntüle
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Result Viewer */}
        <aside className="result-viewer">
          <h2>Sonuç Görünümü</h2>
          
          {!selectedTest ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>Sonuç görüntülemek için bir test seçin</p>
            </div>
          ) : (
            <div className="result-content">
              <div className="result-header">
                <h3>{selectedTest.patient.name} - {getTestDisplayName(selectedTest.testType)}</h3>
                <div className="result-actions">
                  <button className="btn-secondary">Önceki Sonuçlar</button>
                  <button 
                    className="btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Sonuç Yükle
                  </button>
                </div>
              </div>

              <div className="file-drop-zone">
                <div className="drop-content">
                  <div className="drop-icon">📁</div>
                  <p>PDF/PNG dosyasını sürükleyin (max 15 MB)</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Dosya Seç
                  </button>
                </div>
                {showUploadProgress && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                )}
              </div>

              {selectedTest.result && (
                <div className="result-display">
                  {selectedTest.result.file.type === 'application/pdf' ? (
                    <embed 
                      src={selectedTest.result.url} 
                      type="application/pdf" 
                      width="100%" 
                      height="400px"
                    />
                  ) : (
                    <img 
                      src={selectedTest.result.url} 
                      alt="Test Sonucu" 
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                </div>
              )}

              <div className="trend-chart">
                <h4>Trend Analizi</h4>
                <canvas 
                  ref={canvasRef}
                  width="300" 
                  height="200"
                  style={{ border: '1px solid #ddd', borderRadius: '8px' }}
                ></canvas>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".pdf,.png,.jpg,.jpeg"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Modal: New Test */}
      {showModal && (
        <div className="modal" onClick={(e) => {
          if (e.target === e.currentTarget) setShowModal(false);
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Yeni Test Siparişi</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              setShowModal(false);
            }}>
              <div className="form-group">
                <label>Hasta:</label>
                <input 
                  type="text" 
                  value={selectedPatient ? `${selectedPatient.name} (${selectedPatient.id})` : ''}
                  placeholder="Hasta seçin..."
                  required 
                />
              </div>
              <div className="form-group">
                <label>Test Tipi:</label>
                <select required>
                  <option value="">Seçin...</option>
                  {testTypes.map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Veteriner:</label>
                <select required>
                  <option value="">Seçin...</option>
                  {vets.map(vet => (
                    <option key={vet} value={vet}>{vet}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  STAT (Acil)
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.show && (
        <div className={`snackbar ${snackbar.type === 'critical' ? 'critical' : ''}`}>
          <span>{snackbar.message}</span>
          <button onClick={() => setSnackbar(prev => ({ ...prev, show: false }))}>×</button>
        </div>
      )}
    </div>
  );
};

export default LabDashboard; 