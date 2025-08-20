package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * LabTest Entity
 * Represents laboratory tests (lab_testleri tablosu)
 */
@Entity
@Table(name = "lab_testleri")
public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_id")
    private Long id;

    @NotBlank
    @Column(name = "test_adi")
    private String testName;

    @Column(name = "tarih")
    private LocalDate date;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // One-to-Many relationship with LabResult
    @OneToMany(mappedBy = "labTest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<LabResult> labResults = new HashSet<>();

    // Constructors
    public LabTest() {}

    public LabTest(String testName, LocalDate date, Animal animal) {
        this.testName = testName;
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

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
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

    public Set<LabResult> getLabResults() {
        return labResults;
    }

    public void setLabResults(Set<LabResult> labResults) {
        this.labResults = labResults;
    }

    @Override
    public String toString() {
        return "LabTest{" +
                "id=" + id +
                ", testName='" + testName + '\'' +
                ", date=" + date +
                '}';
    }
} 