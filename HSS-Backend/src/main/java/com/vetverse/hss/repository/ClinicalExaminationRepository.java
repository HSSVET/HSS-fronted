package com.vetverse.hss.repository;

import com.vetverse.hss.entity.ClinicalExamination;
import com.vetverse.hss.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * ClinicalExamination Repository
 * ClinicalExamination entity'si için veri erişim katmanı
 */
@Repository
public interface ClinicalExaminationRepository extends JpaRepository<ClinicalExamination, Long> {

    /**
     * Hayvana göre klinik muayeneleri listeleme
     */
    List<ClinicalExamination> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre klinik muayeneleri listeleme
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.animal.id = :animalId ORDER BY ce.date DESC")
    List<ClinicalExamination> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Veteriner adına göre muayeneleri listeleme
     */
    List<ClinicalExamination> findByVeterinarianName(String veterinarianName);

    /**
     * Belirli tarih aralığındaki muayeneleri listeleme
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.date BETWEEN :startDate AND :endDate ORDER BY ce.date DESC")
    List<ClinicalExamination> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Bulgular ile arama
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE LOWER(ce.findings) LIKE LOWER(CONCAT('%', :findings, '%'))")
    List<ClinicalExamination> searchByFindings(@Param("findings") String findings);

    /**
     * Veteriner adı ile arama
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE LOWER(ce.veterinarianName) LIKE LOWER(CONCAT('%', :veterinarianName, '%'))")
    List<ClinicalExamination> searchByVeterinarianName(@Param("veterinarianName") String veterinarianName);

    /**
     * Hayvan adı ile muayene arama
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE LOWER(ce.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<ClinicalExamination> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile muayene arama
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE LOWER(CONCAT(ce.animal.owner.firstName, ' ', ce.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<ClinicalExamination> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Bugünkü muayeneleri listeleme
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.date = CURRENT_DATE ORDER BY ce.date DESC")
    List<ClinicalExamination> findTodayExaminations();

    /**
     * Son 7 günde yapılan muayeneler
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.date >= :sevenDaysAgo ORDER BY ce.date DESC")
    List<ClinicalExamination> findRecentExaminations(@Param("sevenDaysAgo") LocalDate sevenDaysAgo);

    /**
     * Belirli tür hayvanların muayeneleri
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.animal.species.id = :speciesId ORDER BY ce.date DESC")
    List<ClinicalExamination> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların muayeneleri
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.animal.breed.id = :breedId ORDER BY ce.date DESC")
    List<ClinicalExamination> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Veteriner bazında muayene istatistikleri
     */
    @Query("SELECT ce.veterinarianName, COUNT(ce) FROM ClinicalExamination ce GROUP BY ce.veterinarianName ORDER BY COUNT(ce) DESC")
    List<Object[]> getVeterinarianExaminationStatistics();

    /**
     * Sahip ID'sine göre tüm hayvanların muayeneleri
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.animal.owner.id = :ownerId ORDER BY ce.date DESC")
    List<ClinicalExamination> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Belirli tarihteki muayeneleri listeleme
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.date = :date ORDER BY ce.date")
    List<ClinicalExamination> findByDate(@Param("date") LocalDate date);

    /**
     * Veteriner ve tarih aralığına göre muayeneleri listeleme
     */
    @Query("SELECT ce FROM ClinicalExamination ce WHERE ce.veterinarianName = :veterinarianName AND ce.date BETWEEN :startDate AND :endDate ORDER BY ce.date DESC")
    List<ClinicalExamination> findByVeterinarianNameAndDateBetween(@Param("veterinarianName") String veterinarianName, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
} 