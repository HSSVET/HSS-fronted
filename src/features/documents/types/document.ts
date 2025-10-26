export interface Document {
  documentId: number;
  ownerId: number;
  ownerName: string;
  animalId: number;
  animalName: string;
  title: string;
  content?: string;
  documentType: DocumentType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  date: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum DocumentType {
  GENERAL = 'GENERAL',
  CERTIFICATE = 'CERTIFICATE',
  REPORT = 'REPORT',
  CONSENT = 'CONSENT',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER',
}

export interface DocumentCreateRequest {
  ownerId: number;
  animalId: number;
  title: string;
  content?: string;
  documentType?: DocumentType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  date: string;
  isArchived?: boolean;
}

export interface DocumentUpdateRequest {
  title?: string;
  content?: string;
  documentType?: DocumentType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  date?: string;
  isArchived?: boolean;
}

export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: string;
  contentType: string;
}

