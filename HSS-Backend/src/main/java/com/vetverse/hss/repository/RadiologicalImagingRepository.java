package com.vetverse.hss.repository;

import com.vetverse.hss.entity.RadiologicalImaging;
import com.vetverse.hss.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * RadiologicalImaging Repository
 * RadiologicalImaging entity'si için veri erişim katmanı
 */
@Repository
public interface RadiologicalImagingRepository extends JpaRepository<RadiologicalImaging, Long> {

    /**
     * Hayvana göre radyolojik görüntüleri listeleme
     */
    List<RadiologicalImaging> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre radyolojik görüntüleri listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.animal.id = :animalId ORDER BY ri.date DESC")
    List<RadiologicalImaging> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Görüntüleme türüne göre listeleme
     */
    List<RadiologicalImaging> findByType(String type);

    /**
     * Görüntüleme türü ile arama (case insensitive)
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE LOWER(ri.type) LIKE LOWER(CONCAT('%', :type, '%'))")
    List<RadiologicalImaging> searchByType(@Param("type") String type);

    /**
     * Belirli tarih aralığındaki görüntüleri listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.date BETWEEN :startDate AND :endDate ORDER BY ri.date DESC")
    List<RadiologicalImaging> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Yorum ile arama
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE LOWER(ri.comment) LIKE LOWER(CONCAT('%', :comment, '%'))")
    List<RadiologicalImaging> searchByComment(@Param("comment") String comment);

    /**
     * Hayvan adı ile görüntü arama
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE LOWER(ri.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<RadiologicalImaging> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile görüntü arama
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE LOWER(CONCAT(ri.animal.owner.firstName, ' ', ri.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<RadiologicalImaging> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Bugünkü görüntüleri listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.date = CURRENT_DATE ORDER BY ri.date")
    List<RadiologicalImaging> findTodayImagings();

    /**
     * Son 30 günde çekilen görüntüler
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.date >= :thirtyDaysAgo ORDER BY ri.date DESC")
    List<RadiologicalImaging> findRecentImagings(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Belirli tür hayvanların görüntüleri
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.animal.species.id = :speciesId ORDER BY ri.date DESC")
    List<RadiologicalImaging> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların görüntüleri
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.animal.breed.id = :breedId ORDER BY ri.date DESC")
    List<RadiologicalImaging> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Görüntü türü istatistikleri
     */
    @Query("SELECT ri.type, COUNT(ri) FROM RadiologicalImaging ri GROUP BY ri.type ORDER BY COUNT(ri) DESC")
    List<Object[]> getImagingTypeStatistics();

    /**
     * Sahip ID'sine göre tüm hayvanların görüntüleri
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.animal.owner.id = :ownerId ORDER BY ri.date DESC")
    List<RadiologicalImaging> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Belirli tarihteki görüntüleri listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.date = :date ORDER BY ri.type")
    List<RadiologicalImaging> findByDate(@Param("date") LocalDate date);

    /**
     * Görüntü türü ve tarih aralığına göre görüntüleri listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.type = :type AND ri.date BETWEEN :startDate AND :endDate ORDER BY ri.date DESC")
    List<RadiologicalImaging> findByTypeAndDateBetween(@Param("type") String type, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Görüntü URL'si olan kayıtları listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.imageUrl IS NOT NULL AND ri.imageUrl != '' ORDER BY ri.date DESC")
    List<RadiologicalImaging> findWithImageUrl();

    /**
     * Yorumu olan görüntüleri listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.comment IS NOT NULL AND ri.comment != '' ORDER BY ri.date DESC")
    List<RadiologicalImaging> findWithComments();

    /**
     * Yorumu olmayan görüntüleri listeleme
     */
    @Query("SELECT ri FROM RadiologicalImaging ri WHERE ri.comment IS NULL OR ri.comment = '' ORDER BY ri.date DESC")
    List<RadiologicalImaging> findWithoutComments();
} 