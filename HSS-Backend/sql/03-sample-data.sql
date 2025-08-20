-- HSS Sample Data - Personel Kayıtları
-- Keycloak kullanıcılarıyla eşleşen personel verileri

\c vetdb;

\echo 'Adding sample personnel data...';

-- Personel kayıtları - Keycloak kullanıcılarıyla eşleşen
INSERT INTO personel (adsoyad, eposta, telefon, ise_baslama_tarihi, aktif) VALUES
    ('HSS Admin', 'admin@veteriner.com', '0555-123-4567', '2024-01-01', true),
    ('Dr. Mehmet Özkan', 'mehmet.ozkan@veteriner.com', '0555-987-6543', '2024-01-01', true),
    ('Ayşe Yılmaz', 'ayse.yilmaz@veteriner.com', '0555-111-2222', '2024-01-01', true),
    ('Teknisyen Ali', 'ali.teknisyen@veteriner.com', '0555-333-4444', '2024-01-01', true);

-- Personel-Rol ilişkileri
INSERT INTO personel_rol (personel_id, rol_id) VALUES
    (1, 1), -- Admin -> ADMIN
    (2, 2), -- Dr. Mehmet -> VETERINER
    (3, 3), -- Ayşe -> SEKRETER
    (4, 4); -- Ali -> TEKNISYEN

-- Örnek sahip kayıtları
INSERT INTO sahip (ad, soyad, telefon, e_posta, adres) VALUES
    ('Ahmet', 'Yılmaz', '0532-123-4567', 'ahmet.yilmaz@email.com', 'Kadıköy, İstanbul'),
    ('Fatma', 'Demir', '0533-987-6543', 'fatma.demir@email.com', 'Beşiktaş, İstanbul'),
    ('Mehmet', 'Kaya', '0534-555-1234', 'mehmet.kaya@email.com', 'Şişli, İstanbul');

-- Örnek hayvan kayıtları
INSERT INTO hayvan (sahip_id, ad, tur_id, ırk_id, cinsiyet, doğum_tarihi, kilo, renk, mikrocip_no, notlar) VALUES
    (1, 'Karabaş', 1, 1, 'Erkek', '2020-05-15', 25.5, 'Siyah-Beyaz', '123456789012345', 'Çok enerjik ve oyuncu'),
    (1, 'Boncuk', 2, 4, 'Dişi', '2021-03-20', 4.2, 'Tekir', '234567890123456', 'Sakin ve sevimli'),
    (2, 'Şeker', 2, 5, 'Dişi', '2019-08-10', 5.8, 'Beyaz', '345678901234567', 'Çok temiz ve bakımlı'),
    (3, 'Rex', 1, 2, 'Erkek', '2018-12-05', 32.0, 'Sarı', '456789012345678', 'Eğitimli ve uyumlu');

-- Örnek randevu kayıtları (güncel tarihler)
INSERT INTO randevu (hayvan_id, tarih_saat, konu, veteriner_id) VALUES
    (1, '2024-07-20 10:00:00', 'Rutin kontrol ve aşı', 2),
    (2, '2024-07-21 14:30:00', 'Kısırlaştırma operasyonu', 2),
    (3, '2024-07-22 09:15:00', 'Diş temizliği', 2),
    (4, '2024-07-23 16:00:00', 'Yara kontrolü', 2),
    -- Güncel test randevuları (2025)
    (1, '2025-01-15 09:00:00', 'Aşı kontrolü', 2),
    (2, '2025-01-16 14:00:00', 'Genel muayene', 2),
    (3, '2025-01-17 11:30:00', 'Diş kontrolü', 2),
    (4, '2025-01-18 16:30:00', 'Aşı uygulaması', 2),
    (1, '2025-01-20 10:15:00', 'Rutin kontrol', 2),
    (2, '2025-01-21 13:45:00', 'Kısırlaştırma sonrası kontrol', 2);

-- Örnek aşı kayıtları
INSERT INTO asi (asi_ad, uygulama_yolu, koruma_suresi, notlar) VALUES
    ('Karma Aşı (DHPP)', 'Subkutan', '1 year', 'Yıllık tekrar gerekir'),
    ('Kuduz Aşısı', 'İntramüsküler', '1 year', 'Yasal zorunluluk'),
    ('Kedi Üçlü Aşısı', 'Subkutan', '1 year', 'Kediler için temel aşı');

INSERT INTO asi_karnesi (hayvan_id, asi_id, asi_adi, tarih, tekrar) VALUES
    (1, 1, 'Karma Aşı (DHPP)', '2024-01-15', '2025-01-15'),
    (1, 2, 'Kuduz Aşısı', '2024-01-15', '2025-01-15'),
    (2, 3, 'Kedi Üçlü Aşısı', '2024-02-10', '2025-02-10'),
    (3, 3, 'Kedi Üçlü Aşısı', '2024-01-20', '2025-01-20');

-- Örnek ilaç kayıtları
INSERT INTO ilac (ilac_ad, aktif_madde, kullanim_alani, uygulama_yolu, notlar) VALUES
    ('Antibiyotik X', 'Amoxicillin', 'Bakteriyel enfeksiyonlar', 'Oral', 'Yemekle birlikte verilmeli'),
    ('Ağrı Kesici Y', 'Meloxicam', 'Ağrı ve iltihaplanma', 'Oral', 'Mide problemlerine dikkat'),
    ('Parazit İlacı Z', 'Ivermectin', 'İç parazitler', 'Oral', 'Aylık kullanım');

-- Örnek fatura kayıtları
INSERT INTO fatura (sahip_id, tarih, tutar, aciklama) VALUES
    (1, '2024-07-15', 350.00, 'Karabaş - Rutin kontrol ve aşı'),
    (2, '2024-07-16', 800.00, 'Şeker - Diş temizliği'),
    (3, '2024-07-17', 150.00, 'Rex - Kontrol muayenesi');

INSERT INTO fatura_madde (fatura_id, aciklama, miktar, birim_fiyat, kdv_orani) VALUES
    (1, 'Muayene ücreti', 1, 100.00, 18.00),
    (1, 'Karma aşı', 1, 150.00, 18.00),
    (1, 'Kuduz aşısı', 1, 100.00, 18.00),
    (2, 'Diş temizliği', 1, 600.00, 18.00),
    (2, 'Anestezi', 1, 200.00, 18.00),
    (3, 'Genel muayene', 1, 150.00, 18.00);

\echo 'Sample data inserted successfully!';
\echo 'Personnel, animals, appointments, and billing data ready.'; 