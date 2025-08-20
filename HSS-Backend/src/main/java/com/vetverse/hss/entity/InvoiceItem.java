package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * InvoiceItem Entity
 * Represents invoice items (fatura_madde tablosu)
 */
@Entity
@Table(name = "fatura_madde")
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fatura_madde_id")
    private Long id;

    @NotBlank
    @Column(name = "aciklama", length = 200)
    private String description;

    @NotNull
    @Column(name = "miktar", nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "birim_fiyat", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "kdv_orani", precision = 5, scale = 2)
    private BigDecimal vatRate = BigDecimal.ZERO;

    // Many-to-One relationship with Invoice
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fatura_id", referencedColumnName = "fatura_id")
    @JsonBackReference
    private Invoice invoice;

    // Constructors
    public InvoiceItem() {}

    public InvoiceItem(String description, Integer quantity, BigDecimal unitPrice, BigDecimal vatRate, Invoice invoice) {
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.vatRate = vatRate;
        this.invoice = invoice;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getVatRate() {
        return vatRate;
    }

    public void setVatRate(BigDecimal vatRate) {
        this.vatRate = vatRate;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    // Utility methods
    public BigDecimal getTotalPrice() {
        BigDecimal subtotal = unitPrice.multiply(new BigDecimal(quantity));
        BigDecimal vatAmount = subtotal.multiply(vatRate).divide(new BigDecimal(100));
        return subtotal.add(vatAmount);
    }

    @Override
    public String toString() {
        return "InvoiceItem{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", vatRate=" + vatRate +
                '}';
    }
} 