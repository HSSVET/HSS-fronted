-- Medical Document Enhancement Schema
-- Adds new fields to file_metadata table for advanced medical document management

-- Add new columns to file_metadata table
ALTER TABLE file_metadata 
ADD COLUMN is_confidential BOOLEAN DEFAULT FALSE,
ADD COLUMN tags TEXT,
ADD COLUMN expiry_date TIMESTAMP,
ADD COLUMN parent_file_id BIGINT,
ADD COLUMN version_number INTEGER DEFAULT 1,
ADD COLUMN version_notes TEXT,
ADD COLUMN security_scan_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN security_scan_date TIMESTAMP,
ADD COLUMN ocr_processed BOOLEAN DEFAULT FALSE,
ADD COLUMN ocr_text TEXT,
ADD COLUMN access_level VARCHAR(20) DEFAULT 'NORMAL',
ADD COLUMN checksum VARCHAR(255),
ADD COLUMN deleted_by VARCHAR(255),
ADD COLUMN deleted_date TIMESTAMP;

-- Add foreign key constraint for versioning
ALTER TABLE file_metadata 
ADD CONSTRAINT fk_parent_file 
FOREIGN KEY (parent_file_id) REFERENCES file_metadata(id);

-- Add indexes for better performance
CREATE INDEX idx_file_metadata_parent_file_id ON file_metadata(parent_file_id);
CREATE INDEX idx_file_metadata_animal_id ON file_metadata(animal_id);
CREATE INDEX idx_file_metadata_appointment_id ON file_metadata(appointment_id);
CREATE INDEX idx_file_metadata_upload_date ON file_metadata(upload_date);
CREATE INDEX idx_file_metadata_file_type ON file_metadata(file_type);
CREATE INDEX idx_file_metadata_security_scan_status ON file_metadata(security_scan_status);
CREATE INDEX idx_file_metadata_access_level ON file_metadata(access_level);
CREATE INDEX idx_file_metadata_is_confidential ON file_metadata(is_confidential);
CREATE INDEX idx_file_metadata_expiry_date ON file_metadata(expiry_date);

-- Create full-text search index for OCR text (PostgreSQL specific)
-- CREATE INDEX idx_file_metadata_ocr_text_fts ON file_metadata USING gin(to_tsvector('turkish', ocr_text));

-- Add check constraints
ALTER TABLE file_metadata 
ADD CONSTRAINT chk_security_scan_status 
CHECK (security_scan_status IN ('PENDING', 'SCANNING', 'CLEAN', 'INFECTED', 'FAILED'));

ALTER TABLE file_metadata 
ADD CONSTRAINT chk_access_level 
CHECK (access_level IN ('PUBLIC', 'NORMAL', 'RESTRICTED', 'CONFIDENTIAL'));

ALTER TABLE file_metadata 
ADD CONSTRAINT chk_version_number 
CHECK (version_number > 0);

-- Create view for active medical documents with enhanced metadata
CREATE OR REPLACE VIEW v_medical_documents AS
SELECT 
    fm.id,
    fm.file_name,
    fm.original_name,
    fm.file_size,
    fm.content_type,
    fm.bucket_name,
    fm.object_name,
    fm.file_type,
    fm.description,
    fm.uploaded_by,
    fm.upload_date,
    fm.updated_date,
    fm.animal_id,
    fm.appointment_id,
    fm.owner_id,
    fm.is_active,
    fm.is_confidential,
    fm.tags,
    fm.expiry_date,
    fm.parent_file_id,
    fm.version_number,
    fm.version_notes,
    fm.security_scan_status,
    fm.security_scan_date,
    fm.ocr_processed,
    fm.ocr_text,
    fm.access_level,
    fm.checksum,
    fm.deleted_by,
    fm.deleted_date,
    -- Additional computed fields
    CASE 
        WHEN fm.expiry_date IS NOT NULL AND fm.expiry_date < NOW() THEN TRUE 
        ELSE FALSE 
    END as is_expired,
    CASE 
        WHEN fm.parent_file_id IS NOT NULL THEN TRUE 
        ELSE FALSE 
    END as is_version,
    -- Get latest version flag
    CASE 
        WHEN fm.parent_file_id IS NULL THEN TRUE
        WHEN fm.version_number = (
            SELECT MAX(version_number) 
            FROM file_metadata fm2 
            WHERE fm2.parent_file_id = fm.parent_file_id OR fm2.id = fm.parent_file_id
        ) THEN TRUE
        ELSE FALSE
    END as is_latest_version
