# Google Cloud Identity Platform Test Rehberi

Bu doküman, Google Cloud Identity Platform (Firebase Auth) sistemini test etmek için gerekli tüm adımları içerir.

## 1. Google Cloud Console Hazırlığı

### 1.1 Google Cloud Hesabı ve Proje Oluşturma

1. **Google Cloud Console'a giriş yapın**
   - https://console.cloud.google.com adresine gidin
   - Google hesabınızla giriş yapın (yoksa oluşturun)

2. **Yeni proje oluşturun**
   - Üst menüden "Proje Seç" butonuna tıklayın
   - "YENİ PROJE" butonuna tıklayın
   - Proje adı: `hss-vet-clinic` (veya istediğiniz bir isim)
   - Proje ID'si otomatik oluşturulur (not edin)
   - "OLUŞTUR" butonuna tıklayın
   - Projenin seçili olduğundan emin olun

### 1.2 Billing (Faturalandırma) Kontrolü

- Identity Platform genellikle ücretsiz kotaya sahiptir, ancak billing hesabı açmanız gerekebilir
- Sol menüden "Faturalandırma" → "Hesap ekle" (eğer yoksa)
- Billing hesabı olmadan da test edebilirsiniz (ücretsiz kotada çalışır)

## 2. Gerekli API'leri Etkinleştirme

### 2.1 Identity Platform API'sini Etkinleştirme

1. Sol menüden **"API'ler ve Hizmetler"** > **"Kitaplık"** seçin
2. Arama kutusuna **"Identity Platform"** yazın
3. **"Identity Platform API"** seçin
4. **"ETKİNLEŞTİR"** butonuna tıklayın
5. Birkaç dakika bekleyin (API etkinleşme süresi)

### 2.2 Identity Toolkit API'sini Etkinleştirme

1. **"API'ler ve Hizmetler"** > **"Kitaplık"** seçin
2. Arama kutusuna **"Identity Toolkit API"** yazın
3. **"Identity Toolkit API"** seçin
4. **"ETKİNLEŞTİR"** butonuna tıklayın

### 2.3 Secure Token Service API'sini Etkinleştirme ⚠️ ÖNEMLİ

**Bu API olmadan giriş yapamazsınız!** Bu hata için kritik:

1. **"API'ler ve Hizmetler"** > **"Kitaplık"** seçin
2. Arama kutusuna **"Secure Token Service API"** veya **"Secure Token"** yazın
3. **"Identity and Access Management (IAM) API"** veya **"Secure Token Service API"** seçin
4. Eğer bulamazsanız, direkt URL: https://console.cloud.google.com/apis/library/securetoken.googleapis.com
5. **"ETKİNLEŞTİR"** butonuna tıklayın

**Alternatif: Tüm API'leri toplu etkinleştirme:**
- https://console.cloud.google.com/apis/library adresine gidin
- Şu API'leri arayıp **hepsini** etkinleştirin:
  - ✅ Identity Platform API
  - ✅ Identity Toolkit API  
  - ✅ Secure Token Service API (securetoken.googleapis.com)
  - ✅ Firebase Authentication API (opsiyonel ama önerilir)

### 2.2 Authentication Providers'ı Yapılandırma

1. Sol menüden **"Identity Platform"** > **"Authentication"** seçin
2. İlk kez kullanıyorsanız **"Get started"** butonuna tıklayın
3. **"Sign-in method"** (Giriş yöntemi) sekmesine gidin
4. **Email/Password** provider'ını bulun
5. **"Enable"** (Etkinleştir) açın
6. **"Email link (passwordless sign-in)"** opsiyonunu kapatabilirsiniz (şu an gerekmez)
7. **"SAVE"** (Kaydet) butonuna tıklayın

## 3. Backend için Service Account Oluşturma

### 3.1 Service Account Oluşturma

1. Sol menüden **"IAM ve Yönetici"** > **"Hizmet Hesapları"** seçin
2. Üst kısımdan **"HİZMET HESABI OLUŞTUR"** butonuna tıklayın
3. Bilgileri girin:
   - **Hizmet hesabı adı:** `hss-backend-service`
   - **Hizmet hesabı kimliği:** Otomatik oluşturulur
   - **Açıklama:** `HSS Backend Identity Platform Service Account`
4. **"OLUŞTUR VE DEVAM ET"** butonuna tıklayın

### 3.2 Rol Atama

1. **"Rol seçin"** dropdown'ından şu rolü seçin:
   - **"Identity Platform Admin"** veya **"roles/identitytoolkit.admin"**
   - Arama kutusuna "Identity Platform" yazarak bulabilirsiniz
2. **"TAMAM"** butonuna tıklayın
3. **"BİTTİ"** butonuna tıklayın (opsiyonel adımları atlayabilirsiniz)

