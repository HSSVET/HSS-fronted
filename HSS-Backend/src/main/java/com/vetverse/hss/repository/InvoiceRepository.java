package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Invoice;
import com.vetverse.hss.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Invoice Repository
 * Invoice entity'si için veri erişim katmanı
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    /**
     * Sahibe göre faturaları listeleme
     */
    List<Invoice> findByOwner(Owner owner);

    /**
     * Sahip ID'sine göre faturaları listeleme
     */
    @Query("SELECT i FROM Invoice i WHERE i.owner.id = :ownerId ORDER BY i.date DESC")
    List<Invoice> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Belirli tarih aralığındaki faturaları listeleme
     */
    @Query("SELECT i FROM Invoice i WHERE i.date BETWEEN :startDate AND :endDate ORDER BY i.date DESC")
    List<Invoice> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Belirli tutar aralığındaki faturaları listeleme
     */
    @Query("SELECT i FROM Invoice i WHERE i.amount BETWEEN :minAmount AND :maxAmount ORDER BY i.amount DESC")
    List<Invoice> findByAmountBetween(@Param("minAmount") BigDecimal minAmount, @Param("maxAmount") BigDecimal maxAmount);

    /**
     * Açıklama ile arama
     */
    @Query("SELECT i FROM Invoice i WHERE LOWER(i.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<Invoice> searchByDescription(@Param("description") String description);

    /**
     * Sahip adı ile fatura arama
     */
    @Query("SELECT i FROM Invoice i WHERE LOWER(CONCAT(i.owner.firstName, ' ', i.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<Invoice> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Bugünkü faturaları listeleme
     */
    @Query("SELECT i FROM Invoice i WHERE i.date = CURRENT_DATE ORDER BY i.date")
    List<Invoice> findTodayInvoices();

    /**
     * Son 30 günde oluşturulan faturalar
     */
    @Query("SELECT i FROM Invoice i WHERE i.date >= :thirtyDaysAgo ORDER BY i.date DESC")
    List<Invoice> findRecentInvoices(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

    /**
     * Yüksek tutarlı faturalar (belirli tutarın üzerinde)
     */
    @Query("SELECT i FROM Invoice i WHERE i.amount > :threshold ORDER BY i.amount DESC")
    List<Invoice> findHighAmountInvoices(@Param("threshold") BigDecimal threshold);

    /**
     * Belirli tarihteki faturaları listeleme
     */
    @Query("SELECT i FROM Invoice i WHERE i.date = :date ORDER BY i.amount DESC")
    List<Invoice> findByDate(@Param("date") LocalDate date);

    /**
     * Toplam gelir hesaplama (belirli tarih aralığı)
     */
    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.date BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Aylık gelir istatistikleri
     */
    @Query("SELECT EXTRACT(YEAR FROM i.date), EXTRACT(MONTH FROM i.date), SUM(i.amount) FROM Invoice i GROUP BY EXTRACT(YEAR FROM i.date), EXTRACT(MONTH FROM i.date) ORDER BY EXTRACT(YEAR FROM i.date) DESC, EXTRACT(MONTH FROM i.date) DESC")
    List<Object[]> getMonthlyRevenueStatistics();

    /**
     * En yüksek tutarlı faturalar
     */
    @Query("SELECT i FROM Invoice i ORDER BY i.amount DESC")
    List<Invoice> findTopInvoicesByAmount();

    /**
     * Sahip bazında toplam fatura tutarı
     */
    @Query("SELECT i.owner, SUM(i.amount) FROM Invoice i GROUP BY i.owner ORDER BY SUM(i.amount) DESC")
    List<Object[]> getOwnerRevenueStatistics();

    /**
     * Bu ayki faturalar
     */
    @Query("SELECT i FROM Invoice i WHERE EXTRACT(YEAR FROM i.date) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM i.date) = EXTRACT(MONTH FROM CURRENT_DATE) ORDER BY i.date DESC")
    List<Invoice> findCurrentMonthInvoices();

    /**
     * Bu yılki faturalar
     */
    @Query("SELECT i FROM Invoice i WHERE EXTRACT(YEAR FROM i.date) = EXTRACT(YEAR FROM CURRENT_DATE) ORDER BY i.date DESC")
    List<Invoice> findCurrentYearInvoices();

    /**
     * Kalem sayısı olan faturaları listeleme
     */
    @Query("SELECT i FROM Invoice i WHERE SIZE(i.invoiceItems) > 0 ORDER BY SIZE(i.invoiceItems) DESC")
    List<Invoice> findInvoicesWithItems();

    /**
     * Kalem sayısı olmayan faturaları listeleme
     */
    @Query("SELECT i FROM Invoice i WHERE SIZE(i.invoiceItems) = 0")
    List<Invoice> findInvoicesWithoutItems();

    /**
     * Ortalama fatura tutarı
     */
    @Query("SELECT AVG(i.amount) FROM Invoice i")
    BigDecimal getAverageInvoiceAmount();

    /**
     * Günlük gelir istatistikleri
     */
    @Query("SELECT i.date, SUM(i.amount) FROM Invoice i GROUP BY i.date ORDER BY i.date DESC")
    List<Object[]> getDailyRevenueStatistics();
} 