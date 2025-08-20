package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Communication;
import com.vetverse.hss.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Communication Repository
 * Communication entity'si için veri erişim katmanı
 */
@Repository
public interface CommunicationRepository extends JpaRepository<Communication, Long> {

    /**
     * Sahibe göre iletişim kayıtlarını listeleme
     */
    List<Communication> findByOwner(Owner owner);

    /**
     * Sahip ID'sine göre iletişim kayıtlarını listeleme
     */
    @Query("SELECT c FROM Communication c WHERE c.owner.id = :ownerId ORDER BY c.date DESC")
    List<Communication> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Konu ile arama
     */
    @Query("SELECT c FROM Communication c WHERE LOWER(c.subject) LIKE LOWER(CONCAT('%', :subject, '%'))")
    List<Communication> searchBySubject(@Param("subject") String subject);

    /**
     * Mesaj içeriği ile arama
     */
    @Query("SELECT c FROM Communication c WHERE LOWER(c.message) LIKE LOWER(CONCAT('%', :message, '%'))")
    List<Communication> searchByMessage(@Param("message") String message);

    /**
     * Belirli tarih aralığındaki iletişim kayıtlarını listeleme
     */
    @Query("SELECT c FROM Communication c WHERE c.date BETWEEN :startDate AND :endDate ORDER BY c.date DESC")
    List<Communication> findByDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Sahip adı ile iletişim arama
     */
    @Query("SELECT c FROM Communication c WHERE LOWER(CONCAT(c.owner.firstName, ' ', c.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<Communication> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Bugünkü iletişim kayıtlarını listeleme
     */
    @Query("SELECT c FROM Communication c WHERE CAST(c.date AS date) = CURRENT_DATE ORDER BY c.date DESC")
    List<Communication> findTodayCommunications();

    /**
     * Son 7 günde yapılan iletişimler
     */
    @Query("SELECT c FROM Communication c WHERE c.date >= :sevenDaysAgo ORDER BY c.date DESC")
    List<Communication> findRecentCommunications(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    /**
     * Son 30 günde yapılan iletişimler
     */
    @Query("SELECT c FROM Communication c WHERE c.date >= :thirtyDaysAgo ORDER BY c.date DESC")
    List<Communication> findMonthlyRecentCommunications(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    /**
     * Belirli tarihteki iletişim kayıtlarını listeleme
     */
    @Query("SELECT c FROM Communication c WHERE CAST(c.date AS date) = CAST(:date AS date) ORDER BY c.date")
    List<Communication> findByDate(@Param("date") LocalDateTime date);

    /**
     * Konu ve mesaj kombinasyonu ile arama
     */
    @Query("SELECT c FROM Communication c WHERE LOWER(c.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.message) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Communication> searchByKeyword(@Param("keyword") String keyword);

    /**
     * Boş mesajlı iletişim kayıtları
     */
    @Query("SELECT c FROM Communication c WHERE c.message IS NULL OR c.message = ''")
    List<Communication> findEmptyMessages();

    /**
     * Mesajı olan iletişim kayıtları
     */
    @Query("SELECT c FROM Communication c WHERE c.message IS NOT NULL AND c.message != ''")
    List<Communication> findCommunicationsWithMessage();

    /**
     * İletişim sıklığı istatistikleri (sahip bazında)
     */
    @Query("SELECT c.owner, COUNT(c) FROM Communication c GROUP BY c.owner ORDER BY COUNT(c) DESC")
    List<Object[]> getCommunicationFrequencyByOwner();

    /**
     * Konu bazında iletişim istatistikleri
     */
    @Query("SELECT c.subject, COUNT(c) FROM Communication c GROUP BY c.subject ORDER BY COUNT(c) DESC")
    List<Object[]> getSubjectStatistics();

    /**
     * Bu ayki iletişim kayıtları
     */
    @Query("SELECT c FROM Communication c WHERE EXTRACT(YEAR FROM c.date) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM c.date) = EXTRACT(MONTH FROM CURRENT_DATE) ORDER BY c.date DESC")
    List<Communication> findCurrentMonthCommunications();

    /**
     * Bu yılki iletişim kayıtları
     */
    @Query("SELECT c FROM Communication c WHERE EXTRACT(YEAR FROM c.date) = EXTRACT(YEAR FROM CURRENT_DATE) ORDER BY c.date DESC")
    List<Communication> findCurrentYearCommunications();

    /**
     * En son iletişim tarihi (sahip bazında)
     */
    @Query("SELECT MAX(c.date) FROM Communication c WHERE c.owner.id = :ownerId")
    LocalDateTime findLastCommunicationDateByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Günlük iletişim istatistikleri
     */
    @Query("SELECT CAST(c.date AS date), COUNT(c) FROM Communication c GROUP BY CAST(c.date AS date) ORDER BY CAST(c.date AS date) DESC")
    List<Object[]> getDailyCommunicationStatistics();

    /**
     * Aylık iletişim istatistikleri
     */
    @Query("SELECT EXTRACT(YEAR FROM c.date), EXTRACT(MONTH FROM c.date), COUNT(c) FROM Communication c GROUP BY EXTRACT(YEAR FROM c.date), EXTRACT(MONTH FROM c.date) ORDER BY EXTRACT(YEAR FROM c.date) DESC, EXTRACT(MONTH FROM c.date) DESC")
    List<Object[]> getMonthlyCommunicationStatistics();

    /**
     * Belirli konu ile iletişim kayıtları
     */
    List<Communication> findBySubject(String subject);
} 