package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

/**
 * DiseaseHistory Entity
 * Represents disease history records (hastalik_gecmisi tablosu)
 */
@Entity
@Table(name = "hastalik_gecmisi")
public class DiseaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gecmis_id")
    private Long id;

    @NotBlank
    @Column(name = "tani", columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "tarih")
    private LocalDate date;

    @Column(name = "tedavi", columnDefinition = "TEXT")
    private String treatment;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // Constructors
    public DiseaseHistory() {}

    public DiseaseHistory(String diagnosis, LocalDate date, String treatment, Animal animal) {
        this.diagnosis = diagnosis;
        this.date = date;
        this.treatment = treatment;
        this.animal = animal;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    @Override
    public String toString() {
        return "DiseaseHistory{" +
                "id=" + id +
                ", diagnosis='" + diagnosis + '\'' +
                ", date=" + date +
                ", treatment='" + treatment + '\'' +
                '}';
    }
} 