-- HSS (Hayvan Sağlığı Sistemi) Database Schema
-- Veteriner Kliniği Yönetim Sistemi için veritabanı şeması
-- Bu dosya PostgreSQL konteyner başladığında otomatik olarak çalışır

\c vetdb;

\echo 'Creating HSS database schema...';

-- Tür tablosu (Köpek, Kedi, Kuş vb.)
CREATE TABLE tur (
    tur_id SERIAL PRIMARY KEY,
    ad VARCHAR
);

-- Irk tablosu (Golden Retriever, Tekir vb.)
CREATE TABLE ırk (
    ırk_id SERIAL PRIMARY KEY,
    tur_id INT REFERENCES tur(tur_id),
    ad VARCHAR
);

-- Sahip tablosu (Pet owners)
CREATE TABLE sahip (
    sahip_id SERIAL PRIMARY KEY,
    ad VARCHAR,
    soyad VARCHAR,
    telefon VARCHAR,
    e_posta VARCHAR,
    adres TEXT
);

-- Hayvan tablosu (Animals/Pets)
CREATE TABLE hayvan (
    hayvan_id SERIAL PRIMARY KEY,
    sahip_id INT REFERENCES sahip(sahip_id),
    ad VARCHAR,
    tur_id INT REFERENCES tur(tur_id),
    ırk_id INT REFERENCES ırk(ırk_id),
    cinsiyet VARCHAR,
    doğum_tarihi DATE,
    kilo DECIMAL,
    renk VARCHAR,
    mikrocip_no VARCHAR,
    alerjiler TEXT,
    kronik_hastalıklar TEXT,
    notlar TEXT
);

-- Hastalık geçmişi
CREATE TABLE hastalik_gecmisi (
    gecmis_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    tani TEXT,
    tarih DATE,
    tedavi TEXT
);

-- Klinik inceleme
CREATE TABLE klinik_inceleme (
    inceleme_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    tarih DATE,
    bulgular TEXT,
    veteriner_ad VARCHAR
);

-- Randevu sistemi
CREATE TABLE randevu (
    randevu_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    tarih_saat TIMESTAMP,
    konu TEXT,
    veteriner_id INT
);

-- Laboratuvar testleri
CREATE TABLE lab_testleri (
    test_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    test_adi VARCHAR,
    tarih DATE
);

-- Laboratuvar sonuçları
CREATE TABLE lab_sonuclari (
    sonuc_id SERIAL PRIMARY KEY,
    test_id INT REFERENCES lab_testleri(test_id),
    sonuc TEXT,
    deger VARCHAR,
    birim VARCHAR
);

-- Radyolojik görüntüleme
CREATE TABLE radyolojik_goruntuleme (
    goruntu_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    tarih DATE,
    tur VARCHAR,
    goruntu_url TEXT,
    yorum TEXT
);

-- İlaç kataloğu
CREATE TABLE ilac (
    ilac_id SERIAL PRIMARY KEY,
    ilac_ad VARCHAR(100) NOT NULL,
    aktif_madde VARCHAR(100),
    kullanim_alani VARCHAR(100),
    uygulama_yolu VARCHAR(50),
    notlar TEXT
);

-- Reçete sistemi
CREATE TABLE recete (
    recete_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    ilac_id INT REFERENCES ilac(ilac_id),
    tarih DATE,
    ilaclar TEXT,
    dozaj TEXT
);

-- Aşı kataloğu
CREATE TABLE asi (
    asi_id SERIAL PRIMARY KEY,
    asi_ad VARCHAR(100) NOT NULL,
    uygulama_yolu VARCHAR(50),
    koruma_suresi INTERVAL,
    notlar TEXT
);

-- Aşı karnesi
CREATE TABLE asi_karnesi (
    asi_karnesi_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    asi_id INT REFERENCES asi(asi_id),
    asi_adi VARCHAR,
    tarih DATE,
    tekrar VARCHAR
);

-- Patoloji bulguları
CREATE TABLE patoloji_bulgulari (
    patoloji_id SERIAL PRIMARY KEY,
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    rapor TEXT,
    tarih DATE
);

-- Faturalama sistemi
CREATE TABLE fatura (
    fatura_id SERIAL PRIMARY KEY,
    sahip_id INT REFERENCES sahip(sahip_id),
    tarih DATE,
    tutar DECIMAL,
    aciklama TEXT
);

-- Fatura maddeleri
CREATE TABLE fatura_madde (
    fatura_madde_id SERIAL PRIMARY KEY,
    fatura_id INT REFERENCES fatura(fatura_id),
    aciklama VARCHAR(200),
    miktar INT NOT NULL,
    birim_fiyat DECIMAL(10,2) NOT NULL,
    kdv_orani DECIMAL(5,2) DEFAULT 0
);

