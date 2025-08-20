#!/bin/bash

# Medical Document File Upload Service API Test Script
# This script tests all the endpoints of the enhanced file upload service

set -e

# Configuration
BASE_URL="http://localhost:8090/api/files"
TOKEN="your-jwt-token-here"  # Replace with actual JWT token
TEST_FILES_DIR="./test-files"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_response() {
    local response="$1"
    local expected_status="$2"
    local test_name="$3"
    
    local status=$(echo "$response" | jq -r '.success // false')
    
    if [ "$status" = "true" ] || [ "$expected_status" = "false" ]; then
        log_success "$test_name"
        return 0
    else
        log_error "$test_name failed"
        echo "$response" | jq '.'
        return 1
    fi
}

create_test_files() {
    log_info "Creating test files..."
    
    mkdir -p "$TEST_FILES_DIR"
    
    # Create a test PDF
    echo "This is a test medical document content" > "$TEST_FILES_DIR/medical_record.txt"
    
    # Create a test image (simple text file representing image)
    echo "FAKE_IMAGE_DATA_FOR_TESTING" > "$TEST_FILES_DIR/xray_image.jpg"
    
    # Create multiple test files for batch upload
    for i in {1..3}; do
        echo "Blood test result $i: Hemoglobin: 12.$i g/dL" > "$TEST_FILES_DIR/blood_test_$i.txt"
    done
    
    log_success "Test files created in $TEST_FILES_DIR"
}

cleanup_test_files() {
    log_info "Cleaning up test files..."
    rm -rf "$TEST_FILES_DIR"
    log_success "Test files cleaned up"
}

