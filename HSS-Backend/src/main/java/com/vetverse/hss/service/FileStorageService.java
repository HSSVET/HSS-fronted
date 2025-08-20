package com.vetverse.hss.service;

import com.vetverse.hss.config.MinioConfig;
import com.vetverse.hss.entity.FileMetadata;
import com.vetverse.hss.repository.FileMetadataRepository;
import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * MinIO dosya depolama hizmetleri
 * Dosya yükleme, indirme, silme ve listeleme işlemlerini yönetir
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {

    private final MinioClient minioClient;
    private final FileMetadataRepository fileMetadataRepository;
    private final MinioConfig.MinioProperties minioProperties;

    /**
     * Dosya yükler ve metadata'sını kaydeder
     */
    public FileMetadata uploadFile(MultipartFile file, FileMetadata.FileType fileType, 
                                  String description, String uploadedBy) {
        try {
            validateFile(file);
            
            String bucketName = getBucketNameByFileType(fileType);
            String objectName = generateObjectName(file.getOriginalFilename());
            
            // Bucket'ın varlığını kontrol et ve oluştur
            ensureBucketExists(bucketName);
            
            // Dosyayı MinIO'ya yükle
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );
            
            // Metadata'yı veritabanına kaydet
            FileMetadata metadata = FileMetadata.builder()
                .fileName(objectName)
                .originalName(file.getOriginalFilename())
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .bucketName(bucketName)
                .objectName(objectName)
                .fileType(fileType)
                .description(description)
                .uploadedBy(uploadedBy)
                .uploadDate(LocalDateTime.now())
                .isActive(true)
                .build();
            
            metadata = fileMetadataRepository.save(metadata);
            log.info("Dosya başarıyla yüklendi: {} (Bucket: {}, Object: {})", 
                    file.getOriginalFilename(), bucketName, objectName);
            
            return metadata;
            
        } catch (Exception e) {
            log.error("Dosya yükleme hatası: {}", e.getMessage(), e);
            throw new RuntimeException("Dosya yükleme başarısız: " + e.getMessage(), e);
        }
    }

    /**
     * Hayvan ile ilişkili dosya yükler
     */
    public FileMetadata uploadAnimalFile(MultipartFile file, FileMetadata.FileType fileType, 
                                        Long animalId, String description, String uploadedBy) {
        FileMetadata metadata = uploadFile(file, fileType, description, uploadedBy);
        metadata.setAnimalId(animalId);
        return fileMetadataRepository.save(metadata);
    }

    /**
     * Randevu ile ilişkili dosya yükler
     */
    public FileMetadata uploadAppointmentFile(MultipartFile file, FileMetadata.FileType fileType, 
                                            Long appointmentId, String description, String uploadedBy) {
        FileMetadata metadata = uploadFile(file, fileType, description, uploadedBy);
        metadata.setAppointmentId(appointmentId);
        return fileMetadataRepository.save(metadata);
    }

    /**
     * Dosya indirir
     */
    public InputStream downloadFile(Long fileId) {
        try {
            Optional<FileMetadata> metadataOpt = fileMetadataRepository.findById(fileId);
            if (metadataOpt.isEmpty() || !metadataOpt.get().getIsActive()) {
                throw new RuntimeException("Dosya bulunamadı: " + fileId);
            }
            
            FileMetadata metadata = metadataOpt.get();
            
            return minioClient.getObject(
                GetObjectArgs.builder()
                    .bucket(metadata.getBucketName())
                    .object(metadata.getObjectName())
                    .build()
            );
            
        } catch (Exception e) {
            log.error("Dosya indirme hatası: {}", e.getMessage(), e);
            throw new RuntimeException("Dosya indirme başarısız: " + e.getMessage(), e);
        }
    }

    /**
     * Dosya için presigned URL oluşturur (geçici indirme linki)
     */
    public String getPresignedDownloadUrl(Long fileId, int expiredHours) {
        try {
            Optional<FileMetadata> metadataOpt = fileMetadataRepository.findById(fileId);
            if (metadataOpt.isEmpty() || !metadataOpt.get().getIsActive()) {
                throw new RuntimeException("Dosya bulunamadı: " + fileId);
            }
            
            FileMetadata metadata = metadataOpt.get();
            
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(metadata.getBucketName())
                    .object(metadata.getObjectName())
                    .expiry(expiredHours, TimeUnit.HOURS)
                    .build()
            );
            
        } catch (Exception e) {
            log.error("Presigned URL oluşturma hatası: {}", e.getMessage(), e);
            throw new RuntimeException("URL oluşturma başarısız: " + e.getMessage(), e);
        }
    }

    /**
     * Dosyayı siler (soft delete)
     */
    public void deleteFile(Long fileId, String deletedBy) {
        Optional<FileMetadata> metadataOpt = fileMetadataRepository.findById(fileId);
        if (metadataOpt.isEmpty()) {
            throw new RuntimeException("Dosya bulunamadı: " + fileId);
        }
        
        FileMetadata metadata = metadataOpt.get();
        metadata.setIsActive(false);
        metadata.setUpdatedDate(LocalDateTime.now());
        fileMetadataRepository.save(metadata);
        
        log.info("Dosya silindi (soft delete): {} (ID: {})", metadata.getOriginalName(), fileId);
    }

    /**
     * Dosyayı kalıcı olarak siler
     */
    public void permanentDeleteFile(Long fileId) {
        try {
            Optional<FileMetadata> metadataOpt = fileMetadataRepository.findById(fileId);
            if (metadataOpt.isEmpty()) {
                throw new RuntimeException("Dosya bulunamadı: " + fileId);
            }
            
            FileMetadata metadata = metadataOpt.get();
            
            // MinIO'dan sil
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(metadata.getBucketName())
                    .object(metadata.getObjectName())
                    .build()
            );
            
            // Veritabanından sil
            fileMetadataRepository.delete(metadata);
            
            log.info("Dosya kalıcı olarak silindi: {} (ID: {})", metadata.getOriginalName(), fileId);
            
        } catch (Exception e) {
            log.error("Dosya silme hatası: {}", e.getMessage(), e);
            throw new RuntimeException("Dosya silme başarısız: " + e.getMessage(), e);
        }
    }

    /**
     * Hayvan dosyalarını listeler
     */
    public List<FileMetadata> getAnimalFiles(Long animalId) {
        return fileMetadataRepository.findByAnimalId(animalId).stream()
                .filter(FileMetadata::getIsActive)
                .sorted((a, b) -> b.getUploadDate().compareTo(a.getUploadDate()))
                .toList();
    }

    /**
     * Randevu dosyalarını listeler
     */
    public List<FileMetadata> getAppointmentFiles(Long appointmentId) {
        return fileMetadataRepository.findAll().stream()
                .filter(f -> appointmentId.equals(f.getAppointmentId()))
                .filter(FileMetadata::getIsActive)
                .sorted((a, b) -> b.getUploadDate().compareTo(a.getUploadDate()))
                .toList();
    }

    /**
     * Dosya türüne göre bucket adını döndürür
     */
    private String getBucketNameByFileType(FileMetadata.FileType fileType) {
        return switch (fileType) {
            case IMAGE, X_RAY -> minioProperties.getBuckets().get("images");
            case MEDICAL_RECORD, BLOOD_TEST, VACCINATION_RECORD -> 
                minioProperties.getBuckets().get("medical-records");
            case REPORT -> minioProperties.getBuckets().get("reports");
            default -> minioProperties.getBuckets().get("documents");
        };
    }

    /**
     * Dosya adı için benzersiz object name oluşturur
     */
    private String generateObjectName(String originalFilename) {
        String extension = FilenameUtils.getExtension(originalFilename);
        String fileName = FilenameUtils.getBaseName(originalFilename);
        return String.format("%s_%s_%s.%s", 
                fileName, 
                UUID.randomUUID().toString().substring(0, 8),
                System.currentTimeMillis(),
                extension);
    }

    /**
     * Dosyayı doğrular
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş olamaz");
        }
        
        if (file.getSize() > parseFileSize(minioProperties.getMaxFileSize())) {
            throw new IllegalArgumentException("Dosya boyutu çok büyük. Maksimum: " + 
                    minioProperties.getMaxFileSize());
        }
    }

    /**
     * Bucket'ın var olduğundan emin olur
     */
    private void ensureBucketExists(String bucketName) throws Exception {
        boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            log.info("Bucket oluşturuldu: {}", bucketName);
        }
    }

    /**
     * Dosya boyutu string'ini byte'a çevirir
     */
    private long parseFileSize(String size) {
        size = size.toUpperCase().replace(" ", "");
        long multiplier = 1;
        
        if (size.endsWith("KB")) {
            multiplier = 1024;
            size = size.substring(0, size.length() - 2);
        } else if (size.endsWith("MB")) {
            multiplier = 1024 * 1024;
            size = size.substring(0, size.length() - 2);
        } else if (size.endsWith("GB")) {
            multiplier = 1024 * 1024 * 1024;
            size = size.substring(0, size.length() - 2);
        }
        
        return Long.parseLong(size) * multiplier;
    }
}