-- Doküman yönetimi
CREATE TABLE dokuman (
    dokuman_id SERIAL PRIMARY KEY,
    sahip_id INT REFERENCES sahip(sahip_id),
    hayvan_id INT REFERENCES hayvan(hayvan_id),
    baslik VARCHAR,
    icerik TEXT,
    tarih DATE
);

-- İletişim kayıtları
CREATE TABLE iletisim (
    iletisim_id SERIAL PRIMARY KEY,
    sahip_id INT REFERENCES sahip(sahip_id),
    konu VARCHAR,
    mesaj TEXT,
    tarih TIMESTAMP
);

-- Personel yönetimi
CREATE TABLE personel (
    personel_id SERIAL PRIMARY KEY,
    adsoyad VARCHAR,
    eposta VARCHAR,
    telefon VARCHAR,
    ise_baslama_tarihi DATE,
    aktif BOOLEAN
);

-- Kullanıcı hesapları
CREATE TABLE kullanici (
    kullanici_id SERIAL PRIMARY KEY,
    personel_id INT REFERENCES personel(personel_id),
    kullanici_adi VARCHAR,
    parola_hash VARCHAR,
    olusturma_tarihi TIMESTAMP,
    son_giris TIMESTAMP
);

-- Rol sistemi
CREATE TABLE rol (
    rol_id SERIAL PRIMARY KEY,
    ad VARCHAR,
    aciklama TEXT
);

-- Personel-Rol ilişkisi
CREATE TABLE personel_rol (
    personel_id INT REFERENCES personel(personel_id),
    rol_id INT REFERENCES rol(rol_id),
    PRIMARY KEY (personel_id, rol_id)
);

-- Stok ürünleri
CREATE TABLE stok_urun (
    urun_id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    barkod VARCHAR(50),
    lot_no VARCHAR(50),
    uretim_tarihi DATE,
    son_kullanma_tarihi DATE,
    min_stok INT DEFAULT 0,
    max_stok INT DEFAULT 0
);

-- Stok işlemleri
CREATE TABLE stok_islemi (
    islem_id SERIAL PRIMARY KEY,
    urun_id INT NOT NULL REFERENCES stok_urun(urun_id),
    islem_tarihi TIMESTAMP NOT NULL,
    miktar INT NOT NULL,
    birim_maliyet DECIMAL(10,2),
    tur VARCHAR(10),
    ilgili_varlik VARCHAR(50)
);

-- Ekipman yönetimi
CREATE TABLE ekipman (
    ekipman_id SERIAL PRIMARY KEY,
    ad VARCHAR(100),
    model VARCHAR(100),
    seri_no VARCHAR(100),
    satin_alma_tarihi DATE,
    konum VARCHAR(100)
);

-- Bakım kayıtları
CREATE TABLE bakim (
    bakim_id SERIAL PRIMARY KEY,
    ekipaman_id INT NOT NULL REFERENCES ekipman(ekipman_id),
    bakim_tarihi DATE NOT NULL,
    notlar TEXT
);

-- Hatırlatma sistemi
CREATE TABLE hatirlatma (
    hatirlatma_id SERIAL PRIMARY KEY,
    randevu_id INT NOT NULL REFERENCES randevu(randevu_id),
    gonderim_zamani TIMESTAMP NOT NULL,
    kanal VARCHAR(10),
    durum VARCHAR(20)
);

-- Rapor takvimi
CREATE TABLE rapor_takvimi (
    rapor_id SERIAL PRIMARY KEY,
    ad VARCHAR(100),
    frekans VARCHAR(20),
    son_calistirma TIMESTAMP
);

-- Örnek veri ekleme
INSERT INTO tur (ad) VALUES 
    ('Köpek'),
    ('Kedi'),
    ('Kuş'),
    ('Hamster'),
    ('Tavşan');

INSERT INTO ırk (tur_id, ad) VALUES 
    (1, 'Golden Retriever'),
    (1, 'Labrador'),
    (1, 'German Shepherd'),
    (2, 'Tekir'),
    (2, 'Persian'),
    (2, 'British Shorthair');

INSERT INTO rol (ad, aciklama) VALUES
    ('ADMIN', 'Sistem Yöneticisi'),
    ('VETERINER', 'Veteriner Hekim'),
    ('SEKRETER', 'Klinik Sekreteri'),
    ('TEKNISYEN', 'Veteriner Teknisyeni');

\echo 'HSS database schema created successfully!';
\echo 'Sample data inserted.';
\echo 'Database ready for use.'; 