# Test functions
test_basic_upload() {
    log_info "Testing basic file upload..."
    
    local response=$(curl -s -X POST "$BASE_URL/upload" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$TEST_FILES_DIR/medical_record.txt" \
        -F "fileType=MEDICAL_RECORD" \
        -F "description=Test medical record upload")
    
    check_response "$response" "true" "Basic file upload"
    
    # Extract file ID for later tests
    UPLOADED_FILE_ID=$(echo "$response" | jq -r '.data.id // empty')
    if [ -n "$UPLOADED_FILE_ID" ]; then
        log_info "Uploaded file ID: $UPLOADED_FILE_ID"
    fi
}

test_medical_document_upload() {
    log_info "Testing enhanced medical document upload..."
    
    local response=$(curl -s -X POST "$BASE_URL/upload/medical-document" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$TEST_FILES_DIR/xray_image.jpg" \
        -F "fileType=X_RAY" \
        -F "description=Test chest X-ray" \
        -F "tags=chest" \
        -F "tags=xray" \
        -F "tags=routine" \
        -F "isConfidential=false" \
        -F "animalId=123")
    
    check_response "$response" "true" "Enhanced medical document upload"
    
    # Extract file ID for later tests
    MEDICAL_FILE_ID=$(echo "$response" | jq -r '.data.id // empty')
    if [ -n "$MEDICAL_FILE_ID" ]; then
        log_info "Medical document ID: $MEDICAL_FILE_ID"
    fi
}

test_batch_upload() {
    log_info "Testing batch upload..."
    
    local response=$(curl -s -X POST "$BASE_URL/upload/medical-documents/batch" \
        -H "Authorization: Bearer $TOKEN" \
        -F "files=@$TEST_FILES_DIR/blood_test_1.txt" \
        -F "files=@$TEST_FILES_DIR/blood_test_2.txt" \
        -F "files=@$TEST_FILES_DIR/blood_test_3.txt" \
        -F "fileType=BLOOD_TEST" \
        -F "description=Batch blood test upload" \
        -F "animalId=123")
    
    check_response "$response" "true" "Batch upload"
    
    # Extract first file ID from batch
    BATCH_FILE_ID=$(echo "$response" | jq -r '.data[0].id // empty')
    if [ -n "$BATCH_FILE_ID" ]; then
        log_info "First batch file ID: $BATCH_FILE_ID"
    fi
}

test_animal_file_upload() {
    log_info "Testing animal-specific file upload..."
    
    local response=$(curl -s -X POST "$BASE_URL/upload/animal/123" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$TEST_FILES_DIR/medical_record.txt" \
        -F "fileType=VACCINATION_RECORD" \
        -F "description=Vaccination record for animal 123")
    
    check_response "$response" "true" "Animal-specific file upload"
}

test_appointment_file_upload() {
    log_info "Testing appointment-specific file upload..."
    
    local response=$(curl -s -X POST "$BASE_URL/upload/appointment/456" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$TEST_FILES_DIR/medical_record.txt" \
        -F "fileType=REPORT" \
        -F "description=Appointment report for appointment 456")
    
    check_response "$response" "true" "Appointment-specific file upload"
}

test_file_listing() {
    log_info "Testing file listing..."
    
    # Test animal files listing
    local response=$(curl -s -X GET "$BASE_URL/animal/123" \
        -H "Authorization: Bearer $TOKEN")
    
    check_response "$response" "true" "Animal files listing"
    
    # Test appointment files listing
    response=$(curl -s -X GET "$BASE_URL/appointment/456" \
        -H "Authorization: Bearer $TOKEN")
    
    check_response "$response" "true" "Appointment files listing"
}

test_document_search() {
    log_info "Testing document search..."
    
    # Basic search
    local response=$(curl -s -X GET "$BASE_URL/medical-documents/search?query=test&page=0&size=10" \
        -H "Authorization: Bearer $TOKEN")
    
    check_response "$response" "true" "Basic document search"
    
    # Advanced search with filters
    response=$(curl -s -X GET "$BASE_URL/medical-documents/search?fileType=BLOOD_TEST&animalId=123&page=0&size=5" \
        -H "Authorization: Bearer $TOKEN")
    
    check_response "$response" "true" "Advanced document search with filters"
    
    # Search with date range
    local today=$(date +%Y-%m-%d)
    response=$(curl -s -X GET "$BASE_URL/medical-documents/search?dateFrom=$today&dateTo=$today" \
        -H "Authorization: Bearer $TOKEN")
    
    check_response "$response" "true" "Document search with date range"
}

test_download_functionality() {
    log_info "Testing download functionality..."
    
    if [ -n "$UPLOADED_FILE_ID" ]; then
        # Test direct download
        local http_status=$(curl -s -o /dev/null -w "%{http_code}" \
            -X GET "$BASE_URL/download/$UPLOADED_FILE_ID" \
            -H "Authorization: Bearer $TOKEN")
        
        if [ "$http_status" = "200" ]; then
            log_success "Direct file download"
        else
            log_error "Direct file download failed (HTTP $http_status)"
        fi
        
        # Test presigned URL
        local response=$(curl -s -X GET "$BASE_URL/download-url/$UPLOADED_FILE_ID?expiredHours=1" \
            -H "Authorization: Bearer $TOKEN")
        
        check_response "$response" "true" "Presigned URL generation"
    else
        log_warning "Skipping download tests - no uploaded file ID available"
    fi
}

test_versioning() {
    log_info "Testing document versioning..."
    
    if [ -n "$UPLOADED_FILE_ID" ]; then
        # Upload new version
        local response=$(curl -s -X POST "$BASE_URL/$UPLOADED_FILE_ID/new-version" \
            -H "Authorization: Bearer $TOKEN" \
            -F "file=@$TEST_FILES_DIR/medical_record.txt" \
            -F "versionNotes=Updated version with additional information")
        
        check_response "$response" "true" "New version upload"
        
        # Get version history
        response=$(curl -s -X GET "$BASE_URL/$UPLOADED_FILE_ID/versions" \
            -H "Authorization: Bearer $TOKEN")
        
        check_response "$response" "true" "Version history retrieval"
    else
        log_warning "Skipping versioning tests - no uploaded file ID available"
    fi
}

test_ocr_processing() {
    log_info "Testing OCR processing..."
    
    if [ -n "$UPLOADED_FILE_ID" ]; then
        local response=$(curl -s -X POST "$BASE_URL/$UPLOADED_FILE_ID/ocr" \
            -H "Authorization: Bearer $TOKEN")
        
        check_response "$response" "true" "OCR processing"
    else
        log_warning "Skipping OCR test - no uploaded file ID available"
    fi
}

test_security_status() {
    log_info "Testing security status..."
    
    if [ -n "$UPLOADED_FILE_ID" ]; then
        local response=$(curl -s -X GET "$BASE_URL/$UPLOADED_FILE_ID/security-status" \
            -H "Authorization: Bearer $TOKEN")
        
        check_response "$response" "true" "Security status check"
    else
        log_warning "Skipping security status test - no uploaded file ID available"
    fi
}

test_file_management() {
    log_info "Testing file management..."
    
    # Get supported file types
    local response=$(curl -s -X GET "$BASE_URL/types" \
        -H "Authorization: Bearer $TOKEN")
    
    check_response "$response" "true" "Get supported file types"
    
    # Test soft delete (if we have a file to delete)
    if [ -n "$BATCH_FILE_ID" ]; then
        response=$(curl -s -X DELETE "$BASE_URL/$BATCH_FILE_ID" \
            -H "Authorization: Bearer $TOKEN")
        
        check_response "$response" "true" "Soft delete file"
    else
        log_warning "Skipping delete test - no file ID available for deletion"
    fi
}

test_error_handling() {
    log_info "Testing error handling..."
    
    # Test upload without file
    local response=$(curl -s -X POST "$BASE_URL/upload" \
        -H "Authorization: Bearer $TOKEN" \
        -F "fileType=DOCUMENT" \
        -F "description=Test without file")
    
    if echo "$response" | jq -r '.success' | grep -q "false"; then
        log_success "Error handling - upload without file"
    else
        log_error "Error handling failed - should reject upload without file"
    fi
    
    # Test download non-existent file
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" \
        -X GET "$BASE_URL/download/99999" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$http_status" = "404" ]; then
        log_success "Error handling - download non-existent file"
    else
        log_error "Error handling failed - should return 404 for non-existent file"
    fi
    
    # Test search with invalid parameters
    response=$(curl -s -X GET "$BASE_URL/medical-documents/search?page=-1&size=0" \
        -H "Authorization: Bearer $TOKEN")
    
    # Should still work but with corrected parameters
    check_response "$response" "true" "Error handling - invalid search parameters"
}

test_performance() {
    log_info "Testing performance with multiple concurrent uploads..."
    
    # Create multiple background upload processes
    for i in {1..5}; do
        (
            curl -s -X POST "$BASE_URL/upload" \
                -H "Authorization: Bearer $TOKEN" \
                -F "file=@$TEST_FILES_DIR/medical_record.txt" \
                -F "fileType=DOCUMENT" \
                -F "description=Performance test upload $i" \
                > /dev/null
        ) &
    done
    
    # Wait for all background processes to complete
    wait
    
    log_success "Performance test - concurrent uploads completed"
}

# Main test execution
main() {
    log_info "Starting Medical Document File Upload Service API Tests"
    log_info "=================================================="
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Please install jq to run these tests."
        exit 1
    fi
    
    # Check if curl is installed
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed. Please install curl to run these tests."
        exit 1
    fi
    
    # Validate token
    if [ "$TOKEN" = "your-jwt-token-here" ]; then
        log_warning "Please update the TOKEN variable with a valid JWT token"
        log_info "You can obtain a token by logging into the application"
    fi
    
    # Create test files
    create_test_files
    
    # Run tests
    local test_count=0
    local passed_count=0
    
    run_test() {
        local test_name="$1"
        local test_function="$2"
        
        test_count=$((test_count + 1))
        log_info "Running test $test_count: $test_name"
        
        if $test_function; then
            passed_count=$((passed_count + 1))
        fi
        
        echo ""
    }
    
    # Execute all tests
    run_test "Basic Upload" test_basic_upload
    run_test "Medical Document Upload" test_medical_document_upload
    run_test "Batch Upload" test_batch_upload
    run_test "Animal File Upload" test_animal_file_upload
    run_test "Appointment File Upload" test_appointment_file_upload
    run_test "File Listing" test_file_listing
    run_test "Document Search" test_document_search
    run_test "Download Functionality" test_download_functionality
    run_test "Document Versioning" test_versioning
    run_test "OCR Processing" test_ocr_processing
    run_test "Security Status" test_security_status
    run_test "File Management" test_file_management
    run_test "Error Handling" test_error_handling
    run_test "Performance" test_performance
    
    # Cleanup
    cleanup_test_files
    
    # Summary
    log_info "=================================================="
    log_info "Test Summary:"
    log_info "Total tests: $test_count"
    log_success "Passed: $passed_count"
    
    if [ $passed_count -lt $test_count ]; then
        local failed_count=$((test_count - passed_count))
        log_error "Failed: $failed_count"
        exit 1
    else
        log_success "All tests passed!"
        exit 0
    fi
}

# Run main function
main "$@"