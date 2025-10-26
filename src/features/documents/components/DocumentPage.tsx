import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { FilePreview } from './FilePreview';
import { documentService } from '../services/documentService';
import { Document, DocumentCreateRequest, DocumentType } from '../types/document';
import './DocumentPage.css';

export const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | 'ALL'>('ALL');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
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
      const uploadResponse = await documentService.uploadFile(file);
      
      // Here you would typically create a document record
      // For now, we'll just show success
      alert('Dosya başarıyla yüklendi!');
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
        alert('Dosya URL bulunamadı');
        return;
      }
      await documentService.downloadFile(document.fileUrl);
      alert('Dosya başarıyla indirildi');
    } catch (err: any) {
      setError(err.message || 'Dosya indirilirken bir hata oluştu');
      console.error('Error downloading file:', err);
      alert('Dosya indirilemedi');
    }
  };

  const handleDelete = async (document: Document) => {
    try {
      await documentService.deleteDocument(document.documentId);
      alert('Belge başarıyla silindi');
      loadDocuments();
    } catch (err: any) {
      setError(err.message || 'Belge silinirken bir hata oluştu');
      console.error('Error deleting document:', err);
      alert('Belge silinemedi');
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

  return (
    <div className="document-page">
      <div className="page-header">
        <h1>Belge Yönetimi</h1>
        <button
          className="btn-primary"
          onClick={() => setShowUploadDialog(true)}
        >
          + Yeni Belge
        </button>
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
      </div>

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
              <p>Henüz belge bulunmuyor</p>
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

