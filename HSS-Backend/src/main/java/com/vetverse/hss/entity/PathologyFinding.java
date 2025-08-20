package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * PathologyFinding Entity
 * Represents pathology findings (patoloji_bulgulari tablosu)
 */
@Entity
@Table(name = "patoloji_bulgulari")
public class PathologyFinding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patoloji_id")
    private Long id;

    @Column(name = "rapor", columnDefinition = "TEXT")
    private String report;

    @Column(name = "tarih")
    private LocalDate date;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // Constructors
    public PathologyFinding() {}

    public PathologyFinding(String report, LocalDate date, Animal animal) {
        this.report = report;
        this.date = date;
        this.animal = animal;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    @Override
    public String toString() {
        return "PathologyFinding{" +
                "id=" + id +
                ", report='" + report + '\'' +
                ", date=" + date +
                '}';
    }
} 