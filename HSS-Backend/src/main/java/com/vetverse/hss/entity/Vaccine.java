package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

/**
 * Vaccine Entity
 * Represents vaccines (asi tablosu)
 */
@Entity
@Table(name = "asi")
public class Vaccine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asi_id")
    private Long id;

    @NotBlank
    @Column(name = "asi_ad", length = 100, nullable = false)
    private String vaccineName;

    @Column(name = "uygulama_yolu", length = 50)
    private String applicationRoute;

    @Column(name = "koruma_suresi")
    private Duration protectionDuration;

    @Column(name = "notlar", columnDefinition = "TEXT")
    private String notes;

    // One-to-Many relationship with VaccinationRecord
    @OneToMany(mappedBy = "vaccine", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<VaccinationRecord> vaccinationRecords = new HashSet<>();

    // Constructors
    public Vaccine() {}

    public Vaccine(String vaccineName, String applicationRoute, Duration protectionDuration) {
        this.vaccineName = vaccineName;
        this.applicationRoute = applicationRoute;
        this.protectionDuration = protectionDuration;
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

    public String getApplicationRoute() {
        return applicationRoute;
    }

    public void setApplicationRoute(String applicationRoute) {
        this.applicationRoute = applicationRoute;
    }

    public Duration getProtectionDuration() {
        return protectionDuration;
    }

    public void setProtectionDuration(Duration protectionDuration) {
        this.protectionDuration = protectionDuration;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<VaccinationRecord> getVaccinationRecords() {
        return vaccinationRecords;
    }

    public void setVaccinationRecords(Set<VaccinationRecord> vaccinationRecords) {
        this.vaccinationRecords = vaccinationRecords;
    }

    @Override
    public String toString() {
        return "Vaccine{" +
                "id=" + id +
                ", vaccineName='" + vaccineName + '\'' +
                ", applicationRoute='" + applicationRoute + '\'' +
                ", protectionDuration=" + protectionDuration +
                '}';
    }
} 