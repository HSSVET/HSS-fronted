package com.vetverse.hss.dto;

import com.vetverse.hss.entity.FileMetadata;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Dosya yükleme response DTO'su
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponse {
    
    private Long id;
    private String fileName;
    private String originalName;
    private Long fileSize;
    private String contentType;
    private String bucketName;
    private FileMetadata.FileType fileType;
    private String description;
    private String uploadedBy;
    private LocalDateTime uploadDate;
    private Long animalId;
    private Long appointmentId;
    private Long ownerId;
    
    /**
     * FileMetadata entity'sinden DTO oluşturur
     */
    public static FileUploadResponse from(FileMetadata metadata) {
        return FileUploadResponse.builder()
            .id(metadata.getId())
            .fileName(metadata.getFileName())
            .originalName(metadata.getOriginalName())
            .fileSize(metadata.getFileSize())
            .contentType(metadata.getContentType())
            .bucketName(metadata.getBucketName())
            .fileType(metadata.getFileType())
            .description(metadata.getDescription())
            .uploadedBy(metadata.getUploadedBy())
            .uploadDate(metadata.getUploadDate())
            .animalId(metadata.getAnimalId())
            .appointmentId(metadata.getAppointmentId())
            .ownerId(metadata.getOwnerId())
            .build();
    }
}