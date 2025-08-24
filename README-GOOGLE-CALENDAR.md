# 🗓️ Google Calendar Entegrasyonu - HSS Frontend

Bu dokümantasyon, HSS (Hayvan Sağlığı Sistemi) frontend projesinde Google Calendar entegrasyonunun nasıl kurulduğunu ve kullanıldığını açıklar.

## 🚀 Özellikler

- ✅ **Google OAuth2 Authentication**: Güvenli Google hesap bağlama
- ✅ **Otomatik Randevu Ekleme**: HSS randevuları otomatik Google Calendar'a eklenir
- ✅ **Akıllı Hatırlatmalar**: 15 dakika önce popup hatırlatması
- ✅ **Çoklu Takvim Desteği**: Kullanıcının tüm Google takvimlerine erişim
- ✅ **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## 🔧 Kurulum

### 1. Gerekli Paketler

```bash
npm install @google-cloud/local-auth googleapis
```

### 2. Environment Variables

`.env` dosyasına şu değişkenleri ekleyin:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CALENDAR_API_KEY=your_google_api_key
```

### 3. Google Cloud Console Ayarları

1. **Google Cloud Projesi Oluşturma**
   - https://console.cloud.google.com adresine gidin
   - Yeni proje oluşturun: "HSS-Veterinary-Clinic"

2. **Google Calendar API'yi Etkinleştirme**
   - APIs & Services → Library
   - "Google Calendar API" arayın ve etkinleştirin

3. **OAuth Consent Screen**
   - User Type: External
   - Scopes: `.../auth/calendar`, `.../auth/calendar.events`

4. **OAuth2 Credentials**
   - Application Type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`

5. **API Key Oluşturma**
   - Create Credentials → API key
   - Website restrictions ekleyin
   - API restrictions: Google Calendar API

## 📁 Dosya Yapısı

```
src/
├── services/
│   └── googleCalendarService.ts    # Google Calendar servisi
├── features/
│   └── appointments/
│       ├── components/
│       │   └── AppointmentForm.tsx # Randevu formu + Google Calendar UI
│       └── styles/
│           └── AppointmentForm.css  # Google Calendar stilleri
└── types/
    └── appointments.ts              # Tip tanımları
```

## 🎯 Kullanım

### 1. Randevu Oluşturma

1. **Randevu Formunu Açın**
   - HSS sisteminde yeni randevu oluşturun

2. **Google Hesabını Bağlayın**
   - "Google Hesabını Bağla" butonuna tıklayın
   - Google OAuth2 consent screen'de izin verin

3. **Google Calendar Seçeneğini Aktif Edin**
   - "Bu randevuyu Google Takvim'e ekle" checkbox'ını işaretleyin

4. **Randevuyu Kaydedin**
   - Form bilgilerini doldurun ve kaydedin
   - Randevu otomatik olarak Google Calendar'a eklenir

### 2. Google Calendar Event Detayları

```
Başlık: "Randevu: [Hayvan Adı] - [Sahip Adı]"
Açıklama: 
  - Hayvan: [Hayvan Adı] ([Irk] [Tür])
  - Sahip: [Sahip Adı]
  - Telefon: [Telefon]
  - Açıklama: [Randevu Açıklaması]
Konum: Veteriner Kliniği
Hatırlatma: 15 dakika önce popup
```

## 🔐 Güvenlik

### OAuth2 Scopes
- `https://www.googleapis.com/auth/calendar` - Takvim erişimi
- `https://www.googleapis.com/auth/calendar.events` - Event yönetimi

### Veri Gizliliği
- Sadece gerekli bilgiler Google'a gönderilir
- Hassas tıbbi bilgiler Google Calendar'da saklanmaz
- Kullanıcı istediği zaman bağlantıyı kesebilir

## 🚨 Hata Yönetimi

### Yaygın Hatalar

