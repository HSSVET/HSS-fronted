# Frontend Cloud Build Trigger Kurulum Komutları

Bu dosya frontend için Cloud Build trigger'larını oluşturmak için gereken komutları içerir.

## Ön Gereksinimler

1. GCP projesi: `hss-cloud-473511`
2. GitHub repository bağlantısı: Cloud Build'de GitHub repository'nin bağlı olması gerekiyor
3. Service account izinleri: Cloud Build service account'unun Firebase Hosting admin rolüne sahip olması gerekiyor
4. Firebase token (opsiyonel): Eğer Firebase authentication için token kullanılacaksa Secret Manager'da saklanmalı

## Service Account İzinlerini Kontrol Et

```bash
# Firebase Hosting admin rolünü kontrol et
gcloud projects get-iam-policy hss-cloud-473511 \
  --flatten="bindings[].members" \
  --filter="bindings.members:*cloudbuild*"

# Eğer Firebase Hosting izni yoksa, ekle:
gcloud projects add-iam-policy-binding hss-cloud-473511 \
  --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/firebasehosting.admin"
```

## Frontend DEV Trigger (main branch)

```bash
gcloud builds triggers create github \
  --repo-name=HSS-frontend \
  --repo-owner=HSSVET \
  --branch-pattern="^main$" \
  --build-config="HSS/cloudbuild.yaml" \
  --name="hss-frontend-staging" \
  --description="Frontend DEV deployment from main branch" \
  --region=europe-west3 \
  --substitutions="_ENVIRONMENT=dev,_TAG_NAME=dev" \
  --project=hss-cloud-473511
```

**Not:** Repository adı görüntüde "HSS-fronted" olarak görünüyor, gerçek adı kontrol edin.

## Frontend PROD Trigger (v* tags)

```bash
gcloud builds triggers create github \
  --repo-name=HSS-frontend \
  --repo-owner=HSSVET \
  --tag-pattern="^v.*" \
  --build-config="HSS/cloudbuild.yaml" \
  --name="hss-frontend-prod" \
  --description="Frontend PROD deployment from main branch tags" \
  --region=europe-west3 \
  --substitutions="_ENVIRONMENT=prod,_TAG_NAME=${TAG_NAME}" \
  --project=hss-cloud-473511
```

## Firebase Token ile Authentication (Opsiyonel)

Eğer Firebase token kullanmak isterseniz:

1. Firebase token'ı alın:
```bash
firebase login:ci
```

2. Token'ı Secret Manager'a kaydedin:
```bash
echo -n "YOUR_FIREBASE_TOKEN" | gcloud secrets create firebase-token \
  --data-file=- \
  --project=hss-cloud-473511
```

3. Trigger'da token'ı kullanın:
```bash
gcloud builds triggers update hss-frontend-prod \
  --substitutions="_FIREBASE_TOKEN=$(gcloud secrets versions access latest --secret=firebase-token --project=hss-cloud-473511)"
```

## Mevcut Trigger'ları Listele

```bash
gcloud builds triggers list --project=hss-cloud-473511 --region=europe-west3
```

## Trigger'ı Test Et

```bash
# Manuel olarak trigger'ı çalıştır
gcloud builds triggers run hss-frontend-staging \
  --branch=main \
  --project=hss-cloud-473511 \
  --region=europe-west3
```

## Build Loglarını İzle

```bash
# Son build'leri listele
gcloud builds list --limit=10 --project=hss-cloud-473511

# Build loglarını görüntüle
gcloud builds log BUILD_ID --project=hss-cloud-473511 --stream
```

## Troubleshooting

### Firebase Deploy Hatası

Eğer Firebase deploy hatası alıyorsanız:

1. Service account izinlerini kontrol edin:
```bash
gcloud projects get-iam-policy hss-cloud-473511 \
  --flatten="bindings[].members" \
  --filter="bindings.members:*@cloudbuild.gserviceaccount.com"
```

2. Firebase project ID'sini kontrol edin:
```bash
firebase projects:list
```

### Build Timeout

Timeout süresini artırmak için `cloudbuild.yaml` dosyasında:
```yaml
timeout: '1800s'  # 30 dakika
```

### NPM Dependencies Hatası

NPM cache'ini temizlemek için build adımında:
```bash
npm ci --no-cache
```

