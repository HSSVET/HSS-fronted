#!/bin/bash

# Quick MinIO Integration Test
echo "🚀 Quick MinIO Test"
echo "=================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create test files
echo "Creating test files..."
echo "Test image content" > test.jpg
echo "Test document content" > test-document.pdf

# Check Docker services
echo -e "\n${BLUE}Checking Docker services...${NC}"

if docker ps | grep -q "hss-minio"; then
    echo -e "${GREEN}✅ MinIO is running${NC}"
else
    echo -e "${RED}❌ MinIO is not running${NC}"
    echo "Run: docker-compose up -d"
    exit 1
fi

if docker ps | grep -q "hss-postgres"; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
fi

if docker ps | grep -q "hss-keycloak"; then
    echo -e "${GREEN}✅ Keycloak is running${NC}"
else
    echo -e "${RED}❌ Keycloak is not running${NC}"
fi

# Test MinIO directly (without authentication)
echo -e "\n${BLUE}Testing MinIO health...${NC}"
if curl -s http://localhost:9000/minio/health/live > /dev/null; then
    echo -e "${GREEN}✅ MinIO API is accessible${NC}"
else
    echo -e "${RED}❌ MinIO API is not accessible${NC}"
fi

# Check if Spring Boot is running
echo -e "\n${BLUE}Checking Spring Boot application...${NC}"
if curl -s http://localhost:8090/actuator/health > /dev/null; then
    echo -e "${GREEN}✅ Spring Boot is running${NC}"
    
    # Test API endpoints
    echo -e "\n${BLUE}Testing API endpoints...${NC}"
    
    # Test file types endpoint (no auth required)
    echo "Testing /api/files/types..."
    RESPONSE=$(curl -s http://localhost:8090/api/files/types)
    if [[ $RESPONSE == *"success"* ]]; then
        echo -e "${GREEN}✅ File types endpoint works${NC}"
    else
        echo -e "${RED}❌ File types endpoint failed${NC}"
        echo "Response: $RESPONSE"
    fi
    
    # Test upload endpoint (should return 401 without token)
    echo "Testing /api/files/upload (expect 401)..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8090/api/files/upload \
        -F "file=@test.jpg" \
        -F "fileType=IMAGE")
    
    if [ "$HTTP_CODE" = "401" ]; then
        echo -e "${GREEN}✅ Authentication is working (401 returned)${NC}"
    else
        echo -e "${YELLOW}⚠️  Unexpected HTTP code: $HTTP_CODE${NC}"
    fi
    
else
    echo -e "${YELLOW}⚠️  Spring Boot is not ready yet${NC}"
    echo "Wait a few more seconds and try again, or check logs:"
    echo "tail -f app.log"
fi

# MinIO Console info
echo -e "\n${BLUE}MinIO Console Access:${NC}"
echo -e "URL: ${YELLOW}http://localhost:9001${NC}"
echo -e "Username: ${YELLOW}admin${NC}"
echo -e "Password: ${YELLOW}admin123456${NC}"

# Clean up
rm -f test.jpg test-document.pdf

echo -e "\n${GREEN}✅ Quick test completed!${NC}"
echo -e "\n${YELLOW}To test file upload with authentication:${NC}"
echo "1. Get a JWT token from Keycloak"
echo "2. Use the test-minio-api.sh script"
echo "3. Or manually test with curl using your JWT token"