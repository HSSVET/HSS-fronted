package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Invoice Entity
 * Represents invoices (fatura tablosu)
 */
@Entity
@Table(name = "fatura")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fatura_id")
    private Long id;

    @Column(name = "tarih")
    private LocalDate date;

    @Column(name = "tutar", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "aciklama", columnDefinition = "TEXT")
    private String description;

    // Many-to-One relationship with Owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sahip_id", referencedColumnName = "sahip_id")
    @JsonBackReference
    private Owner owner;

    // One-to-Many relationship with InvoiceItem
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<InvoiceItem> invoiceItems = new HashSet<>();

    // Constructors
    public Invoice() {}

    public Invoice(LocalDate date, BigDecimal amount, String description, Owner owner) {
        this.date = date;
        this.amount = amount;
        this.description = description;
        this.owner = owner;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Set<InvoiceItem> getInvoiceItems() {
        return invoiceItems;
    }

    public void setInvoiceItems(Set<InvoiceItem> invoiceItems) {
        this.invoiceItems = invoiceItems;
    }

    @Override
    public String toString() {
        return "Invoice{" +
                "id=" + id +
                ", date=" + date +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                '}';
    }
} 