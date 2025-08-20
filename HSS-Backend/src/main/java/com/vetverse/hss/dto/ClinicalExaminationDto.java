package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * ClinicalExamination DTO classes
 */
public class ClinicalExaminationDto {

    /**
     * ClinicalExamination creation/update request DTO
     */
    public static class Request {
        @NotNull(message = "Animal ID is required")
        private Long animalId;

        @NotNull(message = "Date is required")
        private LocalDate date;

        @NotBlank(message = "Findings is required")
        @Size(max = 2000, message = "Findings cannot exceed 2000 characters")
        private String findings;

        @Size(max = 100, message = "Veterinarian name cannot exceed 100 characters")
        private String veterinarianName;

        // Constructors
        public Request() {}

        public Request(Long animalId, LocalDate date, String findings, String veterinarianName) {
            this.animalId = animalId;
            this.date = date;
            this.findings = findings;
            this.veterinarianName = veterinarianName;
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
    }

    /**
     * ClinicalExamination response DTO
     */
    public static class Response {
        private Long id;
        private AnimalDto.Basic animal;
        private LocalDate date;
        private String findings;
        private String veterinarianName;
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

        public OwnerDto.Basic getOwner() {
            return owner;
        }

        public void setOwner(OwnerDto.Basic owner) {
            this.owner = owner;
        }
    }

    /**
     * Basic clinical examination info DTO for listing purposes
     */
    public static class Basic {
        private Long id;
        private String animalName;
        private String ownerName;
        private LocalDate date;
        private String veterinarianName;
        private String shortFindings; // İlk 100 karakter

        // Constructors
        public Basic() {}

        public Basic(Long id, String animalName, String ownerName, LocalDate date, String veterinarianName) {
            this.id = id;
            this.animalName = animalName;
            this.ownerName = ownerName;
            this.date = date;
            this.veterinarianName = veterinarianName;
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

        public String getVeterinarianName() {
            return veterinarianName;
        }

        public void setVeterinarianName(String veterinarianName) {
            this.veterinarianName = veterinarianName;
        }

        public String getShortFindings() {
            return shortFindings;
        }

        public void setShortFindings(String shortFindings) {
            this.shortFindings = shortFindings;
        }
    }

    /**
     * Examination statistics DTO
     */
    public static class ExaminationStatistics {
        private String veterinarianName;
        private Long count;
        private Double percentage;

        // Constructors
        public ExaminationStatistics() {}

        public ExaminationStatistics(String veterinarianName, Long count) {
            this.veterinarianName = veterinarianName;
            this.count = count;
        }

        // Getters and Setters
        public String getVeterinarianName() {
            return veterinarianName;
        }

        public void setVeterinarianName(String veterinarianName) {
            this.veterinarianName = veterinarianName;
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