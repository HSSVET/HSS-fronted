package com.vetverse.hss.controller;

import com.vetverse.hss.entity.FileMetadata;
import com.vetverse.hss.service.FileStorageService;
import com.vetverse.hss.service.MedicalDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

/**
 * Dosya yönetimi REST API Controller'ı
 * Dosya yükleme, indirme, listeleme ve silme işlemleri
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileController {

    private final FileStorageService fileStorageService;
    private final MedicalDocumentService medicalDocumentService;

    /**
     * Genel dosya yükleme
     * POST /api/files/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileType") FileMetadata.FileType fileType,
            @RequestParam(value = "description", required = false) String description,
            @AuthenticationPrincipal Jwt jwt) {
        
        try {
            String uploadedBy = jwt.getClaimAsString("preferred_username");
            
            FileMetadata metadata = fileStorageService.uploadFile(file, fileType, description, uploadedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Dosya başarıyla yüklendi",
                "data", metadata
            ));
            
        } catch (Exception e) {
            log.error("Dosya yükleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Dosya yükleme başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Hayvan ile ilgili dosya yükleme
     * POST /api/files/upload/animal/{animalId}
     */
    @PostMapping("/upload/animal/{animalId}")
    public ResponseEntity<?> uploadAnimalFile(
            @PathVariable Long animalId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileType") FileMetadata.FileType fileType,
            @RequestParam(value = "description", required = false) String description,
            @AuthenticationPrincipal Jwt jwt) {
        
        try {
            String uploadedBy = jwt.getClaimAsString("preferred_username");
            
            FileMetadata metadata = fileStorageService.uploadAnimalFile(
                file, fileType, animalId, description, uploadedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Hayvan dosyası başarıyla yüklendi",
                "data", metadata
            ));
            
        } catch (Exception e) {
            log.error("Hayvan dosyası yükleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Dosya yükleme başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Randevu ile ilgili dosya yükleme
     * POST /api/files/upload/appointment/{appointmentId}
     */
    @PostMapping("/upload/appointment/{appointmentId}")
    public ResponseEntity<?> uploadAppointmentFile(
            @PathVariable Long appointmentId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileType") FileMetadata.FileType fileType,
            @RequestParam(value = "description", required = false) String description,
            @AuthenticationPrincipal Jwt jwt) {
        
        try {
            String uploadedBy = jwt.getClaimAsString("preferred_username");
            
            FileMetadata metadata = fileStorageService.uploadAppointmentFile(
                file, fileType, appointmentId, description, uploadedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Randevu dosyası başarıyla yüklendi",
                "data", metadata
            ));
            
        } catch (Exception e) {
            log.error("Randevu dosyası yükleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Dosya yükleme başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Dosya indirme
     * GET /api/files/download/{fileId}
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<?> downloadFile(@PathVariable Long fileId) {
        try {
            InputStream fileStream = fileStorageService.downloadFile(fileId);
            
            // Dosya metadata'sını al
            // Bu durumda service'den metadata'yı da almamız gerekiyor
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"file\"")
                .body(new InputStreamResource(fileStream));
                
        } catch (Exception e) {
            log.error("Dosya indirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "message", "Dosya bulunamadı: " + e.getMessage()
                ));
        }
    }

    /**
     * Presigned URL ile dosya indirme linki oluşturma
     * GET /api/files/download-url/{fileId}
     */
    @GetMapping("/download-url/{fileId}")
    public ResponseEntity<?> getDownloadUrl(
            @PathVariable Long fileId,
            @RequestParam(value = "expiredHours", defaultValue = "24") int expiredHours) {
        
        try {
            String downloadUrl = fileStorageService.getPresignedDownloadUrl(fileId, expiredHours);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "downloadUrl", downloadUrl,
                "expiredHours", expiredHours
            ));
            
        } catch (Exception e) {
            log.error("Download URL oluşturma hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "message", "URL oluşturulamadı: " + e.getMessage()
                ));
        }
    }

    /**
     * Hayvan dosyalarını listeleme
     * GET /api/files/animal/{animalId}
     */
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<?> getAnimalFiles(@PathVariable Long animalId) {
        try {
            List<FileMetadata> files = fileStorageService.getAnimalFiles(animalId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", files,
                "count", files.size()
            ));
            
        } catch (Exception e) {
            log.error("Hayvan dosyaları listeleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Dosyalar listelenemedi: " + e.getMessage()
                ));
        }
    }

    /**
     * Randevu dosyalarını listeleme
     * GET /api/files/appointment/{appointmentId}
     */
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getAppointmentFiles(@PathVariable Long appointmentId) {
        try {
            List<FileMetadata> files = fileStorageService.getAppointmentFiles(appointmentId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", files,
                "count", files.size()
            ));
            
        } catch (Exception e) {
            log.error("Randevu dosyaları listeleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Dosyalar listelenemedi: " + e.getMessage()
                ));
        }
    }

    /**
     * Dosya silme (soft delete)
     * DELETE /api/files/{fileId}
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal Jwt jwt) {
        
        try {
            String deletedBy = jwt.getClaimAsString("preferred_username");
            fileStorageService.deleteFile(fileId, deletedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Dosya başarıyla silindi"
            ));
            
        } catch (Exception e) {
            log.error("Dosya silme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "message", "Dosya silinemedi: " + e.getMessage()
                ));
        }
    }

    /**
     * Dosya kalıcı silme (admin yetkisi gerekir)
     * DELETE /api/files/{fileId}/permanent
     */
    @DeleteMapping("/{fileId}/permanent")
    public ResponseEntity<?> permanentDeleteFile(@PathVariable Long fileId) {
        try {
            fileStorageService.permanentDeleteFile(fileId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Dosya kalıcı olarak silindi"
            ));
            
        } catch (Exception e) {
            log.error("Dosya kalıcı silme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "message", "Dosya silinemedi: " + e.getMessage()
                ));
        }
    }

    /**
     * Desteklenen dosya türlerini listeleme
     * GET /api/files/types
     */
    @GetMapping("/types")
    public ResponseEntity<?> getFileTypes() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", FileMetadata.FileType.values()
        ));
    }

    // ========== MEDİKAL DÖKÜMAN ÖZELLİKLERİ ==========

    /**
     * Medikal döküman yükleme (gelişmiş özelliklerle)
     * POST /api/files/upload/medical-document
     */
    @PostMapping("/upload/medical-document")
    public ResponseEntity<?> uploadMedicalDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileType") FileMetadata.FileType fileType,
            @RequestParam(value = "animalId", required = false) Long animalId,
            @RequestParam(value = "appointmentId", required = false) Long appointmentId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "tags", required = false) String[] tags,
            @RequestParam(value = "isConfidential", defaultValue = "false") boolean isConfidential,
            @RequestParam(value = "expiryDate", required = false) String expiryDate,
            @AuthenticationPrincipal Jwt jwt) {
        
        try {
            String uploadedBy = jwt.getClaimAsString("preferred_username");
            
            // Medikal döküman validasyonu
            medicalDocumentService.validateMedicalDocument(file, fileType);
            
            // Gelişmiş yükleme
            FileMetadata metadata = medicalDocumentService.uploadMedicalDocument(
                file, fileType, animalId, appointmentId, description, 
                tags, isConfidential, expiryDate, uploadedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Medikal döküman başarıyla yüklendi",
                "data", metadata,
                "documentAnalysis", medicalDocumentService.analyzeDocument(metadata)
            ));
            
        } catch (Exception e) {
            log.error("Medikal döküman yükleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Medikal döküman yükleme başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Toplu medikal döküman yükleme
     * POST /api/files/upload/medical-documents/batch
     */
    @PostMapping("/upload/medical-documents/batch")
    public ResponseEntity<?> uploadMedicalDocumentsBatch(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("fileType") FileMetadata.FileType fileType,
            @RequestParam(value = "animalId", required = false) Long animalId,
            @RequestParam(value = "appointmentId", required = false) Long appointmentId,
            @RequestParam(value = "description", required = false) String description,
            @AuthenticationPrincipal Jwt jwt) {
        
        try {
            String uploadedBy = jwt.getClaimAsString("preferred_username");
            
            List<FileMetadata> uploadedFiles = medicalDocumentService.uploadMedicalDocumentsBatch(
                Arrays.asList(files), fileType, animalId, appointmentId, description, uploadedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", files.length + " dosya başarıyla yüklendi",
                "data", uploadedFiles,
                "count", uploadedFiles.size()
            ));
            
        } catch (Exception e) {
            log.error("Toplu medikal döküman yükleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Toplu yükleme başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Medikal döküman arama
     * GET /api/files/medical-documents/search
     */
    @GetMapping("/medical-documents/search")
    public ResponseEntity<?> searchMedicalDocuments(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "fileType", required = false) FileMetadata.FileType fileType,
            @RequestParam(value = "animalId", required = false) Long animalId,
            @RequestParam(value = "appointmentId", required = false) Long appointmentId,
            @RequestParam(value = "dateFrom", required = false) String dateFrom,
            @RequestParam(value = "dateTo", required = false) String dateTo,
            @RequestParam(value = "tags", required = false) String[] tags,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        try {
            Map<String, Object> searchResults = medicalDocumentService.searchMedicalDocuments(
                query, fileType, animalId, appointmentId, dateFrom, dateTo, tags, page, size);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", searchResults
            ));
            
        } catch (Exception e) {
            log.error("Medikal döküman arama hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Arama başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Medikal döküman versiyonlama
     * POST /api/files/{fileId}/new-version
     */
    @PostMapping("/{fileId}/new-version")
    public ResponseEntity<?> uploadNewVersion(
            @PathVariable Long fileId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "versionNotes", required = false) String versionNotes,
            @AuthenticationPrincipal Jwt jwt) {
        
        try {
            String uploadedBy = jwt.getClaimAsString("preferred_username");
            
            FileMetadata newVersion = medicalDocumentService.uploadNewVersion(
                fileId, file, versionNotes, uploadedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Yeni versiyon başarıyla yüklendi",
                "data", newVersion
            ));
            
        } catch (Exception e) {
            log.error("Versiyon yükleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "Versiyon yükleme başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Döküman versiyonlarını listeleme
     * GET /api/files/{fileId}/versions
     */
    @GetMapping("/{fileId}/versions")
    public ResponseEntity<?> getDocumentVersions(@PathVariable Long fileId) {
        try {
            List<FileMetadata> versions = medicalDocumentService.getDocumentVersions(fileId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", versions,
                "count", versions.size()
            ));
            
        } catch (Exception e) {
            log.error("Versiyon listeleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "message", "Versiyonlar listelenemedi: " + e.getMessage()
                ));
        }
    }

    /**
     * Döküman OCR işlemi
     * POST /api/files/{fileId}/ocr
     */
    @PostMapping("/{fileId}/ocr")
    public ResponseEntity<?> performOCR(@PathVariable Long fileId) {
        try {
            Map<String, Object> ocrResult = medicalDocumentService.performOCR(fileId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", ocrResult
            ));
            
        } catch (Exception e) {
            log.error("OCR işlemi hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "OCR işlemi başarısız: " + e.getMessage()
                ));
        }
    }

    /**
     * Döküman güvenlik durumu kontrolü
     * GET /api/files/{fileId}/security-status
     */
    @GetMapping("/{fileId}/security-status")
    public ResponseEntity<?> getDocumentSecurityStatus(@PathVariable Long fileId) {
        try {
            Map<String, Object> securityStatus = medicalDocumentService.getDocumentSecurityStatus(fileId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", securityStatus
            ));
            
        } catch (Exception e) {
            log.error("Güvenlik durumu kontrolü hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "success", false,
                    "message", "Güvenlik durumu kontrol edilemedi: " + e.getMessage()
                ));
        }
    }
}