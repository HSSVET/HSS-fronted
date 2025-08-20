-- HSS Database Schema Fix
-- JPA entity ile veritabanı uyumluluğu için

\c vetdb;

\echo 'Fixing schema validation issues...';

-- personel_id kolonu BIGINT yapılıyor
ALTER TABLE personel ALTER COLUMN personel_id TYPE BIGINT;

-- rol_id kolonu BIGINT yapılıyor
ALTER TABLE rol ALTER COLUMN rol_id TYPE BIGINT;

-- Sequence'leri de güncelle
ALTER SEQUENCE personel_personel_id_seq AS BIGINT;
ALTER SEQUENCE rol_rol_id_seq AS BIGINT;

-- Foreign key'leri de güncelle
ALTER TABLE personel_rol ALTER COLUMN personel_id TYPE BIGINT;
ALTER TABLE personel_rol ALTER COLUMN rol_id TYPE BIGINT;

\echo 'Schema validation issues fixed!';
\echo 'All ID columns are now BIGINT compatible with JPA entities.'; 