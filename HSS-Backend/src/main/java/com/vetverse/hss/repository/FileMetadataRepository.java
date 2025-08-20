package com.vetverse.hss.repository;

import com.vetverse.hss.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * FileMetadata entity için minimal repository
 */
@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {

    /**
     * Dosya adına göre bulur
     */
    Optional<FileMetadata> findByFileName(String fileName);

    /**
     * Aktif olan dosyaları bulur
     */
    List<FileMetadata> findByIsActiveTrue();

    /**
     * Hayvan ID'sine göre dosyaları bulur
     */
    List<FileMetadata> findByAnimalId(Long animalId);
}