### 3.3 JSON Key İndirme

1. Oluşturduğunuz service account'u listeden bulun ve tıklayın
2. Üst menüden **"KEYS"** (Anahtarlar) sekmesine gidin
3. **"ADD KEY"** > **"Create new key"** seçin
4. **"JSON"** formatını seçin
5. **"OLUŞTUR"** butonuna tıklayın
6. JSON dosyası otomatik olarak indirilecek (örneğin: `hss-backend-service-xxxxx.json`)
7. **ÖNEMLİ:** Bu dosyayı güvenli bir yere kaydedin ve asla Git'e commit etmeyin!

### 3.4 Backend'e Service Account Key Ekleme

1. İndirdiğiniz JSON dosyasını backend projesine kopyalayın:
   ```
   hssbackend/src/main/hss-backend-service-account-key.json
   ```

2. **Backend `application.yaml` dosyasını güncelleyin:**
   ```yaml
   firebase:
     project-id: your-project-id  # GCP Proje ID'nizi buraya yazın
     service-account-key: src/main/hss-backend-service-account-key.json
   ```

   Veya environment variable olarak:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/hss-backend-service-account-key.json
   export GCP_PROJECT_ID=your-project-id
   ```

## 4. Frontend için Web API Key Oluşturma

### 4.1 API Key Oluşturma

1. Sol menüden **"API'ler ve Hizmetler"** > **"Kimlik Bilgileri"** seçin
2. Üst kısımdan **"Kimlik bilgileri oluştur"** > **"API anahtarı"** seçin
3. API key otomatik oluşturulur ve bir dialog açılır
4. **API key'i kopyalayın** (kapatmadan önce, tekrar göremezsiniz!)
   - Örnek format: `AIzaSy...` ile başlar

### 4.2 API Key Kısıtlamaları (Güvenlik için)

1. Oluşturulan API key'in yanındaki **"Düzenle"** (kalem ikonu) butonuna tıklayın
2. **"API kısıtlamaları"** bölümünden:
   - **"Belirli API'leri kısıtla"** seçin
   - **"Identity Toolkit API"** seçin (arama kutusuna yazın)
3. **"HTTP referrer kısıtlamaları"** bölümünden (opsiyonel ama önerilir):
   - Development için: `http://localhost:*`
   - Production için: `https://yourdomain.com/*`
4. **"KAYDET"** butonuna tıklayın

### 4.3 Frontend Environment Variables

1. `HSS` klasöründe `.env` dosyası oluşturun (yoksa):
   ```
   HSS/.env
   ```

