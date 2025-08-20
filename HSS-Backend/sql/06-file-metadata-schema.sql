-- 06-file-metadata-schema.sql
-- Dosya metadata tablosu ve ilgili yapılar

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
    animal_id BIGINT REFERENCES animals(id),
    appointment_id BIGINT REFERENCES appointments(id),
    owner_id BIGINT REFERENCES owners(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_file_type CHECK (
        file_type IN ('DOCUMENT', 'IMAGE', 'MEDICAL_RECORD', 'REPORT', 'X_RAY', 'BLOOD_TEST', 'VACCINATION_RECORD', 'OTHER')
    )
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_file_metadata_file_name ON file_metadata(file_name);
CREATE INDEX IF NOT EXISTS idx_file_metadata_animal_id ON file_metadata(animal_id) WHERE animal_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_file_metadata_appointment_id ON file_metadata(appointment_id) WHERE appointment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_file_metadata_owner_id ON file_metadata(owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_file_metadata_file_type ON file_metadata(file_type);
CREATE INDEX IF NOT EXISTS idx_file_metadata_bucket_name ON file_metadata(bucket_name);
CREATE INDEX IF NOT EXISTS idx_file_metadata_upload_date ON file_metadata(upload_date);
CREATE INDEX IF NOT EXISTS idx_file_metadata_is_active ON file_metadata(is_active);
CREATE INDEX IF NOT EXISTS idx_file_metadata_uploaded_by ON file_metadata(uploaded_by);

-- Composite indeksler
CREATE INDEX IF NOT EXISTS idx_file_metadata_animal_type_active ON file_metadata(animal_id, file_type, is_active) 
    WHERE animal_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_file_metadata_appointment_type_active ON file_metadata(appointment_id, file_type, is_active) 
    WHERE appointment_id IS NOT NULL;

-- Trigger function for updating updated_date
CREATE OR REPLACE FUNCTION update_file_metadata_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_file_metadata_updated_date
    BEFORE UPDATE ON file_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_file_metadata_updated_date();

-- View: Aktif dosyalar
CREATE OR REPLACE VIEW active_files AS
SELECT 
    fm.*,
    a.name as animal_name,
    a.species_name as animal_species,
    o.first_name || ' ' || o.surname as owner_name,
    ap.appointment_date,
    ap.appointment_type
FROM file_metadata fm
LEFT JOIN animals a ON fm.animal_id = a.id
LEFT JOIN owners o ON fm.owner_id = o.id OR a.owner_id = o.id
LEFT JOIN appointments ap ON fm.appointment_id = ap.id
WHERE fm.is_active = true;

-- View: Dosya istatistikleri
CREATE OR REPLACE VIEW file_statistics AS
SELECT 
    file_type,
    bucket_name,
    COUNT(*) as file_count,
    SUM(file_size) as total_size,
    AVG(file_size) as avg_size,
    MIN(upload_date) as first_upload,
    MAX(upload_date) as last_upload
FROM file_metadata
WHERE is_active = true
GROUP BY file_type, bucket_name;

-- Comment'ler
COMMENT ON TABLE file_metadata IS 'MinIO object storage üzerindeki dosyaların metadata bilgilerini tutar';
COMMENT ON COLUMN file_metadata.file_name IS 'MinIO üzerindeki benzersiz dosya adı';
COMMENT ON COLUMN file_metadata.original_name IS 'Kullanıcının yüklediği orijinal dosya adı';
COMMENT ON COLUMN file_metadata.object_name IS 'MinIO object adı (file_name ile aynı)';
COMMENT ON COLUMN file_metadata.file_type IS 'Dosya kategorisi (DOCUMENT, IMAGE, MEDICAL_RECORD, vb.)';
COMMENT ON COLUMN file_metadata.bucket_name IS 'MinIO bucket adı';
COMMENT ON COLUMN file_metadata.is_active IS 'Soft delete için kullanılır';

-- Örnek veri (test için)
INSERT INTO file_metadata (
    file_name, original_name, file_size, content_type, bucket_name, 
    object_name, file_type, description, uploaded_by
) VALUES 
('sample_image_12345678_1234567890.jpg', 'sample_image.jpg', 2048576, 'image/jpeg', 
 'hss-images', 'sample_image_12345678_1234567890.jpg', 'IMAGE', 'Örnek resim dosyası', 'system'),
('sample_document_87654321_0987654321.pdf', 'sample_document.pdf', 1024000, 'application/pdf', 
 'hss-documents', 'sample_document_87654321_0987654321.pdf', 'DOCUMENT', 'Örnek belge', 'system');