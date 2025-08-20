# MinIO Object Storage Integration

Bu dokümantasyon, HSS (Hayvan Sağlığı Sistemi) projesine entegre edilen MinIO Object Storage özelliklerini açıklar.

## 🎯 Özellikler

- **Dosya Depolama**: Güvenli ve ölçeklenebilir dosya depolama
- **Çoklu Bucket Desteği**: Farklı dosya türleri için ayrı bucket'lar
- **Metadata Yönetimi**: Veritabanında dosya bilgilerinin izlenmesi
- **Presigned URL**: Güvenli dosya indirme linkleri
- **Soft Delete**: Dosyaların güvenli silinmesi
- **Real-time**: Anlık dosya yükleme ve indirme

## 🚀 Kurulum ve Yapılandırma

### 1. Docker ile MinIO Kurulumu

```bash
cd HSS-Backend
docker-compose up -d minio
```

MinIO servisleri:
- **API**: http://localhost:9000
- **Console**: http://localhost:9001
- **Kullanıcı**: admin / admin123456

### 2. Bucket Yapılandırması

Uygulama başlatıldığında otomatik olarak şu bucket'lar oluşturulur:

- `hss-documents`: Genel belgeler
- `hss-images`: Resimler ve X-ray görüntüleri
- `hss-medical-records`: Tıbbi kayıtlar, kan tahlilleri, aşı kayıtları
- `hss-reports`: Raporlar

### 3. Database Migration

```bash
# PostgreSQL veritabanında file_metadata tablosu otomatik oluşturulur
docker-compose up -d postgres
```

## 📊 Database Schema

### FileMetadata Entity

```sql
CREATE TABLE file_metadata (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100),
    bucket_name VARCHAR(100) NOT NULL,
    object_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(100),
    upload_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL,
    animal_id BIGINT REFERENCES animals(id),
    appointment_id BIGINT REFERENCES appointments(id),
    owner_id BIGINT REFERENCES owners(id),
    is_active BOOLEAN DEFAULT TRUE
);
```

### File Types

- `DOCUMENT`: Genel belgeler
- `IMAGE`: Resimler
- `MEDICAL_RECORD`: Tıbbi kayıtlar
- `REPORT`: Raporlar
- `X_RAY`: Röntgen görüntüleri
- `BLOOD_TEST`: Kan tahlil sonuçları
- `VACCINATION_RECORD`: Aşı kayıtları
- `OTHER`: Diğer dosyalar

## 🔌 API Endpoints

### Dosya Yükleme

```http
POST /api/files/upload
Content-Type: multipart/form-data

file: [dosya]
fileType: IMAGE
description: "Hayvan fotoğrafı"
```

### Hayvan Dosyası Yükleme

```http
POST /api/files/upload/animal/{animalId}
Content-Type: multipart/form-data

file: [dosya]
fileType: MEDICAL_RECORD
description: "Kan tahlil sonucu"
```

### Randevu Dosyası Yükleme

```http
POST /api/files/upload/appointment/{appointmentId}
Content-Type: multipart/form-data

file: [dosya]
fileType: X_RAY
description: "Röntgen görüntüsü"
```

### Dosya İndirme

```http
GET /api/files/download/{fileId}
```

### Presigned URL Oluşturma

```http
GET /api/files/download-url/{fileId}?expiredHours=24
```

### Dosya Listeleme

```http
# Hayvan dosyaları
GET /api/files/animal/{animalId}

# Randevu dosyaları
GET /api/files/appointment/{appointmentId}
```

### Dosya Silme

```http
# Soft delete
DELETE /api/files/{fileId}

# Kalıcı silme (admin)
DELETE /api/files/{fileId}/permanent
```

## 💻 Frontend Entegrasyonu

### React Component Örneği

```tsx
import React, { useRef } from 'react';

const FileUploadComponent: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (animalId: number) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'MEDICAL_RECORD');
    formData.append('description', 'Tıbbi kayıt');

    try {
      const response = await fetch(`/api/files/upload/animal/${animalId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        console.log('Dosya yüklendi:', result.data);
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
      />
      <button onClick={() => handleFileUpload(123)}>
        Dosya Yükle
      </button>
    </div>
  );
};
```

### File Download Service

```tsx
export const fileService = {
  async downloadFile(fileId: number): Promise<Blob> {
    const response = await fetch(`/api/files/download/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.blob();
  },

  async getDownloadUrl(fileId: number, expiredHours: number = 24): Promise<string> {
    const response = await fetch(`/api/files/download-url/${fileId}?expiredHours=${expiredHours}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return result.downloadUrl;
  },

  async getAnimalFiles(animalId: number): Promise<FileMetadata[]> {
    const response = await fetch(`/api/files/animal/${animalId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return result.data;
  }
};
```

## ⚡ Real-time Özellikler

### WebSocket Integration (Gelecek)

```typescript
// Real-time dosya yükleme durumu
const fileUploadProgress = useWebSocket('/ws/file-upload-progress');

// Real-time yeni dosya bildirimleri
const newFileNotifications = useWebSocket('/ws/new-files');
```

## 🔧 Yapılandırma

### application.yml

```yaml
hss:
  storage:
    minio:
      endpoint: http://localhost:9000
      access-key: admin
      secret-key: admin123456
      buckets:
        documents: hss-documents
        images: hss-images
        medical-records: hss-medical-records
        reports: hss-reports
      max-file-size: 10MB
```

### Docker Compose

```yaml
minio:
  image: minio/minio:latest
  container_name: hss-minio
  restart: unless-stopped
  command: server /data --console-address ":9001"
  environment:
    MINIO_ROOT_USER: admin
    MINIO_ROOT_PASSWORD: admin123456
  ports:
    - "9000:9000"  # MinIO API
    - "9001:9001"  # MinIO Console
  volumes:
    - minio_data:/data
  networks:
    - hss-network
```

## 🛡️ Güvenlik

- **JWT Authentication**: Tüm dosya işlemleri için kimlik doğrulama
- **Keycloak Integration**: Rol tabanlı erişim kontrolü
- **Presigned URLs**: Güvenli dosya paylaşımı
- **Bucket Policies**: MinIO seviyesinde erişim kontrolü

## 📈 Performans

- **Streaming Upload/Download**: Büyük dosyalar için bellek verimli işlem
- **Presigned URLs**: Doğrudan MinIO erişimi ile hızlı indirme
- **Database Indexing**: Hızlı dosya arama ve listeleme
- **Connection Pooling**: Veritabanı bağlantı optimizasyonu

## 🔍 Monitoring

### MinIO Console
- http://localhost:9001
- Bucket yönetimi
- Dosya browser
- Performans metrikleri

### Database Views

```sql
-- Dosya istatistikleri
SELECT * FROM file_statistics;

-- Aktif dosyalar
SELECT * FROM active_files WHERE animal_id = 123;
```

## 🚨 Troubleshooting

### MinIO Bağlantı Sorunları

```bash
# MinIO durumunu kontrol et
docker logs hss-minio

# MinIO health check
curl -f http://localhost:9000/minio/health/live
```

### Database Migration Sorunları

```bash
# Tablo oluşturma kontrolü
docker exec -it hss-postgres psql -U postgres -d vetdb -c "\dt file_metadata"
```

## 📝 TODO

- [ ] WebSocket ile real-time progress tracking
- [ ] Dosya thumbnail oluşturma
- [ ] Automatic file compression
- [ ] Virus scanning integration
- [ ] Advanced search ve filtering
- [ ] Bulk file operations
- [ ] File versioning system