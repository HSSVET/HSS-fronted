package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

/**
 * LabTest DTO classes
 */
public class LabTestDto {

    /**
     * LabTest creation/update request DTO
     */
    public static class Request {
        @NotNull(message = "Animal ID is required")
        private Long animalId;

        @NotBlank(message = "Test name is required")
        @Size(max = 200, message = "Test name cannot exceed 200 characters")
        private String testName;

        @NotNull(message = "Date is required")
        private LocalDate date;

        // Constructors
        public Request() {}

        public Request(Long animalId, String testName, LocalDate date) {
            this.animalId = animalId;
            this.testName = testName;
            this.date = date;
        }

        // Getters and Setters
        public Long getAnimalId() {
            return animalId;
        }

        public void setAnimalId(Long animalId) {
            this.animalId = animalId;
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
    }

    /**
     * LabTest response DTO
     */
    public static class Response {
        private Long id;
        private AnimalDto.Basic animal;
        private String testName;
        private LocalDate date;
        private List<LabResultDto.Response> labResults;
        private OwnerDto.Basic owner;
        private String status; // PENDING, COMPLETED

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

        public List<LabResultDto.Response> getLabResults() {
            return labResults;
        }

        public void setLabResults(List<LabResultDto.Response> labResults) {
            this.labResults = labResults;
        }

        public OwnerDto.Basic getOwner() {
            return owner;
        }

        public void setOwner(OwnerDto.Basic owner) {
            this.owner = owner;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    /**
     * Basic lab test info DTO for listing purposes
     */
    public static class Basic {
        private Long id;
        private String animalName;
        private String ownerName;
        private String testName;
        private LocalDate date;
        private String status;

        // Constructors
        public Basic() {}

        public Basic(Long id, String animalName, String ownerName, String testName, LocalDate date) {
            this.id = id;
            this.animalName = animalName;
            this.ownerName = ownerName;
            this.testName = testName;
            this.date = date;
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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    /**
     * Test statistics DTO
     */
    public static class TestStatistics {
        private String testName;
        private Long count;
        private Double percentage;

        // Constructors
        public TestStatistics() {}

        public TestStatistics(String testName, Long count) {
            this.testName = testName;
            this.count = count;
        }

        // Getters and Setters
        public String getTestName() {
            return testName;
        }

        public void setTestName(String testName) {
            this.testName = testName;
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

 