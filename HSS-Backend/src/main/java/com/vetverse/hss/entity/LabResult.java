package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

/**
 * LabResult Entity
 * Represents laboratory test results (lab_sonuclari tablosu)
 */
@Entity
@Table(name = "lab_sonuclari")
public class LabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sonuc_id")
    private Long id;

    @Column(name = "sonuc", columnDefinition = "TEXT")
    private String result;

    @Column(name = "deger")
    private String value;

    @Column(name = "birim")
    private String unit;

    // Many-to-One relationship with LabTest
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", referencedColumnName = "test_id")
    @JsonBackReference
    private LabTest labTest;

    // Constructors
    public LabResult() {}

    public LabResult(String result, String value, String unit, LabTest labTest) {
        this.result = result;
        this.value = value;
        this.unit = unit;
        this.labTest = labTest;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LabTest getLabTest() {
        return labTest;
    }

    public void setLabTest(LabTest labTest) {
        this.labTest = labTest;
    }

    @Override
    public String toString() {
        return "LabResult{" +
                "id=" + id +
                ", result='" + result + '\'' +
                ", value='" + value + '\'' +
                ", unit='" + unit + '\'' +
                '}';
    }
} 