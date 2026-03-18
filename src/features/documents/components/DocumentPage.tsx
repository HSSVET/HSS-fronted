import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { FilePreview } from './FilePreview';
import { documentService } from '../services/documentService';
import { Document, DocumentType } from '../types/document';
import './DocumentPage.css';

export const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | 'ALL'>('ALL');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const response = await documentService.getAllDocuments(0, 100);
      setDocuments(response.content || []);
    } catch (err: any) {
      setError(err.message || 'Belgeler yüklenirken bir hata oluştu');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      setNotice(null);
      const uploadResponse = await documentService.uploadFile(file);
      
      // Here you would typically create a document record
      // For now, we'll just show success
      setNotice('Dosya yüklendi. Belge listesi güncelleniyor…');
      setShowUploadDialog(false);
      loadDocuments();
    } catch (err: any) {
      setError(err.message || 'Dosya yüklenirken bir hata oluştu');
      console.error('Error uploading file:', err);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      if (!document.fileUrl) {
        setError('Dosya URL bulunamadı');
        return;
      }
      await documentService.downloadFile(document.fileUrl);
      setNotice('Dosya indiriliyor…');
    } catch (err: any) {
      setError(err.message || 'Dosya indirilirken bir hata oluştu');
      console.error('Error downloading file:', err);
    }
  };

  const handleDelete = async (document: Document) => {
    try {
      await documentService.deleteDocument(document.documentId);
      setNotice('Belge silindi. Liste güncelleniyor…');
      loadDocuments();
    } catch (err: any) {
      setError(err.message || 'Belge silinirken bir hata oluştu');
      console.error('Error deleting document:', err);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedDocumentType === 'ALL' || doc.documentType === selectedDocumentType;
    
    return matchesSearch && matchesType;
  });

  const documentTypeOptions = [
    { value: 'ALL', label: 'Tümü' },
    { value: 'GENERAL', label: 'Genel' },
    { value: 'CERTIFICATE', label: 'Sertifika' },
    { value: 'REPORT', label: 'Rapor' },
    { value: 'CONSENT', label: 'Onay' },
    { value: 'CONTRACT', label: 'Kontrat' },
    { value: 'OTHER', label: 'Diğer' },
  ];

  const totalCount = documents.length;
  const archivedCount = documents.filter((d) => d.isArchived).length;
  const contractCount = documents.filter((d) => d.documentType === DocumentType.CONTRACT).length;
  const totalSizeBytes = documents.reduce((sum, d) => sum + (d.fileSize ?? 0), 0);
  const formatBytes = (bytes: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    const value = bytes / Math.pow(k, i);
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  return (
    <div className="document-page">
      <div className="documents-hero">
        <div className="documents-hero__content">
          <div className="documents-hero__title-row">
            <div>
              <h1>Belge Yönetimi</h1>
              <p className="documents-hero__subtitle">
                Kontratlar, raporlar, onay formları ve klinik dokümanlarını tek yerde yönetin.
              </p>
            </div>
            <button className="btn-primary" onClick={() => setShowUploadDialog(true)}>
              + Yeni Belge
            </button>
          </div>

          <div className="documents-stats">
            <div className="stat-card">
              <div className="stat-card__label">Toplam Belge</div>
              <div className="stat-card__value">{totalCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Kontrat</div>
              <div className="stat-card__value">{contractCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Arşiv</div>
              <div className="stat-card__value">{archivedCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Toplam Boyut</div>
              <div className="stat-card__value">{formatBytes(totalSizeBytes)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Belgelerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={selectedDocumentType}
          onChange={(e) => setSelectedDocumentType(e.target.value as DocumentType | 'ALL')}
          className="type-filter"
        >
          {documentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setSearchQuery('');
            setSelectedDocumentType('ALL');
          }}
        >
          Filtreleri Temizle
        </button>
      </div>

      {notice && (
        <div className="notice-message" role="status" aria-live="polite">
          {notice}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : (
        <div className="documents-grid">
          {filteredDocuments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__card">
                <div className="empty-state__icon" aria-hidden="true">📄</div>
                <h2>Henüz belge bulunmuyor</h2>
                <p>
                  Kontrat, rapor veya onay formu yükleyerek arşivinizi oluşturun. Belgeler; hayvan, sahip ve tarihe göre listelenir.
                </p>
                <div className="empty-state__actions">
                  <button className="btn-primary" onClick={() => setShowUploadDialog(true)}>
                    + İlk Belgeni Yükle
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDocumentType('ALL');
                    }}
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
                <div className="empty-state__tips">
                  <div className="tip">
                    <div className="tip__title">Önerilen formatlar</div>
                    <div className="tip__text">PDF, PNG/JPG, DOC/DOCX</div>
                  </div>
                  <div className="tip">
                    <div className="tip__title">Kontratlar</div>
                    <div className="tip__text">“Kontrat” filtresi ile hızlı erişim</div>
                  </div>
                  <div className="tip">
                    <div className="tip__title">Arşiv</div>
                    <div className="tip__text">Eski belgeleri arşivleyip saklayın</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <FilePreview
                key={document.documentId}
                document={document}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      {showUploadDialog && (
        <div className="modal-overlay" onClick={() => setShowUploadDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dosya Yükle</h2>
              <button
                className="close-btn"
                onClick={() => setShowUploadDialog(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <FileUpload
                onFileSelect={handleFileSelect}
                onUploadError={(error) => setError(error)}
                maxSize={15}
                acceptedTypes={[
                  'application/pdf',
                  'image/png',
                  'image/jpeg',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

