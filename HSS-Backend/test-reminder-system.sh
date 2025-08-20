#!/bin/bash

# Hatırlatma Sistemi Test Scripti
# Bu script oluşturduğumuz hatırlatma sistemini test eder

echo "🔔 Hatırlatma Sistemi Test Başlıyor..."
echo "=================================="

BASE_URL="http://localhost:8090/api/reminders"

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test helper function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}Test: $description${NC}"
    echo "Endpoint: $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$endpoint")
    elif [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "$data" "$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST "$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✅ Başarılı (HTTP $http_code)${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}❌ Başarısız (HTTP $http_code)${NC}"
        echo "Error: $body"
    fi
}

# 1. Sistem durumu kontrolü
test_endpoint "GET" "$BASE_URL/system-status" "" "Sistem Durumu Kontrolü"

# 2. Manuel hatırlatma oluşturma
test_endpoint "POST" "$BASE_URL/create" "appointmentId=1&channel=SMS&sendTime=2024-01-20T09:00:00" "Manuel SMS Hatırlatması Oluştur"

# 3. Manuel hatırlatma oluşturma (Email)
test_endpoint "POST" "$BASE_URL/create" "appointmentId=1&channel=EMAIL&sendTime=2024-01-20T09:00:00" "Manuel Email Hatırlatması Oluştur"

# 4. Test SMS gönderimi
test_endpoint "POST" "$BASE_URL/test" "channel=SMS&destination=05551234567" "SMS Test Gönderimi"

# 5. Test Email gönderimi
test_endpoint "POST" "$BASE_URL/test" "channel=EMAIL&destination=test@example.com" "Email Test Gönderimi"

# 6. Hatırlatmaları işle
test_endpoint "POST" "$BASE_URL/process" "" "Beklemedeki Hatırlatmaları İşle"

# 7. Randevu hatırlatmaları oluştur
test_endpoint "POST" "$BASE_URL/create-appointment-reminders" "" "Randevu Hatırlatmaları Oluştur"

# 8. Aşı hatırlatmaları oluştur
test_endpoint "POST" "$BASE_URL/create-vaccination-reminders" "" "Aşı Hatırlatmaları Oluştur"

# 9. Başarısız hatırlatmaları yeniden dene
test_endpoint "POST" "$BASE_URL/retry-failed" "" "Başarısız Hatırlatmaları Yeniden Dene"

echo -e "\n${GREEN}🎉 Test süreci tamamlandı!${NC}"
echo "=================================="
echo -e "${YELLOW}Notlar:${NC}"
echo "• Sistem şu anda geliştirme modunda olduğu için SMS/Email gerçekten gönderilmez"
echo "• Gerçek SMS/Email gönderimi için application.yml dosyasındaki ayarları etkinleştirin"
echo "• Test veriler ile çalışabilmek için önce veritabanında test randevuları oluşturun"
echo ""
echo -e "${YELLOW}Scheduled Tasks Kontrol:${NC}"
echo "• ReminderScheduler her 15 dakikada otomatik çalışacak"
echo "• Randevu oluşturulduğunda otomatik hatırlatma oluşturulacak"
echo "• Aşı hatırlatmaları günlük olarak kontrol edilecek"
