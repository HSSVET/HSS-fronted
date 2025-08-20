package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Medication Repository
 * Medication entity'si için veri erişim katmanı
 */
@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {

    /**
     * İlaç adına göre arama
     */
    Optional<Medication> findByMedicationName(String medicationName);

    /**
     * İlaç adının mevcut olup olmadığını kontrol etme
     */
    boolean existsByMedicationName(String medicationName);

    /**
     * İlaç adı ile arama (case insensitive)
     */
    @Query("SELECT m FROM Medication m WHERE LOWER(m.medicationName) LIKE LOWER(CONCAT('%', :medicationName, '%'))")
    List<Medication> searchByMedicationName(@Param("medicationName") String medicationName);

    /**
     * Aktif madde ile arama
     */
    @Query("SELECT m FROM Medication m WHERE LOWER(m.activeIngredient) LIKE LOWER(CONCAT('%', :activeIngredient, '%'))")
    List<Medication> searchByActiveIngredient(@Param("activeIngredient") String activeIngredient);

    /**
     * Kullanım alanına göre ilaçları listeleme
     */
    List<Medication> findByUsageArea(String usageArea);

    /**
     * Kullanım alanı ile arama (case insensitive)
     */
    @Query("SELECT m FROM Medication m WHERE LOWER(m.usageArea) LIKE LOWER(CONCAT('%', :usageArea, '%'))")
    List<Medication> searchByUsageArea(@Param("usageArea") String usageArea);

    /**
     * Uygulama yoluna göre ilaçları listeleme
     */
    List<Medication> findByApplicationRoute(String applicationRoute);

    /**
     * Uygulama yolu ile arama (case insensitive)
     */
    @Query("SELECT m FROM Medication m WHERE LOWER(m.applicationRoute) LIKE LOWER(CONCAT('%', :applicationRoute, '%'))")
    List<Medication> searchByApplicationRoute(@Param("applicationRoute") String applicationRoute);

    /**
     * Notlar ile arama
     */
    @Query("SELECT m FROM Medication m WHERE LOWER(m.notes) LIKE LOWER(CONCAT('%', :notes, '%'))")
    List<Medication> searchByNotes(@Param("notes") String notes);

    /**
     * Reçetesi bulunan ilaçları listeleme
     */
    @Query("SELECT DISTINCT m FROM Medication m WHERE SIZE(m.prescriptions) > 0")
    List<Medication> findMedicationsWithPrescriptions();

    /**
     * Reçetesi bulunmayan ilaçları listeleme
     */
    @Query("SELECT m FROM Medication m WHERE SIZE(m.prescriptions) = 0")
    List<Medication> findMedicationsWithoutPrescriptions();

    /**
     * Kullanım alanı istatistikleri
     */
    @Query("SELECT m.usageArea, COUNT(m) FROM Medication m GROUP BY m.usageArea ORDER BY COUNT(m) DESC")
    List<Object[]> getUsageAreaStatistics();

    /**
     * Uygulama yolu istatistikleri
     */
    @Query("SELECT m.applicationRoute, COUNT(m) FROM Medication m GROUP BY m.applicationRoute ORDER BY COUNT(m) DESC")
    List<Object[]> getApplicationRouteStatistics();

    /**
     * En çok reçete edilen ilaçlar
     */
    @Query("SELECT m, COUNT(p) FROM Medication m LEFT JOIN m.prescriptions p GROUP BY m ORDER BY COUNT(p) DESC")
    List<Object[]> getMostPrescribedMedications();

    /**
     * Belirli aktif maddeye sahip ilaçları listeleme
     */
    List<Medication> findByActiveIngredient(String activeIngredient);

    /**
     * İlaç adı alfabetik sırada
     */
    @Query("SELECT m FROM Medication m ORDER BY m.medicationName ASC")
    List<Medication> findAllOrderByMedicationNameAsc();

    /**
     * Notları olan ilaçları listeleme
     */
    @Query("SELECT m FROM Medication m WHERE m.notes IS NOT NULL AND m.notes != ''")
    List<Medication> findMedicationsWithNotes();

    /**
     * Notları olmayan ilaçları listeleme
     */
    @Query("SELECT m FROM Medication m WHERE m.notes IS NULL OR m.notes = ''")
    List<Medication> findMedicationsWithoutNotes();
} 