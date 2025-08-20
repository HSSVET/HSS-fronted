package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

/**
 * Medication Entity
 * Represents medications (ilac tablosu)
 */
@Entity
@Table(name = "ilac")
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ilac_id")
    private Long id;

    @NotBlank
    @Column(name = "ilac_ad", length = 100, nullable = false)
    private String medicationName;

    @Column(name = "aktif_madde", length = 100)
    private String activeIngredient;

    @Column(name = "kullanim_alani", length = 100)
    private String usageArea;

    @Column(name = "uygulama_yolu", length = 50)
    private String applicationRoute;

    @Column(name = "notlar", columnDefinition = "TEXT")
    private String notes;

    // One-to-Many relationship with Prescription
    @OneToMany(mappedBy = "medication", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Prescription> prescriptions = new HashSet<>();

    // Constructors
    public Medication() {}

    public Medication(String medicationName, String activeIngredient, String usageArea, String applicationRoute) {
        this.medicationName = medicationName;
        this.activeIngredient = activeIngredient;
        this.usageArea = usageArea;
        this.applicationRoute = applicationRoute;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public String getActiveIngredient() {
        return activeIngredient;
    }

    public void setActiveIngredient(String activeIngredient) {
        this.activeIngredient = activeIngredient;
    }

    public String getUsageArea() {
        return usageArea;
    }

    public void setUsageArea(String usageArea) {
        this.usageArea = usageArea;
    }

    public String getApplicationRoute() {
        return applicationRoute;
    }

    public void setApplicationRoute(String applicationRoute) {
        this.applicationRoute = applicationRoute;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<Prescription> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(Set<Prescription> prescriptions) {
        this.prescriptions = prescriptions;
    }

    @Override
    public String toString() {
        return "Medication{" +
                "id=" + id +
                ", medicationName='" + medicationName + '\'' +
                ", activeIngredient='" + activeIngredient + '\'' +
                ", usageArea='" + usageArea + '\'' +
                '}';
    }
} 