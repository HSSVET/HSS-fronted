package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * VaccinationRecord Entity
 * Represents vaccination records (asi_karnesi tablosu)
 */
@Entity
@Table(name = "asi_karnesi")
public class VaccinationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asi_karnesi_id")
    private Long id;

    @Column(name = "asi_adi")
    private String vaccineName;

    @Column(name = "tarih")
    private LocalDate date;

    @Column(name = "tekrar")
    private String repeat;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // Many-to-One relationship with Vaccine
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asi_id", referencedColumnName = "asi_id")
    @JsonBackReference
    private Vaccine vaccine;

    // Constructors
    public VaccinationRecord() {}

    public VaccinationRecord(String vaccineName, LocalDate date, String repeat, Animal animal, Vaccine vaccine) {
        this.vaccineName = vaccineName;
        this.date = date;
        this.repeat = repeat;
        this.animal = animal;
        this.vaccine = vaccine;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVaccineName() {
        return vaccineName;
    }

    public void setVaccineName(String vaccineName) {
        this.vaccineName = vaccineName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getRepeat() {
        return repeat;
    }

    public void setRepeat(String repeat) {
        this.repeat = repeat;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public Vaccine getVaccine() {
        return vaccine;
    }

    public void setVaccine(Vaccine vaccine) {
        this.vaccine = vaccine;
    }

    @Override
    public String toString() {
        return "VaccinationRecord{" +
                "id=" + id +
                ", vaccineName='" + vaccineName + '\'' +
                ", date=" + date +
                ", repeat='" + repeat + '\'' +
                '}';
    }
} 