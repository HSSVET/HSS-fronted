package com.vetverse.hss.repository;

import com.vetverse.hss.entity.PathologyFinding;
import com.vetverse.hss.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * PathologyFinding Repository
 * PathologyFinding entity'si için veri erişim katmanı
 */
@Repository
public interface PathologyFindingRepository extends JpaRepository<PathologyFinding, Long> {

    /**
     * Hayvana göre patoloji bulgularını listeleme
     */
    List<PathologyFinding> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre patoloji bulgularını listeleme
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.animal.id = :animalId ORDER BY pf.date DESC")
    List<PathologyFinding> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Rapor içeriği ile arama
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE LOWER(pf.report) LIKE LOWER(CONCAT('%', :report, '%'))")
    List<PathologyFinding> searchByReport(@Param("report") String report);

    /**
     * Belirli tarih aralığındaki patoloji bulgularını listeleme
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.date BETWEEN :startDate AND :endDate ORDER BY pf.date DESC")
    List<PathologyFinding> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Hayvan adı ile patoloji bulgusu arama
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE LOWER(pf.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<PathologyFinding> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile patoloji bulgusu arama
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE LOWER(CONCAT(pf.animal.owner.firstName, ' ', pf.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<PathologyFinding> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Bugünkü patoloji bulgularını listeleme
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.date = CURRENT_DATE ORDER BY pf.date")
    List<PathologyFinding> findTodayFindings();

    /**
     * Son 30 günde yapılan patoloji bulguları
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.date >= :thirtyDaysAgo ORDER BY pf.date DESC")
    List<PathologyFinding> findRecentFindings(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Son 7 günde yapılan patoloji bulguları
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.date >= :sevenDaysAgo ORDER BY pf.date DESC")
    List<PathologyFinding> findWeeklyRecentFindings(@Param("sevenDaysAgo") LocalDate sevenDaysAgo);

    /**
     * Belirli tarihteki patoloji bulgularını listeleme
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.date = :date ORDER BY pf.date")
    List<PathologyFinding> findByDate(@Param("date") LocalDate date);

    /**
     * Belirli tür hayvanların patoloji bulguları
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.animal.species.id = :speciesId ORDER BY pf.date DESC")
    List<PathologyFinding> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların patoloji bulguları
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.animal.breed.id = :breedId ORDER BY pf.date DESC")
    List<PathologyFinding> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Sahip ID'sine göre tüm hayvanların patoloji bulguları
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.animal.owner.id = :ownerId ORDER BY pf.date DESC")
    List<PathologyFinding> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Boş rapor içerikli bulgular
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.report IS NULL OR pf.report = ''")
    List<PathologyFinding> findEmptyReports();

    /**
     * Raporu olan bulgular
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE pf.report IS NOT NULL AND pf.report != ''")
    List<PathologyFinding> findFindingsWithReport();

    /**
     * Anormal bulgular (belirli anahtar kelimeler içeren)
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE LOWER(pf.report) LIKE '%anormal%' OR LOWER(pf.report) LIKE '%patolojik%' OR LOWER(pf.report) LIKE '%malign%' OR LOWER(pf.report) LIKE '%tümör%' ORDER BY pf.date DESC")
    List<PathologyFinding> findAbnormalFindings();

    /**
     * Normal bulgular
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE LOWER(pf.report) LIKE '%normal%' OR LOWER(pf.report) LIKE '%benign%' ORDER BY pf.date DESC")
    List<PathologyFinding> findNormalFindings();

    /**
     * Bu ayki patoloji bulguları
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE EXTRACT(YEAR FROM pf.date) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM pf.date) = EXTRACT(MONTH FROM CURRENT_DATE) ORDER BY pf.date DESC")
    List<PathologyFinding> findCurrentMonthFindings();

    /**
     * Bu yılki patoloji bulguları
     */
    @Query("SELECT pf FROM PathologyFinding pf WHERE EXTRACT(YEAR FROM pf.date) = EXTRACT(YEAR FROM CURRENT_DATE) ORDER BY pf.date DESC")
    List<PathologyFinding> findCurrentYearFindings();

    /**
     * Günlük patoloji istatistikleri
     */
    @Query("SELECT pf.date, COUNT(pf) FROM PathologyFinding pf GROUP BY pf.date ORDER BY pf.date DESC")
    List<Object[]> getDailyPathologyStatistics();

    /**
     * Aylık patoloji istatistikleri
     */
    @Query("SELECT EXTRACT(YEAR FROM pf.date), EXTRACT(MONTH FROM pf.date), COUNT(pf) FROM PathologyFinding pf GROUP BY EXTRACT(YEAR FROM pf.date), EXTRACT(MONTH FROM pf.date) ORDER BY EXTRACT(YEAR FROM pf.date) DESC, EXTRACT(MONTH FROM pf.date) DESC")
    List<Object[]> getMonthlyPathologyStatistics();

    /**
     * Tür bazında patoloji istatistikleri
     */
    @Query("SELECT pf.animal.species.name, COUNT(pf) FROM PathologyFinding pf GROUP BY pf.animal.species.name ORDER BY COUNT(pf) DESC")
    List<Object[]> getSpeciesPathologyStatistics();

    /**
     * Rapor anahtar kelimesi istatistikleri
     */
    @Query("SELECT " +
           "SUM(CASE WHEN LOWER(pf.report) LIKE '%normal%' THEN 1 ELSE 0 END) as normal, " +
           "SUM(CASE WHEN LOWER(pf.report) LIKE '%anormal%' THEN 1 ELSE 0 END) as abnormal, " +
           "SUM(CASE WHEN LOWER(pf.report) LIKE '%malign%' THEN 1 ELSE 0 END) as malignant, " +
           "SUM(CASE WHEN LOWER(pf.report) LIKE '%benign%' THEN 1 ELSE 0 END) as benign " +
           "FROM PathologyFinding pf")
    List<Object[]> getPathologyKeywordStatistics();

    /**
     * Son patoloji bulgusu tarihi (hayvan bazında)
     */
    @Query("SELECT MAX(pf.date) FROM PathologyFinding pf WHERE pf.animal.id = :animalId")
    LocalDate findLastPathologyDateByAnimalId(@Param("animalId") Long animalId);
} 