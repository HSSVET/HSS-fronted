-- Simple file metadata table creation
-- Bu script sadece file_metadata tablosunu oluşturur

-- FileMetadata tablosu
CREATE TABLE IF NOT EXISTS file_metadata (
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
    upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    animal_id BIGINT,
    appointment_id BIGINT,
    owner_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_file_type CHECK (
        file_type IN ('DOCUMENT', 'IMAGE', 'MEDICAL_RECORD', 'REPORT', 'X_RAY', 'BLOOD_TEST', 'VACCINATION_RECORD', 'OTHER')
    )
);

-- Basic indexes for performance
CREATE INDEX IF NOT EXISTS idx_file_metadata_file_name ON file_metadata(file_name);
CREATE INDEX IF NOT EXISTS idx_file_metadata_animal_id ON file_metadata(animal_id) WHERE animal_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_file_metadata_appointment_id ON file_metadata(appointment_id) WHERE appointment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_file_metadata_file_type ON file_metadata(file_type);
CREATE INDEX IF NOT EXISTS idx_file_metadata_bucket_name ON file_metadata(bucket_name);
CREATE INDEX IF NOT EXISTS idx_file_metadata_is_active ON file_metadata(is_active);

-- Comment'ler
COMMENT ON TABLE file_metadata IS 'MinIO object storage üzerindeki dosyaların metadata bilgilerini tutar';
COMMENT ON COLUMN file_metadata.file_name IS 'MinIO üzerindeki benzersiz dosya adı';
COMMENT ON COLUMN file_metadata.original_name IS 'Kullanıcının yüklediği orijinal dosya adı';
COMMENT ON COLUMN file_metadata.is_active IS 'Soft delete için kullanılır';