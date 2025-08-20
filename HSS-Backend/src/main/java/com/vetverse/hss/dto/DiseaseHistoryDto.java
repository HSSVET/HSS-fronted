package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * DiseaseHistory DTO classes
 */
public class DiseaseHistoryDto {

    /**
     * DiseaseHistory creation/update request DTO
     */
    public static class Request {
        @NotNull(message = "Animal ID is required")
        private Long animalId;

        @NotNull(message = "Date is required")
        private LocalDate date;

        @NotBlank(message = "Diagnosis is required")
        @Size(max = 1000, message = "Diagnosis cannot exceed 1000 characters")
        private String diagnosis;

        @Size(max = 2000, message = "Treatment cannot exceed 2000 characters")
        private String treatment;

        // Constructors
        public Request() {}

        public Request(Long animalId, LocalDate date, String diagnosis, String treatment) {
            this.animalId = animalId;
            this.date = date;
            this.diagnosis = diagnosis;
            this.treatment = treatment;
        }

        // Getters and Setters
        public Long getAnimalId() {
            return animalId;
        }

        public void setAnimalId(Long animalId) {
            this.animalId = animalId;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getDiagnosis() {
            return diagnosis;
        }

        public void setDiagnosis(String diagnosis) {
            this.diagnosis = diagnosis;
        }

        public String getTreatment() {
            return treatment;
        }

        public void setTreatment(String treatment) {
            this.treatment = treatment;
        }
    }

    /**
     * DiseaseHistory response DTO
     */
    public static class Response {
        private Long id;
        private AnimalDto.Basic animal;
        private LocalDate date;
        private String diagnosis;
        private String treatment;
        private OwnerDto.Basic owner;

        // Constructors
        public Response() {}

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public AnimalDto.Basic getAnimal() {
            return animal;
        }

        public void setAnimal(AnimalDto.Basic animal) {
            this.animal = animal;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getDiagnosis() {
            return diagnosis;
        }

        public void setDiagnosis(String diagnosis) {
            this.diagnosis = diagnosis;
        }

        public String getTreatment() {
            return treatment;
        }

        public void setTreatment(String treatment) {
            this.treatment = treatment;
        }

        public OwnerDto.Basic getOwner() {
            return owner;
        }

        public void setOwner(OwnerDto.Basic owner) {
            this.owner = owner;
        }
    }

    /**
     * Basic disease history info DTO for listing purposes
     */
    public static class Basic {
        private Long id;
        private String animalName;
        private String ownerName;
        private LocalDate date;
        private String diagnosis;
        private String shortTreatment; // İlk 100 karakter

        // Constructors
        public Basic() {}

        public Basic(Long id, String animalName, String ownerName, LocalDate date, String diagnosis) {
            this.id = id;
            this.animalName = animalName;
            this.ownerName = ownerName;
            this.date = date;
            this.diagnosis = diagnosis;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getAnimalName() {
            return animalName;
        }

        public void setAnimalName(String animalName) {
            this.animalName = animalName;
        }

        public String getOwnerName() {
            return ownerName;
        }

        public void setOwnerName(String ownerName) {
            this.ownerName = ownerName;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getDiagnosis() {
            return diagnosis;
        }

        public void setDiagnosis(String diagnosis) {
            this.diagnosis = diagnosis;
        }

        public String getShortTreatment() {
            return shortTreatment;
        }

        public void setShortTreatment(String shortTreatment) {
            this.shortTreatment = shortTreatment;
        }
    }

    /**
     * Disease statistics DTO
     */
    public static class DiagnosisStatistics {
        private String diagnosis;
        private Long count;
        private Double percentage;

        // Constructors
        public DiagnosisStatistics() {}

        public DiagnosisStatistics(String diagnosis, Long count) {
            this.diagnosis = diagnosis;
            this.count = count;
        }

        // Getters and Setters
        public String getDiagnosis() {
            return diagnosis;
        }

        public void setDiagnosis(String diagnosis) {
            this.diagnosis = diagnosis;
        }

        public Long getCount() {
            return count;
        }

        public void setCount(Long count) {
            this.count = count;
        }

        public Double getPercentage() {
            return percentage;
        }

        public void setPercentage(Double percentage) {
            this.percentage = percentage;
        }
    }
} 