# Frontend Staging Deployment Setup

Bu dokümantasyon, HSS frontend'in `develop` branch'ine push yapıldığında otomatik olarak Firebase Hosting'e (hssvet.com) deploy edilmesi için gerekli kurulum adımlarını içerir.

## Özet

- **Trigger**: `develop` branch'e push
- **Deploy Target**: Firebase Hosting **staging channel**
- **Production Domain**: `hssvet.com` (production channel - main branch)
- **Staging Domain**: `staging.hssvet.com` (staging channel - develop branch)
- **Backend**: hss-backend-dev (Cloud Run)
- **Build Config**: `HSS/cloudbuild.yaml`

## Ön Gereksinimler

1. ✅ Firebase Hosting yapılandırılmış
2. ✅ Domain (hssvet.com) bağlı
3. ⚠️ Cloud Build trigger oluşturulacak
4. ⚠️ Firebase service account permissions

## Cloud Build Trigger Kurulumu

### 1. Google Cloud Console'da Trigger Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/cloud-build/triggers) → Cloud Build → Triggers
2. **"Create Trigger"** tıklayın
3. Ayarları yapın:

   **Event:**
   - Repository: Repository adınızı seçin
   - Repository source: Cloud Source Repositories veya GitHub
   - Trigger type: `Push to a branch`
   - Branch: `^develop$` (staging için)

   **Source:**
   - Repository: Repository'nizi seçin
   - Branch: `^develop$`

   **Configuration:**
   - Type: `Cloud Build configuration file (yaml or json)`
   - Location: Repository
   - Cloud Build configuration file: `HSS/cloudbuild.yaml`

### 2. Substitution Variables

Trigger'da şu substitution variables'ları ekleyin:

| Variable | Value |
|----------|-------|
| `_BACKEND_URL` | `https://hss-backend-dev-296268886725.europe-west3.run.app` |
| `_FIREBASE_PROJECT` | `hss-cloud-473511` |
| `_ENVIRONMENT` | `staging` |

**Not**: `_ENVIRONMENT` değişkeni hangi channel'a deploy edileceğini belirler (staging veya production).

### 3. Firebase Hosting Targets ve Custom Domain

Firebase Hosting'de staging ve production olmak üzere iki ayrı site oluşturup custom domain bağlayın:

```bash
# 1. Firebase'de hosting targets oluşturun
cd HSS
firebase use hss-cloud-473511
firebase target:apply hosting production hss-frontend-prod
firebase target:apply hosting staging hss-frontend-staging

# 2. staging.hssvet.com subdomain'ini bağlayın
# Firebase Console'dan Hosting → Add custom domain → staging.hssvet.com
```

**Önemli**: DNS'te `staging.hssvet.com` için CNAME kaydı oluşturmanız gerekecek.

Firebase Console'dan domain eklerken Firebase size CNAME kaydını gösterecek:

**Firebase'nin Gösterdiği CNAME Kaydı:**
```
Record Type: CNAME
Domain Name: staging.hssvet.com
Value: hss-cloud-473511.web.app
```

Bu DNS kaydını sağlayıcınıza ekleyin. Firebase'in gösterdiği değerler doğrudur.

**Kurulum Adımları:**
1. Firebase Console → Hosting → "Add custom domain" 
2. `staging.hssvet.com` girin
3. Firebase size DNS kaydını gösterir (CNAME)
4. DNS sağlayıcınıza bu CNAME kaydını ekleyin
5. Firebase'de "Verify" butonuna tıklayın
6. DNS propagation sonrası domain aktif olur

### 4. Service Account Permissions

Cloud Build'in Firebase Hosting'e deploy edebilmesi için, Cloud Build service account'ına Firebase Hosting Admin rolü verin:

```bash
# 1. Cloud Build service account'ı bulun
PROJECT_NUMBER=$(gcloud projects describe hss-cloud-473511 --format="value(projectNumber)")

# 2. Firebase Hosting Admin rolü verin
gcloud projects add-iam-policy-binding hss-cloud-473511 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/firebasehosting.admin"
```

### 5. Repository Connection

Cloud Build'in repository'nize erişebilmesi için bağlantıyı kontrol edin:

- Repository: `HSS-frontend` (Cloud Source Repositories veya GitHub)
- Connection yapılmış olmalı

Eğer bağlantı yoksa, Cloud Console'da "Connect Repository" ile bağlayın.

## Build Process

Trigger tetiklendiğinde:

1. **Install**: Node.js dependencies yüklenir (`npm ci`)
2. **Build**: React app build edilir (`npm run build`) - backend URL environment variable ile set edilir
3. **Deploy**: Firebase Hosting'e **staging channel**'a deploy edilir (`firebase hosting:channel:deploy staging`)
4. **Monitor**: Deployment logu kaydedilir
5. **URL**: Staging URL'i `https://staging.hssvet.com`

## Environment Variables

Build sırasında `REACT_APP_API_URL` environment variable'ı set edilir:

```bash
REACT_APP_API_URL=https://hss-backend-dev-296268886725.europe-west3.run.app
```

Bu URL `src/services/api.ts` içinde API çağrıları için kullanılır.

**Önemli**: Staging için kalıcı domain `staging.hssvet.com` olacak (DNS ayarlarından sonra).

## Staging URL'ine Erişim

DNS kaydı doğrulanana kadar geçici URL kullanabilirsiniz:

1. **Firebase Console** → Hosting → Channels
2. "staging" channel'ını bulun
3. Geçici URL: `https://hss-cloud-473511--staging.web.app` (veya benzeri)

DNS kaydı doğrulandıktan sonra kalıcı URL kullanılabilir: `https://staging.hssvet.com`

## Manuel Deploy (Test İçin)

Trigger'ı test etmek için:

```bash
# develop branch'e push yapın
git checkout develop
git add .
git commit -m "test: trigger staging deploy"
git push origin develop
```

Build logları için:
```bash
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

## Troubleshooting

### Build Failed: Firebase Authentication
- Service account permissions'ı kontrol edin (`roles/firebasehosting.admin`)
- Permission'ı şu komutla kontrol edin:
  ```bash
  gcloud projects get-iam-policy hss-cloud-473511 \
    --flatten="bindings[].members" \
    --filter="bindings.role:roles/firebasehosting.admin"
  ```

### Build Failed: Build Too Large
- Firebase Hosting limitleri: 10 GB total, max 10,000 dosya
- Şu an için yeterli, ileride gerekiyorsa `firebase.json` içinde `ignore` rules ekleyin

### Backend Connection Issues
- `_BACKEND_URL` doğru set edilmiş mi kontrol edin
- Backend servisinin çalıştığından emin olun: `gcloud run services describe hss-backend-dev`

## Sonraki Adımlar

1. Backend-dev trigger kurulumu (benzer şekilde)
2. Production trigger kurulumu (main branch → production environment)
3. Preview environments (PR bazlı staging)

