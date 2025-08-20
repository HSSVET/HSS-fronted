package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Animal Entity
 * Represents animals (hayvan tablosu)
 */
@Entity
@Table(name = "hayvan")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hayvan_id")
    private Long id;

    @NotBlank
    @Column(name = "ad")
    private String name;

    @Column(name = "cinsiyet")
    private String gender;

    @Column(name = "doğum_tarihi")
    private LocalDate birthDate;

    @Column(name = "kilo", precision = 10, scale = 2)
    private BigDecimal weight;

    @Column(name = "renk")
    private String color;

    @Column(name = "mikrocip_no")
    private String microchipNumber;

    @Column(name = "alerjiler", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "kronik_hastalıklar", columnDefinition = "TEXT")
    private String chronicDiseases;

    @Column(name = "notlar", columnDefinition = "TEXT")
    private String notes;

    // Many-to-One relationship with Owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sahip_id", referencedColumnName = "sahip_id")
    @JsonBackReference
    private Owner owner;

    // Many-to-One relationship with Species
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tur_id", referencedColumnName = "tur_id")
    @JsonBackReference
    private Species species;

    // Many-to-One relationship with Breed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ırk_id", referencedColumnName = "ırk_id")
    @JsonBackReference
    private Breed breed;

    // One-to-Many relationships
    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<DiseaseHistory> diseaseHistories = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<ClinicalExamination> clinicalExaminations = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Appointment> appointments = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<LabTest> labTests = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<RadiologicalImaging> radiologicalImagings = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Prescription> prescriptions = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<VaccinationRecord> vaccinationRecords = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<PathologyFinding> pathologyFindings = new HashSet<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Document> documents = new HashSet<>();

    // Constructors
    public Animal() {}

    public Animal(String name, Owner owner, Species species, Breed breed) {
        this.name = name;
        this.owner = owner;
        this.species = species;
        this.breed = breed;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getMicrochipNumber() {
        return microchipNumber;
    }

    public void setMicrochipNumber(String microchipNumber) {
        this.microchipNumber = microchipNumber;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getChronicDiseases() {
        return chronicDiseases;
    }

    public void setChronicDiseases(String chronicDiseases) {
        this.chronicDiseases = chronicDiseases;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Species getSpecies() {
        return species;
    }

    public void setSpecies(Species species) {
        this.species = species;
    }

    public Breed getBreed() {
        return breed;
    }

    public void setBreed(Breed breed) {
        this.breed = breed;
    }

    public Set<DiseaseHistory> getDiseaseHistories() {
        return diseaseHistories;
    }

    public void setDiseaseHistories(Set<DiseaseHistory> diseaseHistories) {
        this.diseaseHistories = diseaseHistories;
    }

    public Set<ClinicalExamination> getClinicalExaminations() {
        return clinicalExaminations;
    }

    public void setClinicalExaminations(Set<ClinicalExamination> clinicalExaminations) {
        this.clinicalExaminations = clinicalExaminations;
    }

    public Set<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(Set<Appointment> appointments) {
        this.appointments = appointments;
    }

    public Set<LabTest> getLabTests() {
        return labTests;
    }

    public void setLabTests(Set<LabTest> labTests) {
        this.labTests = labTests;
    }

    public Set<RadiologicalImaging> getRadiologicalImagings() {
        return radiologicalImagings;
    }

    public void setRadiologicalImagings(Set<RadiologicalImaging> radiologicalImagings) {
        this.radiologicalImagings = radiologicalImagings;
    }

    public Set<Prescription> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(Set<Prescription> prescriptions) {
        this.prescriptions = prescriptions;
    }

    public Set<VaccinationRecord> getVaccinationRecords() {
        return vaccinationRecords;
    }

    public void setVaccinationRecords(Set<VaccinationRecord> vaccinationRecords) {
        this.vaccinationRecords = vaccinationRecords;
    }

    public Set<PathologyFinding> getPathologyFindings() {
        return pathologyFindings;
    }

    public void setPathologyFindings(Set<PathologyFinding> pathologyFindings) {
        this.pathologyFindings = pathologyFindings;
    }

    public Set<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(Set<Document> documents) {
        this.documents = documents;
    }

    // Utility methods
    public int getAgeInYears() {
        if (birthDate == null) {
            return 0;
        }
        return LocalDate.now().getYear() - birthDate.getYear();
    }

    @Override
    public String toString() {
        return "Animal{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", gender='" + gender + '\'' +
                ", birthDate=" + birthDate +
                ", weight=" + weight +
                ", microchipNumber='" + microchipNumber + '\'' +
                '}';
    }
} 