1. **Google API Rate Limit**
   - Günlük 1 milyon istek limiti
   - Hata durumunda kullanıcı bilgilendirilir

2. **OAuth2 Token Süresi Dolması**
   - Otomatik token yenileme
   - Gerekirse yeniden giriş yapma

3. **İnternet Bağlantı Sorunları**
   - Offline mod desteği
   - Manuel senkronizasyon seçeneği

### Hata Mesajları

```typescript
// Başarı
"Randevu başarıyla Google Takvim'e eklendi!"

// Hata
"Randevu kaydedildi ancak Google Takvim'e eklenirken hata oluştu."
"Google hesabına giriş yapılamadı"
```

## 🎨 UI Bileşenleri

### Google Calendar Checkbox
```tsx
<label className="google-checkbox-label">
  <input
    type="checkbox"
    checked={addToGoogleCalendar}
    onChange={handleGoogleCalendarToggle}
    className="google-checkbox"
  />
  <span>Bu randevuyu Google Takvim'e ekle</span>
</label>
```

### Google Hesap Bağlama Butonu
```tsx
<button
  type="button"
  onClick={handleGoogleCalendarConnect}
  className="google-connect-btn"
>
  <Calendar size={16} />
  Google Hesabını Bağla
</button>
```

## 🔄 API Endpoints

### Google Calendar Service

```typescript
// Servis başlatma
await googleCalendarService.initialize();

// Google hesabına giriş
const success = await googleCalendarService.signIn();

// Randevu ekleme
const eventId = await googleCalendarService.addAppointmentToCalendar(appointment);

// Event silme
await googleCalendarService.removeEventFromCalendar(eventId);

// Bağlantı durumu kontrol
const isConnected = googleCalendarService.isSignedIn();
```

## 📱 Responsive Tasarım

### Mobil Uyumluluk
- Google Calendar butonları tam genişlik
- Touch-friendly checkbox'lar
- Mobil optimizasyonlu form layout

### Masaüstü Özellikleri
- Hover efektleri
- Smooth transitions
- Professional görünüm

## 🧪 Test

### Test Senaryoları

1. **Google Hesap Bağlama**
   - OAuth2 flow test
   - Token yönetimi
   - Bağlantı durumu kontrol

2. **Randevu Ekleme**
   - Form validation
   - Google Calendar entegrasyonu
   - Hata durumları

3. **Çoklu Takvim**
   - Takvim listesi
   - Takvim seçimi
   - Event oluşturma

### Test Komutları

```bash
# Projeyi başlat
npm start

# Test çalıştır
npm test

# Build
npm run build
```

## 🚀 Gelecek Geliştirmeler

### Planlanan Özellikler

1. **Bildirim Sistemi**
   - Toast notifications
   - Success/error mesajları
   - Loading indicators

2. **Gelişmiş Takvim Yönetimi**
   - Çoklu takvim seçimi
   - Özel takvim oluşturma
   - Takvim senkronizasyonu

3. **Offline Desteği**
   - Service Worker
   - Local storage
   - Background sync

4. **Analytics**
   - Google Calendar kullanım istatistikleri
   - Randevu başarı oranları
   - Kullanıcı davranış analizi

## 📞 Destek

### Sorun Giderme

1. **Console Logları Kontrol Edin**
   - Browser Developer Tools
   - Network tab
   - Console errors

2. **Environment Variables Kontrol Edin**
   - .env dosyası
   - Google Cloud Console
   - API key permissions

3. **Google API Quotas Kontrol Edin**
   - Daily limits
   - Rate limiting
   - Billing status

### İletişim

- **GitHub Issues**: Proje repository'sinde issue açın
- **Email**: [Destek Email Adresi]
- **Dokümantasyon**: Bu README dosyası

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Google Calendar entegrasyonu için geçerli Google Cloud Console ayarları ve API key'ler gereklidir. Güvenlik nedeniyle bu bilgiler public repository'de paylaşılmamalıdır.
