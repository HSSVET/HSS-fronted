package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Prescription Entity
 * Represents prescription records (recete tablosu)
 */
@Entity
@Table(name = "recete")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recete_id")
    private Long id;

    @Column(name = "tarih")
    private LocalDate date;

    @Column(name = "ilaclar", columnDefinition = "TEXT")
    private String medications;

    @Column(name = "dozaj", columnDefinition = "TEXT")
    private String dosage;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // Many-to-One relationship with Medication
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ilac_id", referencedColumnName = "ilac_id")
    @JsonBackReference
    private Medication medication;

    // Constructors
    public Prescription() {}

    public Prescription(LocalDate date, String medications, String dosage, Animal animal, Medication medication) {
        this.date = date;
        this.medications = medications;
        this.dosage = dosage;
        this.animal = animal;
        this.medication = medication;
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

    public String getMedications() {
        return medications;
    }

    public void setMedications(String medications) {
        this.medications = medications;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public Medication getMedication() {
        return medication;
    }

    public void setMedication(Medication medication) {
        this.medication = medication;
    }

    @Override
    public String toString() {
        return "Prescription{" +
                "id=" + id +
                ", date=" + date +
                ", medications='" + medications + '\'' +
                ", dosage='" + dosage + '\'' +
                '}';
    }
} 