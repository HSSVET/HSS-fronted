import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LaboratoryService } from '../services/laboratoryService';
import {
  usePendingTests,
  useLabTests,
  useUploadLabResult,
  useLabStats,
  useCreateLabTest
} from '../hooks/useLaboratoryQueries';
import { useQueryClient } from '@tanstack/react-query';
import '../styles/Laboratory.css';
import type { LabTest } from '../types/laboratory';
import { Autocomplete, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useAnimals } from '../../animals/hooks/useAnimals';
import { useLabTestsByAnimal } from '../hooks/useLaboratoryQueries';
import type { AnimalRecord } from '../../animals/services/animalService';

const LabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<AnimalRecord | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'info' });
  const [showModal, setShowModal] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ url: string; type: 'pdf' | 'image' } | null>(null);

  // New Test Form State
  const [newTestName, setNewTestName] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: statsResponse } = useLabStats();

  // Patient Search Query
  const { animals: patientOptions, loading: loadingPatients, fetchAnimals } = useAnimals({
    search: patientSearch,
    limit: 20,
    autoFetch: false
  });

  // Debounced patient search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnimals({ search: patientSearch });
    }, 500);
    return () => clearTimeout(timer);
  }, [patientSearch, fetchAnimals]);

  // Main Lists
  const { data: allTestsResponse, isLoading: isLoadingAll } = useLabTests(
    1,
    20,
    activeTab !== 'ALL' ? activeTab : undefined,
    undefined,
    { enabled: !selectedPatient }
  );

  const { data: animalTestsResponse, isLoading: isLoadingAnimal } = useLabTestsByAnimal(
    selectedPatient?.id?.toString(),
    { enabled: !!selectedPatient }
  );

  // Mutations
  const uploadResultMutation = useUploadLabResult();
  const createTestMutation = useCreateLabTest();

  // Derived state
  const stats = statsResponse?.data || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    today: 0
  };

  const getDisplayTests = () => {
    if (selectedPatient) {
      let tests = animalTestsResponse?.data || [];
      if (activeTab !== 'ALL') {
        tests = tests.filter(t => t.status === activeTab);
      }
      return tests;
    }
    return allTestsResponse?.data?.content || [];
  };

  const displayTests = getDisplayTests();
  const isLoading = selectedPatient ? isLoadingAnimal : isLoadingAll;
  const selectedTest = selectedTestId ? displayTests.find(t => t.testId === selectedTestId) : null;

  const handleFileUpload = async (file: File) => {
    if (!selectedTestId) {
      showSnackbarMessage('Lütfen önce bir test seçin!', 'warning');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showSnackbarMessage('Dosya boyutu 15 MB\'dan büyük olamaz!', 'error');
      return;
    }

    setShowUploadProgress(true);
    setUploadProgress(10); // Fake progress start

    const formData = new FormData();
    formData.append('file', file);
    formData.append('result', 'Dosya yüklendi: ' + file.name);

    try {
      await uploadResultMutation.mutateAsync({
        id: selectedTestId.toString(),
        formData
      });
      setUploadProgress(100);
      showSnackbarMessage('Sonuç başarıyla yüklendi!', 'success');
      setTimeout(() => setShowUploadProgress(false), 500);
    } catch (error) {
      console.error('Upload failed', error);
      showSnackbarMessage('Yükleme başarısız oldu.', 'error');
      setShowUploadProgress(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'IN_PROGRESS': return 'status-working';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '•';
      case 'IN_PROGRESS': return '◐';
      case 'COMPLETED': return '✓';
      default: return '•';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Beklemede';
      case 'IN_PROGRESS': return 'Çalışılıyor';
      case 'COMPLETED': return 'Tamam';
      default: return status;
    }
  };


  const handleCreateTest = async () => {
    if (!selectedPatient) {
      showSnackbarMessage('Lütfen bir hasta seçin.', 'warning');
      return;
    }
    if (!newTestName) {
      showSnackbarMessage('Lütfen test adını girin.', 'warning');
      return;
    }

    try {
      await createTestMutation.mutateAsync({
        animalId: selectedPatient.id,
        testName: newTestName,
        urgent: isUrgent,
        notes: ''
      });
      showSnackbarMessage('Test başarıyla oluşturuldu.', 'success');
      setShowModal(false);
      setNewTestName('');
      setIsUrgent(false);
    } catch (error) {
      console.error(error);
      showSnackbarMessage('Test oluşturulurken hata oluştu.', 'error');
    }
  };

  const showSnackbarMessage = (message: string, type: string = 'info') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const openFileView = async (fileUrl: string) => {
    const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

    // If it's already a Full HTTP URL, use it directly (if trusted)
    // But mostly we deal with gs:// or relative paths that need signing
    if (fileUrl.startsWith('http') && !fileUrl.includes('storage.googleapis.com')) {
      // If it is http but NOT already a signed GCS url (rough check), maybe use it directly?
      // For now, let's assume everything needs signing unless we decide otherwise.
      // Actually, safely assume we try to sign everything that isn't already signed.
    }

    try {
      const response = await LaboratoryService.getSignedUrl(fileUrl);
      if (response.success && response.data.signedUrl) {
        setViewingFile({
          url: response.data.signedUrl,
          type: isPdf ? 'pdf' : 'image'
        });
      } else {
        showSnackbarMessage('Dosya yüklenemedi: ' + (response.error || 'Bilinmeyen hata'), 'error');
      }
    } catch (error) {
      console.error("Failed to get signed URL:", error);
      showSnackbarMessage('Dosya açılırken hata oluştu.', 'error');
    }
  };

  const selectTest = (testId: number) => {
    setSelectedTestId(testId);
  };

  return (
    <div className="lab-dashboard">
      {/* Top Bar */}
      <header className="lab-top-bar ui-card panel ui-card--hover">
        <div className="clinic-selector">
          <select>
            <option value="1">VetKlinik İstanbul</option>
          </select>
        </div>

        <div className="patient-search" style={{ width: '300px' }}>
          <Autocomplete
            options={patientOptions}
            loading={loadingPatients}
            getOptionLabel={(option) => `${option.name} (${option.species?.name || ''}) - ${option.owner?.name || ''}`}
            value={selectedPatient}
            onChange={(_, newValue) => setSelectedPatient(newValue)}
            onInputChange={(_, newInputValue) => setPatientSearch(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Hasta Seç..."
                size="small"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>

        <div className="top-controls">
          <button
            className="btn-secondary"
            onClick={() => navigate('test-types')}
          >
            Test Türleri
          </button>
          <button className="fab-button" onClick={() => setShowModal(true)}>
            <span>+</span> Yeni Test
          </button>
        </div>
      </header>

      <main className="lab-main-grid">
        {/* Quick Order Panel */}
        <aside className="quick-order-panel ui-card panel ui-card--hover">
          <h2>Hızlı İşlemler</h2>
          <div className="lab-stats">
            <h3>İstatistikler</h3>
            <div className="stat-grid">
              <div className="mini-stat">
                <span className="stat-label">Bugün</span>
                <span className="stat-value">{stats.today}</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Bekleyen</span>
                <span className="stat-value critical">{stats.pending}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Test Queue */}
        <section className="test-queue ui-card panel">
          <div className="queue-header">
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveTab('ALL')}
              >
                Tümü ({stats.total})
              </button>
              <button
                className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
                onClick={() => setActiveTab('PENDING')}
              >
                Bekleyen ({stats.pending})
              </button>
              <button
                className={`tab-btn ${activeTab === 'IN_PROGRESS' ? 'active' : ''}`}
                onClick={() => setActiveTab('IN_PROGRESS')}
              >
                Çalışılıyor ({stats.inProgress})
              </button>
              <button
                className={`tab-btn ${activeTab === 'COMPLETED' ? 'active' : ''}`}
                onClick={() => setActiveTab('COMPLETED')}
              >
                Tamamlanan ({stats.completed})
              </button>
            </div>
          </div>

          {isLoading ? (
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
                    <th>ID</th>
                    <th>Hasta</th>
                    <th>Test</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                    <th>Aksiyon</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTests.map(test => (
                    <tr
                      key={test.testId}
                      className={selectedTestId === test.testId ? 'selected' : ''}
                      onClick={() => selectTest(test.testId)}
                    >
                      <td>{test.testId}</td>
                      <td>
                        <strong>{test.animalName}</strong>
                      </td>
                      <td>
                        {test.testName}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(test.status)}`}>
                          {getStatusIcon(test.status)} {getStatusText(test.status)}
                        </span>
                      </td>
                      <td>{test.date}</td>
                      <td>
                        {test.status !== 'COMPLETED' && (
                          <button
                            className="action-button btn-upload"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTestId(test.testId);
                              fileInputRef.current?.click();
                            }}
                          >
                            Sonuç Yükle
                          </button>
                        )}
                        {test.status === 'COMPLETED' && (
                          <button
                            className="action-button btn-view"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectTest(test.testId);
                              // We need to find the result file URL. Assuming the first result for now as per previous logic it wasn't explicit.
                              // Actually, the previous 'Görüntüle' was just selecting the test. 
                              // If there are results, we should try to open the latest one OR just select the test.
                              // The user request says "click button 'gorüntüle'". 
                              // Let's check if there are results, if so, open the first one's file if available.
                              if (test.results && test.results.length > 0 && test.results[0].fileUrl) {
                                openFileView(test.results[0].fileUrl);
                              } else {
                                // Fallback to just selecting it if no file
                                selectTest(test.testId);
                              }
                            }}
                          >
                            Görüntüle
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
        <aside className="result-viewer ui-card panel">
          <h2>Sonuç Görünümü</h2>

          {!selectedTest ? (
            <div className="empty-state">
              <div className="empty-icon">-</div>
              <p>Sonuç görüntülemek için bir test seçin</p>
            </div>
          ) : (
            <div className="result-content">
              <div className="result-header">
                <h3>{selectedTest.animalName} - {selectedTest.testName}</h3>
                <div className="result-actions">
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
                  <div className="drop-icon">+</div>
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

              {selectedTest.results && selectedTest.results.length > 0 ? (
                <div className="result-display">
                  {selectedTest.results.map(result => (
                    <div key={result.resultId} className="mock-result-data" style={{ marginBottom: '1rem' }}>
                      <h4>Sonuç #{result.resultId}</h4>
                      <div className="result-metadata">
                        <div className="meta-item">
                          <span className="meta-label">Sonuç:</span>
                          <span className="meta-value">{result.result}</span>
                        </div>
                        {result.value && (
                          <div className="meta-item">
                            <span className="meta-label">Değer:</span>
                            <span className="meta-value">{result.value} {result.unit}</span>
                          </div>
                        )}
                        {result.fileUrl && (
                          <div className="meta-item">
                            <span className="meta-label">Dosya:</span>
                            <button
                              className="meta-value link"
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', color: 'var(--primary-color)' }}
                              onClick={() => openFileView(result.fileUrl!)}
                            >
                              Dosyayı Görüntüle
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-result">
                  <p>Bu test için henüz sonuç yüklenmemiş.</p>
                </div>
              )}
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

      {/* Create Test Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Test Ekle</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <Autocomplete
              options={patientOptions}
              loading={loadingPatients}
              getOptionLabel={(option) => `${option.name} (${option.species?.name || ''}) - ${option.owner?.name || ''}`}
              value={selectedPatient}
              onChange={(_, newValue) => setSelectedPatient(newValue)}
              onInputChange={(_, newInputValue) => setPatientSearch(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Hasta Seç"
                  placeholder="İsim ile ara..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

            <TextField
              label="Test Adı"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              placeholder="Örn: Tam Kan Sayımı"
              fullWidth
            />

            <FormControlLabel
              control={<Checkbox checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />}
              label="Acil"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>İptal</Button>
          <Button onClick={handleCreateTest} variant="contained" color="primary" disabled={createTestMutation.isPending}>
            {createTestMutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File View Modal */}
      {viewingFile && (
        <div className="modal" onClick={(e) => {
          if (e.target === e.currentTarget) setViewingFile(null);
        }}>
          <div className="modal-content" style={{ width: '90%', height: '90%', maxWidth: '1000px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Dosya Önizleme</h3>
              <button onClick={() => setViewingFile(null)} className="btn-secondary">Kapat</button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {viewingFile.type === 'pdf' ? (
                <iframe
                  src={viewingFile.url}
                  title="PDF Viewer"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              ) : (
                <img
                  src={viewingFile.url}
                  alt="Result"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.show && (
        <div className={`snackbar ${snackbar.type === 'error' ? 'critical' : ''}`}>
          <span>{snackbar.message}</span>
          <button onClick={() => setSnackbar(prev => ({ ...prev, show: false }))}>×</button>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;