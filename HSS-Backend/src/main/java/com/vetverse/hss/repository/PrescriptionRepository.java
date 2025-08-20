package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Prescription;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Prescription Repository
 * Prescription entity'si için veri erişim katmanı
 */
@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    /**
     * Hayvana göre reçeteleri listeleme
     */
    List<Prescription> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre reçeteleri listeleme
     */
    @Query("SELECT p FROM Prescription p WHERE p.animal.id = :animalId ORDER BY p.date DESC")
    List<Prescription> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * İlaca göre reçeteleri listeleme
     */
    List<Prescription> findByMedication(Medication medication);

    /**
     * İlaç ID'sine göre reçeteleri listeleme
     */
    @Query("SELECT p FROM Prescription p WHERE p.medication.id = :medicationId ORDER BY p.date DESC")
    List<Prescription> findByMedicationId(@Param("medicationId") Long medicationId);

    /**
     * Belirli tarih aralığındaki reçeteleri listeleme
     */
    @Query("SELECT p FROM Prescription p WHERE p.date BETWEEN :startDate AND :endDate ORDER BY p.date DESC")
    List<Prescription> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * İlaçlar metni ile arama
     */
    @Query("SELECT p FROM Prescription p WHERE LOWER(p.medications) LIKE LOWER(CONCAT('%', :medications, '%'))")
    List<Prescription> searchByMedications(@Param("medications") String medications);

    /**
     * Dozaj ile arama
     */
    @Query("SELECT p FROM Prescription p WHERE LOWER(p.dosage) LIKE LOWER(CONCAT('%', :dosage, '%'))")
    List<Prescription> searchByDosage(@Param("dosage") String dosage);

    /**
     * Hayvan adı ile reçete arama
     */
    @Query("SELECT p FROM Prescription p WHERE LOWER(p.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<Prescription> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile reçete arama
     */
    @Query("SELECT p FROM Prescription p WHERE LOWER(CONCAT(p.animal.owner.firstName, ' ', p.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<Prescription> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * İlaç adı ile reçete arama
     */
    @Query("SELECT p FROM Prescription p WHERE LOWER(p.medication.medicationName) LIKE LOWER(CONCAT('%', :medicationName, '%'))")
    List<Prescription> searchByMedicationName(@Param("medicationName") String medicationName);

    /**
     * Bugünkü reçeteleri listeleme
     */
    @Query("SELECT p FROM Prescription p WHERE p.date = CURRENT_DATE ORDER BY p.date")
    List<Prescription> findTodayPrescriptions();

    /**
     * Son 30 günde yazılan reçeteler
     */
    @Query("SELECT p FROM Prescription p WHERE p.date >= :thirtyDaysAgo ORDER BY p.date DESC")
    List<Prescription> findRecentPrescriptions(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Belirli tür hayvanların reçeteleri
     */
    @Query("SELECT p FROM Prescription p WHERE p.animal.species.id = :speciesId ORDER BY p.date DESC")
    List<Prescription> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların reçeteleri
     */
    @Query("SELECT p FROM Prescription p WHERE p.animal.breed.id = :breedId ORDER BY p.date DESC")
    List<Prescription> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Sahip ID'sine göre tüm hayvanların reçeteleri
     */
    @Query("SELECT p FROM Prescription p WHERE p.animal.owner.id = :ownerId ORDER BY p.date DESC")
    List<Prescription> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Belirli tarihteki reçeteleri listeleme
     */
    @Query("SELECT p FROM Prescription p WHERE p.date = :date ORDER BY p.medication.medicationName")
    List<Prescription> findByDate(@Param("date") LocalDate date);

    /**
     * İlaç kullanım istatistikleri
     */
    @Query("SELECT p.medication.medicationName, COUNT(p) FROM Prescription p GROUP BY p.medication.medicationName ORDER BY COUNT(p) DESC")
    List<Object[]> getMedicationUsageStatistics();

    /**
     * Hayvan ve ilaç kombinasyonu ile reçeteleri bulma
     */
    @Query("SELECT p FROM Prescription p WHERE p.animal.id = :animalId AND p.medication.id = :medicationId ORDER BY p.date DESC")
    List<Prescription> findByAnimalIdAndMedicationId(@Param("animalId") Long animalId, @Param("medicationId") Long medicationId);

    /**
     * Son reçete tarihi bilgisi
     */
    @Query("SELECT MAX(p.date) FROM Prescription p WHERE p.animal.id = :animalId")
    LocalDate findLastPrescriptionDateByAnimalId(@Param("animalId") Long animalId);

    /**
     * İlaç ve tarih aralığına göre reçeteleri listeleme
     */
    @Query("SELECT p FROM Prescription p WHERE p.medication.id = :medicationId AND p.date BETWEEN :startDate AND :endDate ORDER BY p.date DESC")
    List<Prescription> findByMedicationIdAndDateBetween(@Param("medicationId") Long medicationId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
} 