import React from 'react';
import { Document } from '../types/document';
import { documentService } from '../services/documentService';
import './FilePreview.css';

interface FilePreviewProps {
  document: Document;
  onDownload?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  document: documentData,
  onDownload,
  onDelete,
}) => {
  const handleDownload = async () => {
    if (!documentData.fileUrl) return;

    try {
      if (onDownload) {
        onDownload(documentData);
      } else {
        const blob = await documentService.downloadFile(documentData.fileUrl);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = documentData.fileName || 'document';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Dosya indirilirken bir hata oluştu');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      if (onDelete) {
        onDelete(documentData);
      }
    }
  };

  const getFileIcon = () => {
    if (!documentData.mimeType) return '📄';

    if (documentData.mimeType.startsWith('image/')) return '🖼️';
    if (documentData.mimeType.startsWith('video/')) return '🎥';
    if (documentData.mimeType.startsWith('audio/')) return '🎵';
    if (documentData.mimeType.includes('pdf')) return '📄';
    if (documentData.mimeType.includes('word')) return '📝';
    if (documentData.mimeType.includes('excel') || documentData.mimeType.includes('spreadsheet')) return '📊';
    if (documentData.mimeType.includes('zip') || documentData.mimeType.includes('rar')) return '📦';

    return '📄';
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Bilinmiyor';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDocumentTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      GENERAL: 'Genel',
      CERTIFICATE: 'Sertifika',
      REPORT: 'Rapor',
      CONSENT: 'Onay',
      CONTRACT: 'Kontrat',
      OTHER: 'Diğer',
    };
    return labels[type] || type;
  };

  return (
    <div className="file-preview-card">
      <div className="file-preview-header">
        <div className="file-icon">{getFileIcon()}</div>
        <div className="file-title-section">
          <h3 className="file-title">{documentData.title}</h3>
          <p className="file-meta">
            <span className="document-type">{getDocumentTypeLabel(documentData.documentType)}</span>
            {documentData.isArchived && <span className="archived-badge">Arşivlendi</span>}
          </p>
        </div>
        <div className="file-actions">
          {documentData.fileUrl && (
            <button
              className="action-btn download-btn"
              onClick={handleDownload}
              title="İndir"
            >
              ⬇️
            </button>
          )}
          {onDelete && (
            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Sil"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="file-metadata">
        <div className="metadata-row">
          <span className="metadata-label">Dosya Adı:</span>
          <span className="metadata-value">{documentData.fileName || 'Belirtilmemiş'}</span>
        </div>
        <div className="metadata-row">
          <span className="metadata-label">Dosya Boyutu:</span>
          <span className="metadata-value">{formatFileSize(documentData.fileSize)}</span>
        </div>
        <div className="metadata-row">
          <span className="metadata-label">Dosya Tipi:</span>
          <span className="metadata-value">{documentData.mimeType || 'Bilinmiyor'}</span>
        </div>
        <div className="metadata-row">
          <span className="metadata-label">Tarih:</span>
          <span className="metadata-value">{formatDate(documentData.date)}</span>
        </div>
        <div className="metadata-row">
          <span className="metadata-label">Hayvan:</span>
          <span className="metadata-value">{documentData.animalName}</span>
        </div>
        <div className="metadata-row">
          <span className="metadata-label">Sahip:</span>
          <span className="metadata-value">{documentData.ownerName}</span>
        </div>
        {documentData.content && (
          <div className="metadata-row full-width">
            <span className="metadata-label">İçerik:</span>
            <span className="metadata-value">{documentData.content}</span>
          </div>
        )}
      </div>

      <div className="file-footer">
        <span className="created-date">
          Oluşturulma: {formatDate(documentData.createdAt)}
        </span>
      </div>
    </div>
  );
};

