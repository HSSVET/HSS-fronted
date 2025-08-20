# Medical Document File Upload Service API Documentation

## Overview

The Medical Document File Upload Service provides comprehensive functionality for managing medical documents in a veterinary clinic system. It supports advanced features like document versioning, security scanning, OCR processing, and metadata management.

## Base URL
```
http://localhost:8090/api/files
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Basic File Upload

#### Upload General File
```http
POST /api/files/upload
```

**Parameters:**
- `file` (multipart/form-data, required): The file to upload
- `fileType` (string, required): File type enum value
- `description` (string, optional): File description

**File Types:**
- `DOCUMENT` - General documents
- `IMAGE` - Images
- `MEDICAL_RECORD` - Medical records
- `REPORT` - Reports
- `X_RAY` - X-ray images
- `BLOOD_TEST` - Blood test results
- `VACCINATION_RECORD` - Vaccination records
- `OTHER` - Other file types

**Response:**
```json
{
  "success": true,
  "message": "Dosya başarıyla yüklendi",
  "data": {
    "id": 1,
    "fileName": "document_abc123_1735123456789.pdf",
    "originalName": "medical_report.pdf",
    "fileSize": 1024000,
    "contentType": "application/pdf",
    "bucketName": "hss-medical-records",
    "fileType": "MEDICAL_RECORD",
    "description": "Patient medical report",
    "uploadedBy": "dr.smith",
    "uploadDate": "2024-01-15T10:30:00",
    "isActive": true
  }
}
```

### 2. Medical Document Upload (Enhanced)

#### Upload Medical Document with Advanced Features
```http
POST /api/files/upload/medical-document
```

**Parameters:**
- `file` (multipart/form-data, required): The medical document file
- `fileType` (string, required): Medical file type
- `animalId` (number, optional): Associated animal ID
- `appointmentId` (number, optional): Associated appointment ID
- `description` (string, optional): Document description
- `tags` (string[], optional): Document tags for categorization
- `isConfidential` (boolean, optional, default: false): Mark as confidential
- `expiryDate` (string, optional): Document expiry date (ISO format)

**Response:**
```json
{
  "success": true,
  "message": "Medikal döküman başarıyla yüklendi",
  "data": {
    "id": 2,
    "fileName": "xray_def456_1735123456790.jpg",
    "originalName": "patient_xray_chest.jpg",
    "fileSize": 2048576,
    "contentType": "image/jpeg",
    "bucketName": "hss-images",
    "fileType": "X_RAY",
    "description": "Chest X-ray examination",
    "uploadedBy": "dr.johnson",
    "uploadDate": "2024-01-15T11:15:00",
    "animalId": 123,
    "isConfidential": false,
    "tags": ["chest", "xray", "examination"],
    "securityScanStatus": "PENDING",
    "accessLevel": "NORMAL",
    "versionNumber": 1,
    "isActive": true
  },
  "documentAnalysis": {
    "fileId": 2,
    "analysisType": "Radyoloji görüntü analizi",
    "securityStatus": "Tarama bekleniyor",
    "suggestedTags": ["röntgen", "kemik", "organ", "tanı"],
    "metadataQuality": "Yüksek"
  }
}
```

### 3. Batch Upload

#### Upload Multiple Medical Documents
```http
POST /api/files/upload/medical-documents/batch
```

**Parameters:**
- `files` (multipart/form-data[], required): Array of files to upload
- `fileType` (string, required): File type for all files
- `animalId` (number, optional): Associated animal ID
- `appointmentId` (number, optional): Associated appointment ID
- `description` (string, optional): Base description for all files

**Response:**
```json
{
  "success": true,
  "message": "5 dosya başarıyla yüklendi",
  "data": [
    {
      "id": 3,
      "fileName": "batch_file_1.pdf",
      "originalName": "blood_test_1.pdf",
      "fileType": "BLOOD_TEST",
      "uploadDate": "2024-01-15T12:00:00"
    }
  ],
  "count": 5
}
```

### 4. Entity-Specific Uploads

#### Upload Animal-Related File
```http
POST /api/files/upload/animal/{animalId}
```

#### Upload Appointment-Related File
```http
POST /api/files/upload/appointment/{appointmentId}
```

**Parameters:** Same as basic upload, with automatic association to the specified entity.

### 5. File Download

#### Download File
```http
GET /api/files/download/{fileId}
```

**Response:** Binary file content with appropriate headers.

#### Get Download URL (Presigned)
```http
GET /api/files/download-url/{fileId}?expiredHours=24
```

**Parameters:**
- `expiredHours` (number, optional, default: 24): URL expiration time in hours

**Response:**
```json
{
  "success": true,
  "downloadUrl": "https://minio.example.com/bucket/file?signature=...",
  "expiredHours": 24
}
```

### 6. File Listing

#### Get Animal Files
```http
GET /api/files/animal/{animalId}
```

#### Get Appointment Files
```http
GET /api/files/appointment/{appointmentId}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "originalName": "medical_record.pdf",
      "fileType": "MEDICAL_RECORD",
      "uploadDate": "2024-01-15T10:30:00",
      "fileSize": 1024000
    }
  ],
  "count": 1
}
```

### 7. Advanced Search

#### Search Medical Documents
```http
GET /api/files/medical-documents/search
```

**Query Parameters:**
- `query` (string, optional): Search text
- `fileType` (string, optional): Filter by file type
- `animalId` (number, optional): Filter by animal
- `appointmentId` (number, optional): Filter by appointment
- `dateFrom` (string, optional): Start date filter (YYYY-MM-DD)
- `dateTo` (string, optional): End date filter (YYYY-MM-DD)
- `tags` (string[], optional): Filter by tags
- `page` (number, optional, default: 0): Page number
- `size` (number, optional, default: 20): Page size

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "originalName": "blood_test.pdf",
        "fileType": "BLOOD_TEST",
        "description": "Complete blood count",
        "tags": ["blood", "test", "routine"],
        "uploadDate": "2024-01-15T10:30:00",
        "isConfidential": true,
        "securityScanStatus": "CLEAN"
      }
    ],
    "totalElements": 45,
    "totalPages": 3,
    "currentPage": 0,
    "size": 20,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### 8. Document Versioning

#### Upload New Version
```http
POST /api/files/{fileId}/new-version
```

**Parameters:**
- `file` (multipart/form-data, required): New version file
- `versionNotes` (string, optional): Version change notes

**Response:**
```json
{
  "success": true,
  "message": "Yeni versiyon başarıyla yüklendi",
  "data": {
    "id": 5,
    "originalName": "medical_record_v2.pdf",
    "versionNumber": 2,
    "parentFileId": 1,
    "versionNotes": "Updated with latest test results"
  }
}
```

#### Get Document Versions
```http
GET /api/files/{fileId}/versions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "versionNumber": 2,
      "uploadDate": "2024-01-15T14:00:00",
      "isLatestVersion": true
    },
    {
      "id": 1,
      "versionNumber": 1,
      "uploadDate": "2024-01-15T10:30:00",
      "isLatestVersion": false
    }
  ],
  "count": 2
}
```

### 9. OCR Processing

#### Perform OCR on Document
```http
POST /api/files/{fileId}/ocr
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": 1,
    "fileName": "blood_test.pdf",
    "ocrStatus": "completed",
    "extractedText": "Hemoglobin: 12.5 g/dL\nLökosit: 8500/μL\nTrombosit: 250000/μL",
    "confidence": 0.95,
    "processedAt": "2024-01-15T15:30:00",
    "language": "tr",
    "keywords": ["hemoglobin", "lökosit", "trombosit"]
  }
}
```

### 10. Security Status

#### Get Document Security Status
```http
GET /api/files/{fileId}/security-status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": 1,
    "fileName": "medical_record.pdf",
    "scanStatus": "completed",
    "threatLevel": "low",
    "virusScanResult": "clean",
    "lastScanDate": "2024-01-15T11:00:00",
    "isEncrypted": false,
    "hasDigitalSignature": false,
    "accessLevel": "RESTRICTED",
    "complianceStatus": "GDPR compliant"
  }
}
```

### 11. File Management

#### Delete File (Soft Delete)
```http
DELETE /api/files/{fileId}
```

**Response:**
```json
{
  "success": true,
  "message": "Dosya başarıyla silindi"
}
```

#### Permanent Delete (Admin Only)
```http
DELETE /api/files/{fileId}/permanent
```

#### Get Supported File Types
```http
GET /api/files/types
```

**Response:**
```json
{
  "success": true,
  "data": [
    "DOCUMENT",
    "IMAGE",
    "MEDICAL_RECORD",
    "REPORT",
    "X_RAY",
    "BLOOD_TEST",
    "VACCINATION_RECORD",
    "OTHER"
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `413` - Payload Too Large (file size exceeded)
- `415` - Unsupported Media Type (invalid file format)
- `500` - Internal Server Error

---

## File Size Limits

| File Type | Maximum Size |
|-----------|-------------|
| X_RAY | 50 MB |
| MEDICAL_RECORD | 25 MB |
| BLOOD_TEST | 10 MB |
| REPORT | 15 MB |
| VACCINATION_RECORD | 5 MB |
| Others | 10 MB |

---

## Supported File Formats

- **Images:** JPEG, PNG, TIFF
- **Documents:** PDF, DOC, DOCX, TXT
- **Medical:** DICOM (for X-rays)

---

## Security Features

1. **Virus Scanning:** All uploaded files are automatically scanned for malware
2. **Access Control:** Files have different access levels (PUBLIC, NORMAL, RESTRICTED, CONFIDENTIAL)
3. **Encryption:** Sensitive files can be encrypted at rest
4. **Audit Trail:** All file operations are logged
5. **Digital Signatures:** Support for digitally signed documents
6. **Compliance:** GDPR and medical data protection compliance

---

## Usage Examples

### JavaScript/TypeScript Example

```typescript
// Upload medical document
const uploadMedicalDocument = async (file: File, metadata: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', metadata.fileType);
  formData.append('description', metadata.description);
  formData.append('isConfidential', metadata.isConfidential.toString());
  
  if (metadata.tags) {
    metadata.tags.forEach(tag => formData.append('tags', tag));
  }

  const response = await fetch('/api/files/upload/medical-document', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// Search documents
const searchDocuments = async (query: string, filters: any) => {
  const params = new URLSearchParams({
    query,
    ...filters,
    page: '0',
    size: '20'
  });

  const response = await fetch(`/api/files/medical-documents/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};
```

### cURL Examples

```bash
# Upload a medical document
curl -X POST "http://localhost:8090/api/files/upload/medical-document" \
  -H "Authorization: Bearer your-jwt-token" \
  -F "file=@medical_report.pdf" \
  -F "fileType=MEDICAL_RECORD" \
  -F "description=Patient medical history" \
  -F "isConfidential=true" \
  -F "tags=medical" \
  -F "tags=history"

# Search documents
curl -X GET "http://localhost:8090/api/files/medical-documents/search?query=blood&fileType=BLOOD_TEST&page=0&size=10" \
  -H "Authorization: Bearer your-jwt-token"

# Download a file
curl -X GET "http://localhost:8090/api/files/download/123" \
  -H "Authorization: Bearer your-jwt-token" \
  -o downloaded_file.pdf
```

---

## Database Schema

The enhanced file metadata is stored with the following key fields:

- **Basic Info:** id, fileName, originalName, fileSize, contentType
- **Classification:** fileType, bucketName, objectName
- **Metadata:** description, tags (JSON), uploadedBy, uploadDate
- **Medical Features:** isConfidential, expiryDate, accessLevel
- **Versioning:** parentFileId, versionNumber, versionNotes
- **Security:** securityScanStatus, securityScanDate, checksum
- **Processing:** ocrProcessed, ocrText
- **Relations:** animalId, appointmentId, ownerId
- **Status:** isActive, deletedBy, deletedDate

---

## Best Practices

1. **File Naming:** Use descriptive names with proper extensions
2. **Metadata:** Always provide meaningful descriptions and tags
3. **Security:** Mark sensitive documents as confidential
4. **Versioning:** Use version notes to track changes
5. **Cleanup:** Set expiry dates for temporary documents
6. **Error Handling:** Always check response status and handle errors
7. **Performance:** Use batch upload for multiple files
8. **Search:** Use specific filters to improve search performance

---

## Rate Limits

- **Upload:** 100 files per hour per user
- **Download:** 1000 requests per hour per user
- **Search:** 500 requests per hour per user

---

## Monitoring and Analytics

The system provides comprehensive logging and monitoring:

- Upload/download statistics
- File type distribution
- Security scan results
- Storage usage metrics
- User activity tracking
- Performance metrics

Access these through the admin dashboard or monitoring API endpoints.