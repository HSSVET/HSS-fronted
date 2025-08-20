-- HSS Database Schema Update
-- Keycloak senkronizasyonu için ek kolonlar

\c vetdb;

\echo 'Updating database schema for Keycloak synchronization...';

-- Personel tablosuna Keycloak senkronizasyonu için ek kolonlar
ALTER TABLE personel ADD COLUMN IF NOT EXISTS keycloak_user_id VARCHAR(50) UNIQUE;
ALTER TABLE personel ADD COLUMN IF NOT EXISTS son_senkronizasyon TIMESTAMP;
ALTER TABLE personel ADD COLUMN IF NOT EXISTS olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE personel ADD COLUMN IF NOT EXISTS guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Personel tablosuna rol kolonu (eğer yoksa)
ALTER TABLE personel ADD COLUMN IF NOT EXISTS rol VARCHAR(50);

-- Mevcut personel kayıtlarını güncelle
UPDATE personel SET 
    olusturma_tarihi = CURRENT_TIMESTAMP,
    guncelleme_tarihi = CURRENT_TIMESTAMP
WHERE olusturma_tarihi IS NULL;

-- Trigger oluştur: guncelleme_tarihi otomatik güncelleme
CREATE OR REPLACE FUNCTION update_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ı personel tablosuna ekle
DROP TRIGGER IF EXISTS personel_guncelleme_tarihi ON personel;
CREATE TRIGGER personel_guncelleme_tarihi
    BEFORE UPDATE ON personel
    FOR EACH ROW
    EXECUTE FUNCTION update_guncelleme_tarihi();

-- Index'ler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_personel_keycloak_user_id ON personel(keycloak_user_id);
CREATE INDEX IF NOT EXISTS idx_personel_eposta ON personel(eposta);
CREATE INDEX IF NOT EXISTS idx_personel_aktif ON personel(aktif);
CREATE INDEX IF NOT EXISTS idx_personel_rol ON personel(rol);

-- Rol tablosuna index
CREATE INDEX IF NOT EXISTS idx_rol_ad ON rol(ad);

\echo 'Database schema updated successfully!';
\echo 'Keycloak synchronization columns added.'; 