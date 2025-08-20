package com.vetverse.hss.repository;

import com.vetverse.hss.entity.LabResult;
import com.vetverse.hss.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * LabResult Repository
 * LabResult entity'si için veri erişim katmanı
 */
@Repository
public interface LabResultRepository extends JpaRepository<LabResult, Long> {

    /**
     * Lab testine göre sonuçları listeleme
     */
    List<LabResult> findByLabTest(LabTest labTest);

    /**
     * Lab test ID'sine göre sonuçları listeleme
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.labTest.id = :labTestId ORDER BY lr.id")
    List<LabResult> findByLabTestId(@Param("labTestId") Long labTestId);

    /**
     * Sonuç değeri ile arama
     */
    @Query("SELECT lr FROM LabResult lr WHERE LOWER(lr.result) LIKE LOWER(CONCAT('%', :result, '%'))")
    List<LabResult> searchByResult(@Param("result") String result);

    /**
     * Değer ile arama
     */
    @Query("SELECT lr FROM LabResult lr WHERE LOWER(lr.value) LIKE LOWER(CONCAT('%', :value, '%'))")
    List<LabResult> searchByValue(@Param("value") String value);

    /**
     * Birim ile arama
     */
    @Query("SELECT lr FROM LabResult lr WHERE LOWER(lr.unit) LIKE LOWER(CONCAT('%', :unit, '%'))")
    List<LabResult> searchByUnit(@Param("unit") String unit);

    /**
     * Hayvan ID'sine göre tüm lab sonuçları
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.labTest.animal.id = :animalId ORDER BY lr.labTest.date DESC")
    List<LabResult> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Test adına göre sonuçları listeleme
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.labTest.testName = :testName ORDER BY lr.labTest.date DESC")
    List<LabResult> findByTestName(@Param("testName") String testName);

    /**
     * Hayvan ve test adına göre sonuçları listeleme
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.labTest.animal.id = :animalId AND lr.labTest.testName = :testName ORDER BY lr.labTest.date DESC")
    List<LabResult> findByAnimalIdAndTestName(@Param("animalId") Long animalId, @Param("testName") String testName);

    /**
     * Sahip ID'sine göre tüm hayvanların lab sonuçları
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.labTest.animal.owner.id = :ownerId ORDER BY lr.labTest.date DESC")
    List<LabResult> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Belirli tür hayvanların lab sonuçları
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.labTest.animal.species.id = :speciesId ORDER BY lr.labTest.date DESC")
    List<LabResult> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların lab sonuçları
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.labTest.animal.breed.id = :breedId ORDER BY lr.labTest.date DESC")
    List<LabResult> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Test türü ve sonuç istatistikleri
     */
    @Query("SELECT lr.labTest.testName, lr.result, COUNT(lr) FROM LabResult lr GROUP BY lr.labTest.testName, lr.result ORDER BY lr.labTest.testName, COUNT(lr) DESC")
    List<Object[]> getTestResultStatistics();

    /**
     * Anormal sonuçlar (belirli anahtar kelimeler içeren)
     */
    @Query("SELECT lr FROM LabResult lr WHERE LOWER(lr.result) LIKE '%anormal%' OR LOWER(lr.result) LIKE '%yüksek%' OR LOWER(lr.result) LIKE '%düşük%' OR LOWER(lr.result) LIKE '%pozitif%' ORDER BY lr.labTest.date DESC")
    List<LabResult> findAbnormalResults();

    /**
     * Normal sonuçlar
     */
    @Query("SELECT lr FROM LabResult lr WHERE LOWER(lr.result) LIKE '%normal%' OR LOWER(lr.result) LIKE '%negatif%' ORDER BY lr.labTest.date DESC")
    List<LabResult> findNormalResults();

    /**
     * Boş olmayan değere sahip sonuçlar
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.value IS NOT NULL AND lr.value != '' ORDER BY lr.labTest.date DESC")
    List<LabResult> findResultsWithValues();

    /**
     * Belirli birim türüne sahip sonuçlar
     */
    @Query("SELECT lr FROM LabResult lr WHERE lr.unit = :unit ORDER BY lr.labTest.date DESC")
    List<LabResult> findByUnit(@Param("unit") String unit);
} 