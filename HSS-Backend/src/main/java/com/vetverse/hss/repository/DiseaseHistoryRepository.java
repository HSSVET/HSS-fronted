package com.vetverse.hss.repository;

import com.vetverse.hss.entity.DiseaseHistory;
import com.vetverse.hss.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * DiseaseHistory Repository
 * DiseaseHistory entity'si için veri erişim katmanı
 */
@Repository
public interface DiseaseHistoryRepository extends JpaRepository<DiseaseHistory, Long> {

    /**
     * Hayvana göre hastalık geçmişini listeleme
     */
    List<DiseaseHistory> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre hastalık geçmişini listeleme
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE dh.animal.id = :animalId ORDER BY dh.date DESC")
    List<DiseaseHistory> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Hayvan ID'sine göre hastalık geçmişini tarih sırasına göre listeleme
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE dh.animal.id = :animalId ORDER BY dh.date ASC")
    List<DiseaseHistory> findByAnimalIdOrderByDateAsc(@Param("animalId") Long animalId);

    /**
     * Belirli tarih aralığındaki hastalık kayıtlarını listeleme
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE dh.date BETWEEN :startDate AND :endDate ORDER BY dh.date DESC")
    List<DiseaseHistory> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Tanı ile arama
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE LOWER(dh.diagnosis) LIKE LOWER(CONCAT('%', :diagnosis, '%'))")
    List<DiseaseHistory> searchByDiagnosis(@Param("diagnosis") String diagnosis);

    /**
     * Tedavi ile arama
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE LOWER(dh.treatment) LIKE LOWER(CONCAT('%', :treatment, '%'))")
    List<DiseaseHistory> searchByTreatment(@Param("treatment") String treatment);

    /**
     * Hayvan adı ile hastalık geçmişi arama
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE LOWER(dh.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<DiseaseHistory> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile hastalık geçmişi arama
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE LOWER(CONCAT(dh.animal.owner.firstName, ' ', dh.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<DiseaseHistory> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Son 30 günde eklenen hastalık kayıtları
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE dh.date >= :thirtyDaysAgo ORDER BY dh.date DESC")
    List<DiseaseHistory> findRecentDiseaseHistory(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Belirli tür hayvanların hastalık geçmişi
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE dh.animal.species.id = :speciesId ORDER BY dh.date DESC")
    List<DiseaseHistory> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların hastalık geçmişi
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE dh.animal.breed.id = :breedId ORDER BY dh.date DESC")
    List<DiseaseHistory> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Hastalık geçmişi istatistikleri için grup sayımı
     */
    @Query("SELECT dh.diagnosis, COUNT(dh) FROM DiseaseHistory dh GROUP BY dh.diagnosis ORDER BY COUNT(dh) DESC")
    List<Object[]> getDiagnosisStatistics();

    /**
     * Sahip ID'sine göre tüm hayvanların hastalık geçmişi
     */
    @Query("SELECT dh FROM DiseaseHistory dh WHERE dh.animal.owner.id = :ownerId ORDER BY dh.date DESC")
    List<DiseaseHistory> findByOwnerId(@Param("ownerId") Long ownerId);
} 