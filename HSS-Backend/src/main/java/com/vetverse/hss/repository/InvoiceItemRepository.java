package com.vetverse.hss.repository;

import com.vetverse.hss.entity.InvoiceItem;
import com.vetverse.hss.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * InvoiceItem Repository
 * InvoiceItem entity'si için veri erişim katmanı
 */
@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {

    /**
     * Faturaya göre kalemleri listeleme
     */
    List<InvoiceItem> findByInvoice(Invoice invoice);

    /**
     * Fatura ID'sine göre kalemleri listeleme
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.invoice.id = :invoiceId ORDER BY ii.id")
    List<InvoiceItem> findByInvoiceId(@Param("invoiceId") Long invoiceId);

    /**
     * Açıklama ile arama
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE LOWER(ii.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<InvoiceItem> searchByDescription(@Param("description") String description);

    /**
     * Belirli miktar aralığındaki kalemleri listeleme
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.quantity BETWEEN :minQuantity AND :maxQuantity")
    List<InvoiceItem> findByQuantityBetween(@Param("minQuantity") Integer minQuantity, @Param("maxQuantity") Integer maxQuantity);

    /**
     * Belirli birim fiyat aralığındaki kalemleri listeleme
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.unitPrice BETWEEN :minPrice AND :maxPrice")
    List<InvoiceItem> findByUnitPriceBetween(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);

    /**
     * Belirli KDV oranına sahip kalemleri listeleme
     */
    List<InvoiceItem> findByVatRate(BigDecimal vatRate);

    /**
     * En çok satılan ürün/hizmetler
     */
    @Query("SELECT ii.description, SUM(ii.quantity) FROM InvoiceItem ii GROUP BY ii.description ORDER BY SUM(ii.quantity) DESC")
    List<Object[]> getMostSoldItems();

    /**
     * En yüksek gelir getiren ürün/hizmetler
     */
    @Query("SELECT ii.description, SUM(ii.quantity * ii.unitPrice) FROM InvoiceItem ii GROUP BY ii.description ORDER BY SUM(ii.quantity * ii.unitPrice) DESC")
    List<Object[]> getHighestRevenueItems();

    /**
     * Toplam satış miktarı (belirli ürün/hizmet)
     */
    @Query("SELECT SUM(ii.quantity) FROM InvoiceItem ii WHERE LOWER(ii.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    Long getTotalQuantityByDescription(@Param("description") String description);

    /**
     * Toplam gelir (belirli ürün/hizmet)
     */
    @Query("SELECT SUM(ii.quantity * ii.unitPrice) FROM InvoiceItem ii WHERE LOWER(ii.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    BigDecimal getTotalRevenueByDescription(@Param("description") String description);

    /**
     * KDV oranı istatistikleri
     */
    @Query("SELECT ii.vatRate, COUNT(ii) FROM InvoiceItem ii GROUP BY ii.vatRate ORDER BY COUNT(ii) DESC")
    List<Object[]> getVatRateStatistics();

    /**
     * Yüksek miktarlı kalemler
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.quantity > :threshold ORDER BY ii.quantity DESC")
    List<InvoiceItem> findHighQuantityItems(@Param("threshold") Integer threshold);

    /**
     * Yüksek fiyatlı kalemler
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.unitPrice > :threshold ORDER BY ii.unitPrice DESC")
    List<InvoiceItem> findHighPriceItems(@Param("threshold") BigDecimal threshold);

    /**
     * Sahip ID'sine göre satın alınan ürün/hizmetler
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.invoice.owner.id = :ownerId ORDER BY ii.invoice.date DESC")
    List<InvoiceItem> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Ortalama birim fiyat
     */
    @Query("SELECT AVG(ii.unitPrice) FROM InvoiceItem ii")
    BigDecimal getAverageUnitPrice();

    /**
     * Ortalama miktar
     */
    @Query("SELECT AVG(ii.quantity) FROM InvoiceItem ii")
    Double getAverageQuantity();

    /**
     * Toplam kalem sayısı (fatura başına)
     */
    @Query("SELECT ii.invoice.id, COUNT(ii) FROM InvoiceItem ii GROUP BY ii.invoice.id ORDER BY COUNT(ii) DESC")
    List<Object[]> getItemCountPerInvoice();

    /**
     * Sıfır KDV'li kalemler
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.vatRate = 0")
    List<InvoiceItem> findZeroVatItems();

    /**
     * KDV'li kalemler
     */
    @Query("SELECT ii FROM InvoiceItem ii WHERE ii.vatRate > 0")
    List<InvoiceItem> findVatApplicableItems();
} 