2. `.env` dosyasına şu değişkenleri ekleyin:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSy...  # Oluşturduğunuz API key
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id  # GCP Proje ID'niz
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.web.app  # veya your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com  # Opsiyonel
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789  # Opsiyonel
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef  # Opsiyonel
   ```

3. **ÖNEMLİ:** `.env` dosyasını `.gitignore`'a ekleyin:
   ```gitignore
   .env
   .env.local
   ```

## 5. İlk Test Kullanıcısı Oluşturma

### 5.1 Backend API ile Kullanıcı Oluşturma

Backend servisiniz çalışırken (Spring Boot), admin API endpoint'ini kullanarak ilk kullanıcıyı oluşturabilirsiniz:

**Not:** İlk admin kullanıcısını oluşturmak için, backend'de geçici olarak admin kontrolünü devre dışı bırakmanız veya başka bir yöntem kullanmanız gerekebilir. 

**Seçenek 1: Google Cloud Console'dan Manuel Oluşturma (Önerilen)**

1. Sol menüden **"Identity Platform"** > **"Users"** seçin
2. **"ADD USER"** butonuna tıklayın
3. Bilgileri girin:
   - **Email:** `admin@vetclinic.com` (veya istediğiniz email)
   - **Password:** Güçlü bir şifre girin
   - **Display name:** `Admin User`
4. **"ADD USER"** butonuna tıklayın
5. Kullanıcı oluşturuldu!

**Seçenek 2: Backend API ile Oluşturma (Admin Token Gerekli)**

Backend'iniz çalışıyorsa, service account key ile bir admin token oluşturup kullanabilirsiniz (daha gelişmiş yöntem).

### 5.2 İlk Kullanıcıya Role (Custom Claim) Atama

**Google Cloud Console'dan direkt role atayamazsınız**, bunu backend API üzerinden yapmanız gerekir.

**✅ Önerilen Yöntem: Geçici InitialSetup Endpoint'i (ADC Modeli - JSON Key Gerektirmez)**

Bu yöntem, mevcut ADC (Application Default Credentials) modelinize uygundur ve JSON key dosyası gerektirmez.

1. **Backend servisinizi başlatın (DEV profili ile):**
   ```bash
   cd hssbackend
   ./mvnw spring-boot:run
   ```
   
   Veya eğer `gcloud` CLI kullanıyorsanız:
   ```bash
   gcloud auth application-default login
   ./mvnw spring-boot:run
   ```

2. **Geçici endpoint'in çalışıp çalışmadığını kontrol edin:**
   ```bash
   curl http://localhost:8080/api/admin/initial-setup/health
   ```
   
   Veya tarayıcıdan: http://localhost:8080/api/admin/initial-setup/health
   
   Beklenen yanıt:
   ```json
   {
     "status": "active",
     "profile": "dev",
     "warning": "⚠️ Bu geçici endpoint - İlk kurulum sonrası SİLİN!",
     "endpoint": "/api/admin/initial-setup/assign-role",
     "usage": "POST ?email=user@example.com&role=ADMIN"
   }
   ```

3. **Rol atamak için POST request gönderin:**

   **ÖNEMLİ: Email Parametresi**
   - Email parametresine, Google Cloud Console'da oluşturduğunuz kullanıcının email adresini yazın
   - Eğer Console'da `admin@vetclinic.com` ile kullanıcı oluşturduysanız, aynı email'i kullanın
   - Eğer kendi email'inizle (`your-email@gmail.com` gibi) kullanıcı oluşturduysanız, o email'i kullanın
   - Email, Identity Platform'da kayıtlı olan bir kullanıcının email'i olmalı

   **cURL ile:**
   ```bash
   # Örnek 1: Console'da oluşturduğunuz email ile
   curl -X POST "http://localhost:8080/api/admin/initial-setup/assign-role?email=admin@vetclinic.com&role=ADMIN"
   
   # Örnek 2: Kendi email'inizle oluşturduysanız
   curl -X POST "http://localhost:8080/api/admin/initial-setup/assign-role?email=your-email@gmail.com&role=ADMIN"
   ```
   
   ⚠️ Email'i yanlış yazarsanız "Kullanıcı bulunamadı" hatası alırsınız.

   **Tarayıcıdan test etmek için:**
   - Tarayıcı sadece GET request yapabilir, bu endpoint POST gerektirir
   - Postman, cURL veya benzer bir araç kullanmanız gerekir
   - Alternatif olarak, Swagger UI kullanabilirsiniz: http://localhost:8080/swagger-ui.html

   **Postman ile:**
   - Method: `POST`
   - URL: `http://localhost:8080/api/admin/initial-setup/assign-role`
   - Params (Query Params):
     - `email`: `admin@vetclinic.com` (veya Console'da oluşturduğunuz email)
     - `role`: `ADMIN`
   
   **Swagger UI ile:**
   1. http://localhost:8080/swagger-ui.html adresine gidin
   2. `InitialSetupController` bölümünü bulun
   3. `POST /api/admin/initial-setup/assign-role` endpoint'ini açın
   4. "Try it out" butonuna tıklayın
   5. `email` ve `role` parametrelerini girin
   6. "Execute" butonuna tıklayın

   **Beklenen başarılı yanıt:**
   ```json
   {
     "success": true,
     "message": "Rol başarıyla atandı. Kullanıcının token'ını yenilemesi gerekiyor.",
     "user": {
       "uid": "abc123xyz456",
       "email": "admin@vetclinic.com",
       "displayName": "Admin User",
       "role": "ADMIN"
     },
     "warning": "⚠️ Bu endpoint'i kullandıktan sonra bu controller'ı SİLİN!",
     "nextStep": "Kullanıcının logout/login yapması gerekiyor (token yenileme için)"
   }
   ```

4. **⚠️ ÖNEMLİ: Rol atandıktan sonra:**
   - Backend kodundan `InitialSetupController.java` dosyasını **SİLİN**
   - `SecurityConfig.java`'daki şu satırı **SİLİN**:
     ```java
     .requestMatchers("/api/admin/initial-setup/**").permitAll()
     ```

5. **Kullanıcının token'ını yenilemesi:**
   - Kullanıcının logout/login yapması gerekiyor
   - Veya token'ın expire olmasını bekleyip yeniden login yapması gerekiyor
   - Çünkü custom claims değiştiğinde mevcut token geçersiz olur

**Desteklenen Roller:**
- `ADMIN`
- `VET` veya `VETERINARIAN` veya `VETERINER`
- `CLINIC_STAFF` veya `STAFF`
- `OWNER`

## 6. Test Etme

### 6.1 Backend Testi

1. **Backend'i başlatın:**
   ```bash
   cd hssbackend
   ./mvnw spring-boot:run
   ```

2. **Swagger UI'dan test edin:**
   - http://localhost:8080/swagger-ui.html adresine gidin
   - Korumalı bir endpoint'i test edin (örneğin: `/api/animals`)
   - Authorization header'ına `Bearer <id-token>` ekleyin

### 6.2 Frontend Testi

1. **Environment variables'ları kontrol edin:**
   ```bash
   cd HSS
   cat .env  # Değişkenlerin doğru olduğundan emin olun
   ```

2. **Frontend'i başlatın:**
   ```bash
   npm install  # firebase paketini yüklemek için
   npm start
   ```

3. **Login sayfasına gidin:**
   - http://localhost:3000/login
   - Oluşturduğunuz kullanıcı ile giriş yapın
   - Email: `admin@vetclinic.com`
   - Password: Oluşturduğunuz şifre

4. **Kontrol edin:**
   - Login başarılı olmalı
   - Dashboard'a yönlendirilmelisiniz
   - Sidebar'da kullanıcı bilgileri görünmeli
   - Rollere göre menü öğeleri filtrelenmiş olmalı

## 7. Sorun Giderme

### 7.1 "API key not valid" Hatası

- API key'in Identity Toolkit API'ye erişim izni olduğundan emin olun
- API kısıtlamalarını kontrol edin
- Frontend `.env` dosyasındaki `REACT_APP_FIREBASE_API_KEY` değerini kontrol edin

### 7.2 "Invalid token" veya "Unauthorized" Hatası (Backend)

- Service account key'in doğru yüklendiğinden emin olun
- `application.yaml`'daki `firebase.project-id` değerini kontrol edin
- Token'ın expire olup olmadığını kontrol edin (1 saat geçerlilik)
- Authorization header formatını kontrol edin: `Bearer <token>`

### 7.3 "Permission denied" veya "Access denied" Hatası

- Service account'un `Identity Platform Admin` rolüne sahip olduğundan emin olun
- Custom claims'in doğru atandığını kontrol edin
- Kullanıcının token'ını yeniden alması gerekebilir (logout/login)

### 7.4 Kullanıcı Giriş Yapamıyor

- Email/Password provider'ının etkin olduğundan emin olun
- Kullanıcının Identity Platform'da oluşturulduğundan emin olun
- Şifrenin doğru olduğundan emin olun
- Browser console'da hata mesajlarını kontrol edin

### 7.5 Role Bilgisi Görünmüyor

- Custom claims'in backend'de doğru atandığını kontrol edin
- Kullanıcının token'ını yenilemesi gerekebilir (logout/login)
- Frontend'de ID token'ın custom claims'lerini içerdiğini kontrol edin:
  ```javascript
  // Browser console'da:
  const token = localStorage.getItem('hss_id_token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Claims:', payload);
  console.log('Role:', payload.role);
  ```

## 8. Hızlı Test Checklist

- [ ] Google Cloud projesi oluşturuldu
- [ ] Identity Platform API etkinleştirildi
- [ ] Email/Password provider etkinleştirildi
- [ ] Service account oluşturuldu ve rol atandı
- [ ] Service account JSON key indirildi ve backend'e eklendi
- [ ] Web API key oluşturuldu ve kısıtlandı
- [ ] Frontend `.env` dosyası oluşturuldu ve değişkenler eklendi
- [ ] Backend `application.yaml` yapılandırıldı
- [ ] İlk test kullanıcısı oluşturuldu
- [ ] Test kullanıcısına ADMIN rolü atandı
- [ ] Backend servisi başlatıldı ve çalışıyor
- [ ] Frontend servisi başlatıldı ve çalışıyor
- [ ] Login başarılı
- [ ] Token backend'de doğrulanıyor
- [ ] Role-based menü filtreleniyor
- [ ] Protected route'lar çalışıyor

## 9. İlave Notlar

### 9.1 Production Hazırlığı

- API key'i production domain'i ile kısıtlayın
- Service account key'i Google Cloud Secret Manager'da saklayın
- Environment variables'ları production ortamında doğru şekilde yapılandırın
- HTTPS kullanın

### 9.2 Güvenlik

- Service account JSON key'ini asla Git'e commit etmeyin
- `.env` dosyasını `.gitignore`'a ekleyin
- API key kısıtlamalarını aktif tutun
- Production'da sadece gerekli API'leri etkinleştirin

### 9.3 Custom Claims Güncelleme

Custom claims değiştirildiğinde, kullanıcının token'ını yenilemesi gerekir:
- Logout/login yapabilir
- Veya backend'den force refresh token yapabilir

## 10. Hızlı Referans - Önemli Bilgiler

**GCP Proje ID:** `your-project-id`  
**API Key:** `AIzaSy...`  
**Service Account Key Path:** `hssbackend/src/main/hss-backend-service-account-key.json`  
**Frontend .env Path:** `HSS/.env`  

Bu bilgileri güvenli bir yerde saklayın!

