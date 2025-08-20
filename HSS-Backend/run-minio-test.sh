#!/bin/bash

# Simple MinIO test runner
echo "🚀 Starting MinIO Test Application"
echo "================================="

# Kill any existing Spring Boot processes
pkill -f spring-boot:run 2>/dev/null || true

# Set environment variables for minimal setup
export SPRING_PROFILES_ACTIVE=minio-test
export SPRING_JPA_HIBERNATE_DDL_AUTO=none
export SPRING_JPA_SHOW_SQL=false
export LOGGING_LEVEL_COM_VETVERSE_HSS=INFO

# Start the application with minimal configuration
echo "Starting application..."
nohup java -jar target/hss-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=minio-test \
  --spring.jpa.hibernate.ddl-auto=none \
  --spring.jpa.show-sql=false \
  --spring.main.allow-bean-definition-overriding=true \
  --spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration \
  > minio-test.log 2>&1 &

PID=$!
echo "Application started with PID: $PID"

# Wait for startup
echo "Waiting for application to start..."
for i in {1..30}; do
    if curl -s http://localhost:8090/actuator/health > /dev/null 2>&1; then
        echo "✅ Application is running!"
        break
    fi
    echo "⏳ Waiting... ($i/30)"
    sleep 2
done

# Test the endpoints
echo "Testing MinIO endpoints..."

echo "1. Testing file types:"
curl -s http://localhost:8090/api/files/types | head -100

echo -e "\n2. Testing upload (expect 401/403):"
echo "Test content" > test-upload.txt
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:8090/api/files/upload \
  -F "file=@test-upload.txt" \
  -F "fileType=DOCUMENT")
echo "HTTP Code: $HTTP_CODE"
rm -f test-upload.txt

echo -e "\n3. Application logs:"
tail -20 minio-test.log

echo -e "\n✅ MinIO test completed!"
echo "Check logs: tail -f minio-test.log"