#!/bin/bash

# MinIO API Test Script
# Bu script MinIO entegrasyonunu test eder

echo "🚀 MinIO API Test Script"
echo "========================"

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test dosyalarını oluştur
echo -e "${BLUE}📁 Test dosyaları oluşturuluyor...${NC}"
echo "This is a test image file for MinIO" > test-image.jpg
echo "This is a test document for MinIO" > test-document.pdf
echo "%PDF-1.4 Test medical record" > test-medical-record.pdf

echo -e "${GREEN}✅ Test dosyaları oluşturuldu${NC}"

# Servislerin durumunu kontrol et
echo -e "\n${BLUE}🔍 Servislerin durumu kontrol ediliyor...${NC}"

# MinIO kontrolü
if curl -s http://localhost:9000/minio/health/live > /dev/null; then
    echo -e "${GREEN}✅ MinIO: Çalışıyor (Port: 9000)${NC}"
else
    echo -e "${RED}❌ MinIO: Çalışmıyor${NC}"
    exit 1
fi

# PostgreSQL kontrolü
if nc -z localhost 5432; then
    echo -e "${GREEN}✅ PostgreSQL: Çalışıyor (Port: 5432)${NC}"
else
    echo -e "${RED}❌ PostgreSQL: Çalışmıyor${NC}"
    exit 1
fi

# Keycloak kontrolü
if curl -s http://localhost:8080/realms/veterinary-clinic > /dev/null; then
    echo -e "${GREEN}✅ Keycloak: Çalışıyor (Port: 8080)${NC}"
else
    echo -e "${RED}❌ Keycloak: Çalışmıyor${NC}"
    exit 1
fi

# Spring Boot uygulaması kontrolü
echo -e "\n${BLUE}⏳ Spring Boot uygulaması kontrol ediliyor...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8090/actuator/health > /dev/null; then
        echo -e "${GREEN}✅ Spring Boot: Çalışıyor (Port: 8090)${NC}"
        break
    else
        echo -e "${YELLOW}⏳ Spring Boot başlatılıyor... ($i/30)${NC}"
        sleep 2
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Spring Boot: 60 saniye sonra çalışmadı${NC}"
        echo -e "${YELLOW}💡 Spring Boot loglarını kontrol edin: docker logs hss-backend${NC}"
        exit 1
    fi
done

# MinIO Console erişim bilgileri
echo -e "\n${BLUE}🖥️  MinIO Console Bilgileri:${NC}"
echo -e "   URL: ${YELLOW}http://localhost:9001${NC}"
echo -e "   Username: ${YELLOW}admin${NC}"
echo -e "   Password: ${YELLOW}admin123456${NC}"

# JWT Token almaya çalış (Test için)
echo -e "\n${BLUE}🔐 JWT Token alınıyor...${NC}"
echo -e "${YELLOW}⚠️  Gerçek JWT token için Keycloak'tan authenticate olmanız gerekiyor${NC}"
echo -e "   Keycloak Admin: ${YELLOW}http://localhost:8080${NC}"
echo -e "   Username: ${YELLOW}admin${NC}"
echo -e "   Password: ${YELLOW}admin123${NC}"

# Test JWT token (sadece test amaçlı - gerçek uygulamada bu güvenli değil)
TEST_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0ZXIiLCJpYXQiOjE2OTE3NzA0MDAsImV4cCI6OTk5OTk5OTk5OX0.test"

echo -e "\n${BLUE}🧪 API Testleri Başlıyor...${NC}"

# 1. Dosya türlerini listeleme testi
echo -e "\n${BLUE}📋 1. Dosya türlerini listeleme${NC}"
RESPONSE=$(curl -s -X GET "http://localhost:8090/api/files/types")
if [[ $RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Dosya türleri başarıyla listelendi${NC}"
    echo "   Response: $RESPONSE"
else
    echo -e "${RED}❌ Dosya türleri listelenemedi${NC}"
    echo "   Response: $RESPONSE"
fi

# 2. Dosya yükleme testi (Authentication olmadan - 401 bekleniyor)
echo -e "\n${BLUE}📤 2. Dosya yükleme testi (Authentication olmadan)${NC}"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "http://localhost:8090/api/files/upload" \
  -F "file=@test-image.jpg" \
  -F "fileType=IMAGE" \
  -F "description=Test image upload")

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Authentication kontrolü çalışıyor (401 Unauthorized)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP Code: $HTTP_CODE${NC}"
    echo -e "   Response: $BODY"
fi

# 3. MinIO bucket'ları kontrol et
echo -e "\n${BLUE}🪣 3. MinIO Bucket'ları kontrol ediliyor...${NC}"
# MinIO client ile bucket'ları kontrol et (Docker içinde)
BUCKETS=$(docker exec hss-minio mc ls local 2>/dev/null || echo "")
if [[ $BUCKETS == *"hss-"* ]]; then
    echo -e "${GREEN}✅ MinIO bucket'ları oluşturuldu${NC}"
    echo "$BUCKETS"
else
    echo -e "${YELLOW}⚠️  Bucket'lar henüz oluşturulmamış veya erişilemiyor${NC}"
fi

# 4. Database bağlantısı testi
echo -e "\n${BLUE}🗄️  4. Database bağlantısı testi${NC}"
DB_TEST=$(docker exec hss-postgres psql -U postgres -d vetdb -c "\dt file_metadata" 2>/dev/null || echo "")
if [[ $DB_TEST == *"file_metadata"* ]]; then
    echo -e "${GREEN}✅ FileMetadata tablosu oluşturuldu${NC}"
else
    echo -e "${YELLOW}⚠️  FileMetadata tablosu bulunamadı. Migration çalışmamış olabilir.${NC}"
fi

# Test sonuçları
echo -e "\n${BLUE}📊 Test Sonuçları${NC}"
echo "================"
echo -e "${GREEN}✅ MinIO Service: Çalışıyor${NC}"
echo -e "${GREEN}✅ PostgreSQL: Çalışıyor${NC}"
echo -e "${GREEN}✅ Keycloak: Çalışıyor${NC}"
echo -e "${GREEN}✅ Spring Boot API: Çalışıyor${NC}"
echo -e "${GREEN}✅ Authentication: Kontrol ediliyor${NC}"

echo -e "\n${BLUE}🔧 Manuel Test İçin:${NC}"
echo "==================="
echo -e "1. Keycloak'a giriş yapın: ${YELLOW}http://localhost:8080${NC}"
echo -e "2. JWT token alın"
echo -e "3. Aşağıdaki curl komutuyla dosya yükleyin:"
echo ""
echo -e "${YELLOW}curl -X POST \"http://localhost:8090/api/files/upload\" \\"
echo -e "  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \\"
echo -e "  -F \"file=@test-image.jpg\" \\"
echo -e "  -F \"fileType=IMAGE\" \\"
echo -e "  -F \"description=Test image\"${NC}"
echo ""
echo -e "4. MinIO Console'da dosyaları kontrol edin: ${YELLOW}http://localhost:9001${NC}"

# Cleanup
echo -e "\n${BLUE}🧹 Test dosyaları temizleniyor...${NC}"
rm -f test-image.jpg test-document.pdf test-medical-record.pdf
echo -e "${GREEN}✅ Test tamamlandı!${NC}"