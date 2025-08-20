# 🔔 Otomatik Hatırlatma Sistemi

Bu dokümantasyon, HSS (Veteriner Kliniği Yönetim Sistemi) için geliştirilen otomatik hatırlatma sistemini açıklamaktadır.

## 📋 Sistem Özellikleri

### ✅ Tamamlanan Özellikler

1. **Otomatik Hatırlatma Oluşturma**
   - Randevu oluşturulduğunda otomatik 1 gün öncesi hatırlatma
   - SMS ve Email kanalları için ayrı hatırlatmalar

2. **Scheduled Tasks (Zamanlanmış Görevler)**
   - Her 15 dakikada beklemedeki hatırlatmaları kontrol
   - Saatlik randevu hatırlatması kontrolü
   - Günlük aşı hatırlatması kontrolü
   - Haftalık eski hatırlatma temizliği

3. **Manuel Hatırlatma Yönetimi**
   - REST API ile manuel hatırlatma oluşturma
   - Test SMS/Email gönderimi
   - Başarısız hatırlatmaları yeniden deneme

4. **Frontend Yönetim Paneli**
   - Hatırlatma durumu görüntüleme
   - Manuel hatırlatma oluşturma
   - Sistem istatistikleri
   - Test gönderimi arayüzü

## 🗂️ Dosya Yapısı

### Backend (Spring Boot)
```
HSS-Backend/src/main/java/com/vetverse/hss/
├── scheduler/
│   └── ReminderScheduler.java          # Zamanlanmış görevler
├── service/
│   ├── ReminderService.java            # Hatırlatma business logic
│   ├── NotificationService.java        # SMS/Email gönderme
│   └── AppointmentService.java         # Güncellenmiş (otomatik hatırlatma)
├── controller/
│   └── ReminderController.java         # REST API endpoints
└── repository/
    ├── ReminderRepository.java         # Mevcut (güncellenmiş)
    └── VaccinationRecordRepository.java # Güncellenmiş
```

### Frontend (React)
```
HSS/src/features/reminders/
├── components/
│   ├── ReminderManagement.tsx          # Ana yönetim bileşeni
│   ├── ReminderManagement.css
│   ├── RemindersPage.tsx               # Tam sayfa bileşeni
│   └── RemindersPage.css
├── services/
│   └── reminderService.ts              # API çağrıları
└── index.ts                            # Export dosyası
```

## ⚙️ Konfigürasyon

### application.yml Ayarları

```yaml
hss:
  # Hatırlatma sistemi
  reminders:
    enabled: true
    process-interval: 900000  # 15 dakika
    cleanup-after-months: 3
    auto-create: true
    
  # SMS ayarları
  sms:
    enabled: false  # Geliştirme için kapalı
    api:
      url: https://api.example.com/sms/send
      key: your-sms-api-key-here
    provider: twilio
    
  # Email ayarları
  email:
    enabled: false  # Geliştirme için kapalı
    api:
      url: https://api.example.com/email/send
      key: your-email-api-key-here
    from: noreply@vetclinic.com
    provider: sendgrid
```

## 🚀 Kullanım

### 1. Otomatik Hatırlatmalar

Sistem otomatik olarak çalışır:
- Yeni randevu oluşturulduğunda hatırlatma oluşturulur
- Scheduled tasks arka planda çalışır
- Hatırlatmalar belirlenen zamanlarda gönderilir

### 2. Manuel Hatırlatma Oluşturma

**REST API:**
```bash
POST /api/reminders/create
Content-Type: application/x-www-form-urlencoded

appointmentId=123&channel=SMS&sendTime=2024-01-20T09:00:00
```

**Frontend:**
- `/reminders` sayfasında yönetim paneli
- "Yeni Hatırlatma" butonu ile manuel oluşturma

### 3. Test Gönderimi

**REST API:**
```bash
POST /api/reminders/test
Content-Type: application/x-www-form-urlencoded

channel=SMS&destination=05551234567
```