FROM file_metadata fm
WHERE fm.is_active = TRUE;

-- Create audit table for file operations
CREATE TABLE file_audit_log (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT NOT NULL,
    operation VARCHAR(50) NOT NULL, -- UPLOAD, DOWNLOAD, DELETE, UPDATE, SCAN, OCR
    performed_by VARCHAR(255) NOT NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    FOREIGN KEY (file_id) REFERENCES file_metadata(id)
);

-- Add indexes for audit log
CREATE INDEX idx_file_audit_log_file_id ON file_audit_log(file_id);
CREATE INDEX idx_file_audit_log_performed_at ON file_audit_log(performed_at);
CREATE INDEX idx_file_audit_log_operation ON file_audit_log(operation);
CREATE INDEX idx_file_audit_log_performed_by ON file_audit_log(performed_by);

-- Create function to automatically log file operations
CREATE OR REPLACE FUNCTION log_file_operation()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO file_audit_log (file_id, operation, performed_by, details)
        VALUES (NEW.id, 'UPLOAD', NEW.uploaded_by, 
                json_build_object('file_name', NEW.original_name, 'file_type', NEW.file_type));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log significant updates
        IF OLD.is_active = TRUE AND NEW.is_active = FALSE THEN
            INSERT INTO file_audit_log (file_id, operation, performed_by, details)
            VALUES (NEW.id, 'DELETE', NEW.deleted_by, 
                    json_build_object('soft_delete', true));
        END IF;
        
        IF OLD.security_scan_status != NEW.security_scan_status THEN
            INSERT INTO file_audit_log (file_id, operation, performed_by, details)
            VALUES (NEW.id, 'SCAN', 'SYSTEM', 
                    json_build_object('old_status', OLD.security_scan_status, 'new_status', NEW.security_scan_status));
        END IF;
        
        IF OLD.ocr_processed = FALSE AND NEW.ocr_processed = TRUE THEN
            INSERT INTO file_audit_log (file_id, operation, performed_by, details)
            VALUES (NEW.id, 'OCR', 'SYSTEM', 
                    json_build_object('ocr_completed', true));
        END IF;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER tr_file_metadata_audit
    AFTER INSERT OR UPDATE ON file_metadata
    FOR EACH ROW EXECUTE FUNCTION log_file_operation();

