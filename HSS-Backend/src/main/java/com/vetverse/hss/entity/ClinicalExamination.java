package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * ClinicalExamination Entity
 * Represents clinical examination records (klinik_inceleme tablosu)
 */
@Entity
@Table(name = "klinik_inceleme")
public class ClinicalExamination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inceleme_id")
    private Long id;

    @Column(name = "tarih")
    private LocalDate date;

    @Column(name = "bulgular", columnDefinition = "TEXT")
    private String findings;

    @Column(name = "veteriner_ad")
    private String veterinarianName;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // Constructors
    public ClinicalExamination() {}

    public ClinicalExamination(LocalDate date, String findings, String veterinarianName, Animal animal) {
        this.date = date;
        this.findings = findings;
        this.veterinarianName = veterinarianName;
        this.animal = animal;
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

    public String getFindings() {
        return findings;
    }

    public void setFindings(String findings) {
        this.findings = findings;
    }

    public String getVeterinarianName() {
        return veterinarianName;
    }

    public void setVeterinarianName(String veterinarianName) {
        this.veterinarianName = veterinarianName;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    @Override
    public String toString() {
        return "ClinicalExamination{" +
                "id=" + id +
                ", date=" + date +
                ", findings='" + findings + '\'' +
                ", veterinarianName='" + veterinarianName + '\'' +
                '}';
    }
} 