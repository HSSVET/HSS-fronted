import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  usePendingTests,
  useLabTests,
  useUploadLabResult
} from '../hooks/useLaboratoryQueries';
import { useQueryClient } from '@tanstack/react-query';
import '../styles/Laboratory.css';
import type { LabTest } from '../types/laboratory';

const LabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const { data: pendingTestsResponse, isLoading: isLoadingPending } = usePendingTests();
  const { data: allTestsResponse, isLoading: isLoadingAll } = useLabTests(1, 20); // Get recent 20 tests

  // Mutations
  const uploadResultMutation = useUploadLabResult();

  // State
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'info' });
  const [showModal, setShowModal] = useState(false); // Keep for now, but quick add implementation pending

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const pendingTests = pendingTestsResponse?.data || [];
  const allTests = allTestsResponse?.data?.items || [];

  // Combine pending and recent completed for the queue view, or just use allTests if it includes pending
  // Let's use allTests for the main table to show everything sorted by date desc (default backend)
  const displayTests = allTests;

  const pendingCount = displayTests.filter(t => t.status === 'PENDING').length;
  const workingCount = displayTests.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = displayTests.filter(t => t.status === 'COMPLETED').length;

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
      case 'CANCELLED': return 'status-cancelled'; // Add css for this if needed
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

  const showSnackbarMessage = (message: string, type: string = 'info') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }));
    }, 5000);
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

        <div className="patient-search">
          <input
            type="text"
            placeholder="Test ara (ID, isim)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="top-controls">
          <button
            className="btn-secondary"
            onClick={() => navigate('/laboratory/test-types')}
          >
            Test Türleri
          </button>
          <button className="fab-button" onClick={() => setShowModal(true)}>
            <span>+</span> Yeni Test
          </button>
        </div>
      </header>

      <main className="lab-main-grid">
        {/* Quick Order Panel - Keeping static for now as mock was heavily hardcoded */}
        <aside className="quick-order-panel ui-card panel ui-card--hover">
          <h2>Hızlı İşlemler</h2>
          <div className="lab-stats">
            <h3>İstatistikler</h3>
            <div className="stat-grid">
              <div className="mini-stat">
                <span className="stat-label">Bugün</span>
                <span className="stat-value">{displayTests.length}</span>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Bekleyen</span>
                <span className="stat-value critical">{pendingCount}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Test Queue */}
        <section className="test-queue ui-card panel">
          <div className="queue-header">
            <h2>Test Listesi</h2>
            <div className="queue-stats">
              <span className="stat-item">Beklemede: <span>{pendingCount}</span></span>
              <span className="stat-item">Çalışılıyor: <span>{workingCount}</span></span>
              <span className="stat-item">Tamam: <span>{completedCount}</span></span>
            </div>
          </div>

          {isLoadingAll ? (
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
                            <a href={result.fileUrl} target="_blank" rel="noopener noreferrer" className="meta-value link">Dosyayı Görüntüle</a>
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

      {/* Search Modal Placeholder */}
      {showModal && (
        <div className="modal" onClick={(e) => {
          if (e.target === e.currentTarget) setShowModal(false);
        }}>
          <div className="modal-content">
            <h3>Yeni Test Ekle</h3>
            <p>Bu özellik henüz aktif değil.</p>
            <button onClick={() => setShowModal(false)}>Kapat</button>
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