## 📊 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/reminders/create` | Manuel hatırlatma oluştur |
| POST | `/api/reminders/test` | Test bildirimi gönder |
| POST | `/api/reminders/process` | Beklemedeki hatırlatmaları işle |
| POST | `/api/reminders/create-appointment-reminders` | Randevu hatırlatmaları oluştur |
| POST | `/api/reminders/create-vaccination-reminders` | Aşı hatırlatmaları oluştur |
| POST | `/api/reminders/retry-failed` | Başarısız hatırlatmaları yeniden dene |
| GET  | `/api/reminders/system-status` | Sistem durumu |

## 🔧 Geliştirme Notları

### Scheduled Tasks Zamanları

- **Hatırlatma İşleme**: Her 15 dakika (`@Scheduled(fixedRate = 900000)`)
- **Randevu Hatırlatması**: Her saat başı (`@Scheduled(cron = "0 0 * * * *")`)
- **Aşı Hatırlatması**: Günlük 08:00 (`@Scheduled(cron = "0 0 8 * * *")`)
- **Başarısız Tekrar**: Günde 2 kez (`@Scheduled(cron = "0 0 9,17 * * *")`)
- **Temizlik**: Haftalık Pazar 02:00 (`@Scheduled(cron = "0 0 2 * * SUN")`)

### SMS/Email Entegrasyonu

Şu anda test modu için ayarlandı. Gerçek kullanım için:

1. `application.yml`'de `sms.enabled: true` yapın
2. SMS provider API bilgilerini ekleyin (Twilio, Nexmo, vs.)
3. Email provider API bilgilerini ekleyin (SendGrid, Mailgun, vs.)
4. `NotificationService`'i provider'a göre düzenleyin

### Veritabanı

Mevcut `hatirlatma` tablosu kullanılıyor:
- `hatirlatma_id`: Primary key
- `randevu_id`: Foreign key (Appointment)
- `gonderim_zamani`: Gönderim zamanı
- `kanal`: SMS/EMAIL
- `durum`: PENDING/SENT/FAILED

## 🧪 Test

Test scripti kullanın:
```bash
# Windows
./HSS-Backend/test-reminder-system.sh

# Linux/Mac
chmod +x HSS-Backend/test-reminder-system.sh
./HSS-Backend/test-reminder-system.sh
```

## 🚨 Önemli Notlar

1. **Güvenlik**: Sadece VETERINER ve ADMIN rolleri hatırlatma yönetebilir
2. **Performance**: Büyük klinikler için batch size ayarları eklenebilir
3. **Monitoring**: Log dosyalarını takip edin
4. **Backup**: Hatırlatma verilerini düzenli yedekleyin

## 🎯 Gelecek Geliştirmeler

- [ ] WhatsApp entegrasyonu
- [ ] Push notification desteği
- [ ] Hatırlatma şablonları
- [ ] Kişiselleştirilmiş mesajlar
- [ ] Detaylı raporlama
- [ ] Toplu hatırlatma gönderimi
- [ ] Hatırlatma istatistikleri dashboard'u

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **Hatırlatmalar gönderilmiyor**
   - Scheduler aktif mi kontrol edin
   - SMS/Email ayarları doğru mu?
   - Log dosyalarını inceleyin

2. **Frontend hatası**
   - API endpoint'leri erişilebilir mi?
   - CORS ayarları doğru mu?
   - Browser console'u kontrol edin

3. **Veritabanı hatası**
   - Tablo yapısı doğru mu?
   - Foreign key constraints kontrol edin
   - Connection pool durumu

### Log Takibi

```bash
# Hatırlatma logları
tail -f logs/application.log | grep "Reminder"

# Scheduled task logları
tail -f logs/application.log | grep "Scheduled"
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Test script'ini çalıştırın
3. API endpoint'lerini manuel test edin
4. Veritabanı bağlantısını kontrol edin

---

**Son Güncelleme**: 2024-01-15
**Versiyon**: 1.0.0
**Geliştirici**: HSS Team
