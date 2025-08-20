package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Vaccine Repository
 * Vaccine entity'si için veri erişim katmanı
 */
@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {

    /**
     * Aşı adına göre arama
     */
    Optional<Vaccine> findByVaccineName(String vaccineName);

    /**
     * Aşı adının mevcut olup olmadığını kontrol etme
     */
    boolean existsByVaccineName(String vaccineName);

    /**
     * Aşı adı ile arama (case insensitive)
     */
    @Query("SELECT v FROM Vaccine v WHERE LOWER(v.vaccineName) LIKE LOWER(CONCAT('%', :vaccineName, '%'))")
    List<Vaccine> searchByVaccineName(@Param("vaccineName") String vaccineName);

    /**
     * Uygulama yoluna göre aşıları listeleme
     */
    List<Vaccine> findByApplicationRoute(String applicationRoute);

    /**
     * Uygulama yolu ile arama (case insensitive)
     */
    @Query("SELECT v FROM Vaccine v WHERE LOWER(v.applicationRoute) LIKE LOWER(CONCAT('%', :applicationRoute, '%'))")
    List<Vaccine> searchByApplicationRoute(@Param("applicationRoute") String applicationRoute);

    /**
     * Notlar ile arama
     */
    @Query("SELECT v FROM Vaccine v WHERE LOWER(v.notes) LIKE LOWER(CONCAT('%', :notes, '%'))")
    List<Vaccine> searchByNotes(@Param("notes") String notes);

    /**
     * Aşı kayıtları bulunan aşıları listeleme
     */
    @Query("SELECT DISTINCT v FROM Vaccine v WHERE SIZE(v.vaccinationRecords) > 0")
    List<Vaccine> findVaccinesWithRecords();

    /**
     * Aşı kayıtları bulunmayan aşıları listeleme
     */
    @Query("SELECT v FROM Vaccine v WHERE SIZE(v.vaccinationRecords) = 0")
    List<Vaccine> findVaccinesWithoutRecords();

    /**
     * Uygulama yolu istatistikleri
     */
    @Query("SELECT v.applicationRoute, COUNT(v) FROM Vaccine v GROUP BY v.applicationRoute ORDER BY COUNT(v) DESC")
    List<Object[]> getApplicationRouteStatistics();

    /**
     * En çok uygulanan aşılar
     */
    @Query("SELECT v, COUNT(vr) FROM Vaccine v LEFT JOIN v.vaccinationRecords vr GROUP BY v ORDER BY COUNT(vr) DESC")
    List<Object[]> getMostAppliedVaccines();

    /**
     * Aşı adı alfabetik sırada
     */
    @Query("SELECT v FROM Vaccine v ORDER BY v.vaccineName ASC")
    List<Vaccine> findAllOrderByVaccineNameAsc();

    /**
     * Notları olan aşıları listeleme
     */
    @Query("SELECT v FROM Vaccine v WHERE v.notes IS NOT NULL AND v.notes != ''")
    List<Vaccine> findVaccinesWithNotes();

    /**
     * Notları olmayan aşıları listeleme
     */
    @Query("SELECT v FROM Vaccine v WHERE v.notes IS NULL OR v.notes = ''")
    List<Vaccine> findVaccinesWithoutNotes();

    /**
     * Koruma süresi olan aşıları listeleme
     */
    @Query("SELECT v FROM Vaccine v WHERE v.protectionDuration IS NOT NULL")
    List<Vaccine> findVaccinesWithProtectionDuration();

    /**
     * Koruma süresi olmayan aşıları listeleme
     */
    @Query("SELECT v FROM Vaccine v WHERE v.protectionDuration IS NULL")
    List<Vaccine> findVaccinesWithoutProtectionDuration();
} 