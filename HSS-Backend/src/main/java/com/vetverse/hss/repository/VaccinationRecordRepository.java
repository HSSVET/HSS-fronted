package com.vetverse.hss.repository;

import com.vetverse.hss.entity.VaccinationRecord;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * VaccinationRecord Repository
 * VaccinationRecord entity'si için veri erişim katmanı
 */
@Repository
public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecord, Long> {

    /**
     * Hayvana göre aşı kayıtlarını listeleme
     */
    List<VaccinationRecord> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre aşı kayıtlarını listeleme
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.animal.id = :animalId ORDER BY vr.date DESC")
    List<VaccinationRecord> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Aşıya göre kayıtları listeleme
     */
    List<VaccinationRecord> findByVaccine(Vaccine vaccine);

    /**
     * Aşı ID'sine göre kayıtları listeleme
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.vaccine.id = :vaccineId ORDER BY vr.date DESC")
    List<VaccinationRecord> findByVaccineId(@Param("vaccineId") Long vaccineId);

    /**
     * Aşı adına göre kayıtları listeleme
     */
    List<VaccinationRecord> findByVaccineName(String vaccineName);

    /**
     * Belirli tarih aralığındaki aşı kayıtlarını listeleme
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.date BETWEEN :startDate AND :endDate ORDER BY vr.date DESC")
    List<VaccinationRecord> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Tekrar bilgisi ile arama
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE LOWER(vr.repeat) LIKE LOWER(CONCAT('%', :repeat, '%'))")
    List<VaccinationRecord> searchByRepeat(@Param("repeat") String repeat);

    /**
     * Hayvan adı ile aşı kaydı arama
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE LOWER(vr.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<VaccinationRecord> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile aşı kaydı arama
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE LOWER(CONCAT(vr.animal.owner.firstName, ' ', vr.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<VaccinationRecord> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Aşı adı ile arama (case insensitive)
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE LOWER(vr.vaccineName) LIKE LOWER(CONCAT('%', :vaccineName, '%'))")
    List<VaccinationRecord> searchByVaccineName(@Param("vaccineName") String vaccineName);

    /**
     * Bugünkü aşı kayıtlarını listeleme
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.date = CURRENT_DATE ORDER BY vr.date")
    List<VaccinationRecord> findTodayVaccinations();

    /**
     * Son 30 günde yapılan aşılar
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.date >= :thirtyDaysAgo ORDER BY vr.date DESC")
    List<VaccinationRecord> findRecentVaccinations(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Belirli tür hayvanların aşı kayıtları
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.animal.species.id = :speciesId ORDER BY vr.date DESC")
    List<VaccinationRecord> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların aşı kayıtları
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.animal.breed.id = :breedId ORDER BY vr.date DESC")
    List<VaccinationRecord> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Sahip ID'sine göre tüm hayvanların aşı kayıtları
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.animal.owner.id = :ownerId ORDER BY vr.date DESC")
    List<VaccinationRecord> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Aşı türü istatistikleri
     */
    @Query("SELECT vr.vaccineName, COUNT(vr) FROM VaccinationRecord vr GROUP BY vr.vaccineName ORDER BY COUNT(vr) DESC")
    List<Object[]> getVaccinationStatistics();

    /**
     * Hayvan ve aşı kombinasyonu ile kayıtları bulma
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.animal.id = :animalId AND vr.vaccine.id = :vaccineId ORDER BY vr.date DESC")
    List<VaccinationRecord> findByAnimalIdAndVaccineId(@Param("animalId") Long animalId, @Param("vaccineId") Long vaccineId);

    /**
     * Son aşı tarihi bilgisi
     */
    @Query("SELECT MAX(vr.date) FROM VaccinationRecord vr WHERE vr.animal.id = :animalId")
    LocalDate findLastVaccinationDateByAnimalId(@Param("animalId") Long animalId);

    /**
     * Tekrar bilgisi olan aşı kayıtları
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.repeat IS NOT NULL AND vr.repeat != ''")
    List<VaccinationRecord> findVaccinationsWithRepeat();

    /**
     * Belirli tarihteki aşı kayıtlarını listeleme
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.date = :date ORDER BY vr.vaccineName")
    List<VaccinationRecord> findByDate(@Param("date") LocalDate date);

    /**
     * Aşı tipine göre son aşı kayıtlarını getir (hatırlatma sistemı için)
     */
    @Query("SELECT vr FROM VaccinationRecord vr WHERE LOWER(vr.repeat) LIKE LOWER(CONCAT('%', :vaccinationType, '%')) ORDER BY vr.date DESC")
    List<VaccinationRecord> findLastVaccinationsByType(@Param("vaccinationType") String vaccinationType);
} 