-- Create function to clean up expired files
CREATE OR REPLACE FUNCTION cleanup_expired_files()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    -- Mark expired files as inactive (soft delete)
    UPDATE file_metadata 
    SET is_active = FALSE, 
        deleted_by = 'SYSTEM_CLEANUP',
        deleted_date = NOW()
    WHERE expiry_date IS NOT NULL 
      AND expiry_date < NOW() 
      AND is_active = TRUE;
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    
    -- Log cleanup operation
    INSERT INTO file_audit_log (file_id, operation, performed_by, details)
    SELECT id, 'DELETE', 'SYSTEM_CLEANUP', 
           json_build_object('reason', 'expired', 'expired_date', expiry_date)
    FROM file_metadata 
    WHERE deleted_by = 'SYSTEM_CLEANUP' 
      AND deleted_date >= NOW() - INTERVAL '1 minute';
    
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get document statistics
CREATE OR REPLACE FUNCTION get_document_statistics()
RETURNS TABLE (
    total_documents BIGINT,
    active_documents BIGINT,
    confidential_documents BIGINT,
    expired_documents BIGINT,
    pending_scan_documents BIGINT,
    infected_documents BIGINT,
    ocr_processed_documents BIGINT,
    total_file_size BIGINT,
    documents_by_type JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_documents,
        COUNT(*) FILTER (WHERE fm.is_active = TRUE) as active_documents,
        COUNT(*) FILTER (WHERE fm.is_confidential = TRUE AND fm.is_active = TRUE) as confidential_documents,
        COUNT(*) FILTER (WHERE fm.expiry_date IS NOT NULL AND fm.expiry_date < NOW() AND fm.is_active = TRUE) as expired_documents,
        COUNT(*) FILTER (WHERE fm.security_scan_status = 'PENDING' AND fm.is_active = TRUE) as pending_scan_documents,
        COUNT(*) FILTER (WHERE fm.security_scan_status = 'INFECTED' AND fm.is_active = TRUE) as infected_documents,
        COUNT(*) FILTER (WHERE fm.ocr_processed = TRUE AND fm.is_active = TRUE) as ocr_processed_documents,
        COALESCE(SUM(fm.file_size) FILTER (WHERE fm.is_active = TRUE), 0) as total_file_size,
        json_object_agg(fm.file_type, type_count) as documents_by_type
    FROM file_metadata fm
    LEFT JOIN (
        SELECT file_type, COUNT(*) as type_count
        FROM file_metadata 
        WHERE is_active = TRUE
        GROUP BY file_type
    ) type_stats ON fm.file_type = type_stats.file_type;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO file_metadata (
    file_name, original_name, file_size, content_type, bucket_name, object_name,
    file_type, description, uploaded_by, is_confidential, tags, access_level
) VALUES 
(
    'sample_xray_001.jpg', 'patient_001_chest_xray.jpg', 2048576, 'image/jpeg',
    'hss-images', 'sample_xray_001_abc123_1735123456789.jpg',
    'X_RAY', 'Göğüs röntgeni - rutin kontrol', 'dr.ayse.kaya',
    FALSE, '["röntgen", "göğüs", "kontrol"]', 'NORMAL'
),
(
    'blood_test_001.pdf', 'patient_001_blood_results.pdf', 512000, 'application/pdf',
    'hss-medical-records', 'blood_test_001_def456_1735123456790.pdf',
    'BLOOD_TEST', 'Tam kan sayımı sonuçları', 'lab.teknisyeni',
    TRUE, '["kan", "tahlil", "hemogram"]', 'RESTRICTED'
),
(
    'vaccination_record_001.pdf', 'patient_001_vaccination.pdf', 256000, 'application/pdf',
    'hss-medical-records', 'vaccination_record_001_ghi789_1735123456791.pdf',
    'VACCINATION_RECORD', 'Aşı kayıt kartı', 'vet.hemsire',
    FALSE, '["aşı", "kayıt", "koruyucu"]', 'NORMAL'
);

-- Create scheduled job to cleanup expired files (PostgreSQL with pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-files', '0 2 * * *', 'SELECT cleanup_expired_files();');

COMMENT ON TABLE file_metadata IS 'Enhanced file metadata table with medical document specific features';
COMMENT ON COLUMN file_metadata.is_confidential IS 'Marks if document contains sensitive medical information';
COMMENT ON COLUMN file_metadata.tags IS 'JSON array of tags for categorization and search';
COMMENT ON COLUMN file_metadata.expiry_date IS 'Date when document expires and should be archived/deleted';
COMMENT ON COLUMN file_metadata.parent_file_id IS 'Reference to parent file for versioning';
COMMENT ON COLUMN file_metadata.version_number IS 'Version number for document versioning';
COMMENT ON COLUMN file_metadata.security_scan_status IS 'Status of security/virus scan';
COMMENT ON COLUMN file_metadata.ocr_text IS 'Extracted text from OCR processing';
COMMENT ON COLUMN file_metadata.access_level IS 'Access control level for the document';
COMMENT ON COLUMN file_metadata.checksum IS 'File integrity checksum (MD5/SHA256)';

COMMENT ON VIEW v_medical_documents IS 'View for active medical documents with computed fields';
COMMENT ON TABLE file_audit_log IS 'Audit trail for all file operations';
COMMENT ON FUNCTION cleanup_expired_files() IS 'Automated cleanup of expired documents';
COMMENT ON FUNCTION get_document_statistics() IS 'Returns comprehensive document statistics';