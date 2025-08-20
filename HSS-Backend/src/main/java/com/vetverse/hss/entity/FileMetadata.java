package com.vetverse.hss.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Dosya metadata bilgilerini tutan entity sınıfı
 * MinIO'da saklanan dosyaların veritabanında izlenmesi için kullanılır
 */
@Entity
@Table(name = "file_metadata")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "bucket_name", nullable = false)
    private String bucketName;

    @Column(name = "object_name", nullable = false)
    private String objectName;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", nullable = false)
    private FileType fileType;

    @Column(name = "description")
    private String description;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    // İlişkili entity ID'leri - hangi kayıt ile ilişkili olduğunu belirtir
    @Column(name = "animal_id")
    private Long animalId;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // Medikal döküman özel alanları
    @Column(name = "is_confidential")
    @Builder.Default
    private Boolean isConfidential = false;

    @Column(name = "tags")
    private String tags; // JSON format: ["tag1", "tag2", "tag3"]

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "parent_file_id")
    private Long parentFileId; // Versiyonlama için

    @Column(name = "version_number")
    @Builder.Default
    private Integer versionNumber = 1;

    @Column(name = "version_notes")
    private String versionNotes;

    @Column(name = "security_scan_status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SecurityScanStatus securityScanStatus = SecurityScanStatus.PENDING;

    @Column(name = "security_scan_date")
    private LocalDateTime securityScanDate;

    @Column(name = "ocr_processed")
    @Builder.Default
    private Boolean ocrProcessed = false;

    @Column(name = "ocr_text", columnDefinition = "TEXT")
    private String ocrText;

    @Column(name = "access_level")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AccessLevel accessLevel = AccessLevel.NORMAL;

    @Column(name = "checksum")
    private String checksum; // Dosya bütünlüğü kontrolü için

    @Column(name = "deleted_by")
    private String deletedBy;

    @Column(name = "deleted_date")
    private LocalDateTime deletedDate;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    /**
     * Dosya türlerini belirten enum
     */
    public enum FileType {
        DOCUMENT,           // Belgeler
        IMAGE,              // Resimler
        MEDICAL_RECORD,     // Tıbbi kayıtlar
        REPORT,             // Raporlar
        X_RAY,              // Röntgen
        BLOOD_TEST,         // Kan tahlili
        VACCINATION_RECORD, // Aşı kayıtları
        OTHER               // Diğer
    }

    /**
     * Güvenlik tarama durumu enum
     */
    public enum SecurityScanStatus {
        PENDING,    // Tarama bekliyor
        SCANNING,   // Taranıyor
        CLEAN,      // Temiz
        INFECTED,   // Virüslü
        FAILED      // Tarama başarısız
    }

    /**
     * Erişim seviyesi enum
     */
    public enum AccessLevel {
        PUBLIC,     // Herkese açık
        NORMAL,     // Normal erişim
        RESTRICTED, // Kısıtlı erişim
        CONFIDENTIAL // Gizli
    }
}