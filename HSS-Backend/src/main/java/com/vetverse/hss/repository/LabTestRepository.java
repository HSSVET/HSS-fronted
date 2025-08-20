package com.vetverse.hss.repository;

import com.vetverse.hss.entity.LabTest;
import com.vetverse.hss.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * LabTest Repository
 * LabTest entity'si için veri erişim katmanı
 */
@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    /**
     * Hayvana göre laboratuvar testlerini listeleme
     */
    List<LabTest> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre laboratuvar testlerini listeleme
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.animal.id = :animalId ORDER BY lt.date DESC")
    List<LabTest> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Test adına göre arama
     */
    List<LabTest> findByTestName(String testName);

    /**
     * Test adı ile arama (case insensitive)
     */
    @Query("SELECT lt FROM LabTest lt WHERE LOWER(lt.testName) LIKE LOWER(CONCAT('%', :testName, '%'))")
    List<LabTest> searchByTestName(@Param("testName") String testName);

    /**
     * Belirli tarih aralığındaki testleri listeleme
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.date BETWEEN :startDate AND :endDate ORDER BY lt.date DESC")
    List<LabTest> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Hayvan adı ile test arama
     */
    @Query("SELECT lt FROM LabTest lt WHERE LOWER(lt.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<LabTest> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile test arama
     */
    @Query("SELECT lt FROM LabTest lt WHERE LOWER(CONCAT(lt.animal.owner.firstName, ' ', lt.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<LabTest> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Bugünkü testleri listeleme
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.date = CURRENT_DATE ORDER BY lt.date")
    List<LabTest> findTodayTests();

    /**
     * Bekleyen testler (sonucu olmayan)
     */
    @Query("SELECT lt FROM LabTest lt WHERE SIZE(lt.labResults) = 0 ORDER BY lt.date ASC")
    List<LabTest> findPendingTests();

    /**
     * Tamamlanan testler (sonucu olan)
     */
    @Query("SELECT lt FROM LabTest lt WHERE SIZE(lt.labResults) > 0 ORDER BY lt.date DESC")
    List<LabTest> findCompletedTests();

    /**
     * Son 30 günde yapılan testler
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.date >= :thirtyDaysAgo ORDER BY lt.date DESC")
    List<LabTest> findRecentTests(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Belirli tür hayvanların testleri
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.animal.species.id = :speciesId ORDER BY lt.date DESC")
    List<LabTest> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların testleri
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.animal.breed.id = :breedId ORDER BY lt.date DESC")
    List<LabTest> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Test türü istatistikleri
     */
    @Query("SELECT lt.testName, COUNT(lt) FROM LabTest lt GROUP BY lt.testName ORDER BY COUNT(lt) DESC")
    List<Object[]> getTestTypeStatistics();

    /**
     * Sahip ID'sine göre tüm hayvanların testleri
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.animal.owner.id = :ownerId ORDER BY lt.date DESC")
    List<LabTest> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Belirli tarihteki testleri listeleme
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.date = :date ORDER BY lt.testName")
    List<LabTest> findByDate(@Param("date") LocalDate date);

    /**
     * Test adı ve tarih aralığına göre testleri listeleme
     */
    @Query("SELECT lt FROM LabTest lt WHERE lt.testName = :testName AND lt.date BETWEEN :startDate AND :endDate ORDER BY lt.date DESC")
    List<LabTest> findByTestNameAndDateBetween(@Param("testName") String testName, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
} 