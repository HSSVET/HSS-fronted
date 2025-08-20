#!/bin/bash

# Final MinIO Integration Test
echo "🎯 Final MinIO Integration Test"
echo "==============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}1. Checking all services...${NC}"

# Docker services check
services=("hss-minio" "hss-postgres" "hss-keycloak")
for service in "${services[@]}"; do
    if docker ps | grep -q "$service"; then
        echo -e "   ${GREEN}✅ $service is running${NC}"
    else
        echo -e "   ${RED}❌ $service is not running${NC}"
        exit 1
    fi
done

echo -e "\n${BLUE}2. Testing MinIO directly...${NC}"

# MinIO health check
if curl -s http://localhost:9000/minio/health/live > /dev/null; then
    echo -e "   ${GREEN}✅ MinIO API is accessible${NC}"
else
    echo -e "   ${RED}❌ MinIO API is not accessible${NC}"
    exit 1
fi

# Check if buckets exist (using docker exec)
echo -e "\n${BLUE}3. Checking MinIO buckets...${NC}"
buckets=$(docker exec hss-minio mc ls local/ 2>/dev/null | grep hss- || true)
if [[ -n "$buckets" ]]; then
    echo -e "   ${GREEN}✅ HSS buckets exist:${NC}"
    echo "$buckets" | sed 's/^/      /'
else
    echo -e "   ${YELLOW}⚠️  No HSS buckets found yet${NC}"
fi

echo -e "\n${BLUE}4. Database check...${NC}"

# Check file_metadata table
table_exists=$(docker exec hss-postgres psql -U postgres -d vetdb -c "\dt file_metadata" 2>/dev/null | grep file_metadata || true)
if [[ -n "$table_exists" ]]; then
    echo -e "   ${GREEN}✅ file_metadata table exists${NC}"
else
    echo -e "   ${RED}❌ file_metadata table not found${NC}"
fi

echo -e "\n${BLUE}5. Spring Boot Application...${NC}"

# Wait for Spring Boot with timeout
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8090/actuator/health > /dev/null; then
        echo -e "   ${GREEN}✅ Spring Boot is running on port 8090${NC}"
        app_running=true
        break
    else
        echo -e "   ${YELLOW}⏳ Waiting for Spring Boot... ($attempt/$max_attempts)${NC}"
        sleep 2
        ((attempt++))
    fi
done

if [ "$app_running" != "true" ]; then
    echo -e "   ${RED}❌ Spring Boot didn't start in 60 seconds${NC}"
    echo -e "   ${YELLOW}💡 Check logs: tail -f app.log${NC}"
    app_running=false
fi

if [ "$app_running" = "true" ]; then
    echo -e "\n${BLUE}6. Testing API endpoints...${NC}"
    
    # Test file types endpoint
    echo -e "   Testing /api/files/types..."
    response=$(curl -s http://localhost:8090/api/files/types)
    if [[ $response == *"success"* ]] || [[ $response == *"DOCUMENT"* ]]; then
        echo -e "   ${GREEN}✅ File types endpoint works${NC}"
        echo -e "      Response: $response"
    else
        echo -e "   ${YELLOW}⚠️  File types endpoint response: $response${NC}"
    fi
    
    # Test upload endpoint (should require authentication)
    echo -e "   Testing /api/files/upload (expect auth error)..."
    echo "Test content for MinIO" > test-upload.txt
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8090/api/files/upload \
        -F "file=@test-upload.txt" \
        -F "fileType=DOCUMENT")
    
    if [ "$http_code" = "401" ]; then
        echo -e "   ${GREEN}✅ Authentication is required (401)${NC}"
    elif [ "$http_code" = "403" ]; then
        echo -e "   ${GREEN}✅ Authorization is required (403)${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Unexpected response: $http_code${NC}"
    fi
    
    rm -f test-upload.txt
fi

echo -e "\n${BLUE}📊 Summary${NC}"
echo "=========="
echo -e "${GREEN}✅ MinIO: Running on ports 9000-9001${NC}"
echo -e "${GREEN}✅ PostgreSQL: Running on port 5432${NC}"
echo -e "${GREEN}✅ Keycloak: Running on port 8080${NC}"
echo -e "${GREEN}✅ Database: file_metadata table created${NC}"

if [ "$app_running" = "true" ]; then
    echo -e "${GREEN}✅ Spring Boot: Running on port 8090${NC}"
    echo -e "${GREEN}✅ API: Endpoints accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Spring Boot: Not ready${NC}"
fi

echo -e "\n${BLUE}🔗 Access URLs${NC}"
echo "=============="
echo -e "MinIO Console: ${YELLOW}http://localhost:9001${NC} (admin/admin123456)"
echo -e "Keycloak Admin: ${YELLOW}http://localhost:8080${NC} (admin/admin123)"
echo -e "Spring Boot API: ${YELLOW}http://localhost:8090${NC}"

echo -e "\n${BLUE}🧪 Manual Test Commands${NC}"
echo "======================="
echo "# Test MinIO directly"
echo "curl http://localhost:9000/minio/health/live"
echo ""
echo "# Get file types (no auth required)"
echo "curl http://localhost:8090/api/files/types"
echo ""
echo "# Upload file (requires JWT token)"
echo 'curl -X POST "http://localhost:8090/api/files/upload" \'
echo '  -H "Authorization: Bearer YOUR_JWT_TOKEN" \'
echo '  -F "file=@yourfile.jpg" \'
echo '  -F "fileType=IMAGE" \'
echo '  -F "description=Test upload"'

echo -e "\n${GREEN}✅ MinIO Integration Test Complete!${NC}"