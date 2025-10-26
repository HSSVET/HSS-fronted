import React, { useState, useRef, DragEvent } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  folder?: string;
  disabled?: boolean;
}

interface UploadFile {
  file: File;
  preview?: string;
  uploading?: boolean;
  progress?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadSuccess,
  onUploadError,
  maxSize = 10,
  acceptedTypes,
  folder = 'documents',
  disabled = false,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(`Dosya boyutu ${maxSize}MB'dan fazla olamaz`);
      return false;
    }

    // Check file type
    if (acceptedTypes && acceptedTypes.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(file.type) && !acceptedTypes.includes(fileExtension)) {
        onUploadError?.(`Bu dosya tipi desteklenmiyor`);
        return false;
      }
    }

    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles: UploadFile[] = [];

    fileList.forEach((file) => {
      if (validateFile(file)) {
        const uploadFile: UploadFile = {
          file,
          uploading: false,
          progress: 0,
        };

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            uploadFile.preview = reader.result as string;
            setFiles((prev) => prev.map((f) => (f.file === file ? { ...f, preview: uploadFile.preview } : f)));
          };
          reader.readAsDataURL(file);
        }

        validFiles.push(uploadFile);
      }
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      validFiles.forEach((file) => onFileSelect(file.file));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-drop-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          multiple
          accept={acceptedTypes?.join(',')}
        />
        <div className="drop-content">
          <div className="drop-icon">📁</div>
          <p>Dosyaları buraya sürükleyin veya tıklayın</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={disabled}
          >
            Dosya Seç
          </button>
          <p className="file-info">Maksimum dosya boyutu: {maxSize}MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((uploadFile, index) => (
            <div key={index} className="file-item">
              {uploadFile.preview && (
                <div className="file-preview">
                  <img src={uploadFile.preview} alt="Preview" />
                </div>
              )}
              <div className="file-info">
                <p className="file-name">{uploadFile.file.name}</p>
                <p className="file-size">{formatFileSize(uploadFile.file.size)}</p>
              </div>
              <button
                className="remove-file-btn"
                onClick={() => removeFile(index)}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

