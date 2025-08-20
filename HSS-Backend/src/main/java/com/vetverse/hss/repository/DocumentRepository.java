package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Document;
import com.vetverse.hss.entity.Owner;
import com.vetverse.hss.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Document Repository
 * Document entity'si için veri erişim katmanı
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    /**
     * Sahibe göre dokümanları listeleme
     */
    List<Document> findByOwner(Owner owner);

    /**
     * Hayvana göre dokümanları listeleme
     */
    List<Document> findByAnimal(Animal animal);

    /**
     * Sahip ID'sine göre dokümanları listeleme
     */
    @Query("SELECT d FROM Document d WHERE d.owner.id = :ownerId ORDER BY d.date DESC")
    List<Document> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Hayvan ID'sine göre dokümanları listeleme
     */
    @Query("SELECT d FROM Document d WHERE d.animal.id = :animalId ORDER BY d.date DESC")
    List<Document> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Başlık ile arama
     */
    @Query("SELECT d FROM Document d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Document> searchByTitle(@Param("title") String title);

    /**
     * İçerik ile arama
     */
    @Query("SELECT d FROM Document d WHERE LOWER(d.content) LIKE LOWER(CONCAT('%', :content, '%'))")
    List<Document> searchByContent(@Param("content") String content);

    /**
     * Belirli tarih aralığındaki dokümanları listeleme
     */
    @Query("SELECT d FROM Document d WHERE d.date BETWEEN :startDate AND :endDate ORDER BY d.date DESC")
    List<Document> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Sahip adı ile doküman arama
     */
    @Query("SELECT d FROM Document d WHERE LOWER(CONCAT(d.owner.firstName, ' ', d.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<Document> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Hayvan adı ile doküman arama
     */
    @Query("SELECT d FROM Document d WHERE d.animal IS NOT NULL AND LOWER(d.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<Document> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Bugünkü dokümanları listeleme
     */
    @Query("SELECT d FROM Document d WHERE d.date = CURRENT_DATE ORDER BY d.date")
    List<Document> findTodayDocuments();

    /**
     * Son 30 günde oluşturulan dokümanlar
     */
    @Query("SELECT d FROM Document d WHERE d.date >= :thirtyDaysAgo ORDER BY d.date DESC")
    List<Document> findRecentDocuments(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Belirli tarihteki dokümanları listeleme
     */
    @Query("SELECT d FROM Document d WHERE d.date = :date ORDER BY d.title")
    List<Document> findByDate(@Param("date") LocalDate date);

    /**
     * Hayvana özel dokümanlar (sahip ve hayvan var)
     */
    @Query("SELECT d FROM Document d WHERE d.owner IS NOT NULL AND d.animal IS NOT NULL ORDER BY d.date DESC")
    List<Document> findAnimalSpecificDocuments();

    /**
     * Sadece sahipe ait dokümanlar (hayvan yok)
     */
    @Query("SELECT d FROM Document d WHERE d.owner IS NOT NULL AND d.animal IS NULL ORDER BY d.date DESC")
    List<Document> findOwnerOnlyDocuments();

    /**
     * Boş içerikli dokümanlar
     */
    @Query("SELECT d FROM Document d WHERE d.content IS NULL OR d.content = ''")
    List<Document> findEmptyDocuments();

    /**
     * İçerikli dokümanlar
     */
    @Query("SELECT d FROM Document d WHERE d.content IS NOT NULL AND d.content != ''")
    List<Document> findDocumentsWithContent();

    /**
     * Belirli tür hayvanların dokümanları
     */
    @Query("SELECT d FROM Document d WHERE d.animal IS NOT NULL AND d.animal.species.id = :speciesId ORDER BY d.date DESC")
    List<Document> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli ırk hayvanların dokümanları
     */
    @Query("SELECT d FROM Document d WHERE d.animal IS NOT NULL AND d.animal.breed.id = :breedId ORDER BY d.date DESC")
    List<Document> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Başlık ve içerik kombinasyonu ile arama
     */
    @Query("SELECT d FROM Document d WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Document> searchByKeyword(@Param("keyword") String keyword);

    /**
     * Doküman türü istatistikleri (başlık analizi)
     */
    @Query("SELECT LEFT(d.title, 20), COUNT(d) FROM Document d GROUP BY LEFT(d.title, 20) ORDER BY COUNT(d) DESC")
    List<Object[]> getDocumentTypeStatistics();
} 