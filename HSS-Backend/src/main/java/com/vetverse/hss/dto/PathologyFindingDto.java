package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * PathologyFinding DTO classes
 */
public class PathologyFindingDto {

    /**
     * PathologyFinding creation/update request DTO
     */
    public static class Request {
        @NotNull(message = "Animal ID is required")
        private Long animalId;

        @NotNull(message = "Date is required")
        private LocalDate date;

        @NotBlank(message = "Report is required")
        @Size(max = 5000, message = "Report cannot exceed 5000 characters")
        private String report;

        // Constructors
        public Request() {}

        public Request(Long animalId, LocalDate date, String report) {
            this.animalId = animalId;
            this.date = date;
            this.report = report;
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

        public String getReport() {
            return report;
        }

        public void setReport(String report) {
            this.report = report;
        }
    }

    /**
     * PathologyFinding response DTO
     */
    public static class Response {
        private Long id;
        private AnimalDto.Basic animal;
        private LocalDate date;
        private String report;
        private OwnerDto.Basic owner;
        private String reportNo; // Rapor numarası
        private String pathologist; // Patolog hekim adı
        private String sampleNo; // Örnek numarası
        private String sampleType; // Örnek tipi
        private String location; // Lokasyon

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

        public String getReport() {
            return report;
        }

        public void setReport(String report) {
            this.report = report;
        }

        public OwnerDto.Basic getOwner() {
            return owner;
        }

        public void setOwner(OwnerDto.Basic owner) {
            this.owner = owner;
        }

        public String getReportNo() {
            return reportNo;
        }

        public void setReportNo(String reportNo) {
            this.reportNo = reportNo;
        }

        public String getPathologist() {
            return pathologist;
        }

        public void setPathologist(String pathologist) {
            this.pathologist = pathologist;
        }

        public String getSampleNo() {
            return sampleNo;
        }

        public void setSampleNo(String sampleNo) {
            this.sampleNo = sampleNo;
        }

        public String getSampleType() {
            return sampleType;
        }

        public void setSampleType(String sampleType) {
            this.sampleType = sampleType;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }
    }

    /**
     * Basic pathology finding info DTO for listing purposes
     */
    public static class Basic {
        private Long id;
        private String animalName;
        private String ownerName;
        private LocalDate date;
        private String shortReport; // İlk 200 karakter
        private String reportNo;

        // Constructors
        public Basic() {}

        public Basic(Long id, String animalName, String ownerName, LocalDate date, String reportNo) {
            this.id = id;
            this.animalName = animalName;
            this.ownerName = ownerName;
            this.date = date;
            this.reportNo = reportNo;
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

        public String getShortReport() {
            return shortReport;
        }

        public void setShortReport(String shortReport) {
            this.shortReport = shortReport;
        }

        public String getReportNo() {
            return reportNo;
        }

        public void setReportNo(String reportNo) {
            this.reportNo = reportNo;
        }
    }

    /**
     * Pathology report metadata for detailed view
     */
    public static class ReportInfo {
        private String reportNo;
        private String date;
        private String pathologist;
        private String sampleNo;

        // Constructors
        public ReportInfo() {}

        public ReportInfo(String reportNo, String date, String pathologist, String sampleNo) {
            this.reportNo = reportNo;
            this.date = date;
            this.pathologist = pathologist;
            this.sampleNo = sampleNo;
        }

        // Getters and Setters
        public String getReportNo() {
            return reportNo;
        }

        public void setReportNo(String reportNo) {
            this.reportNo = reportNo;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getPathologist() {
            return pathologist;
        }

        public void setPathologist(String pathologist) {
            this.pathologist = pathologist;
        }

        public String getSampleNo() {
            return sampleNo;
        }

        public void setSampleNo(String sampleNo) {
            this.sampleNo = sampleNo;
        }
    }

    /**
     * Sample information for pathology
     */
    public static class SampleInfo {
        private String sampleType;
        private String location;

        // Constructors
        public SampleInfo() {}

        public SampleInfo(String sampleType, String location) {
            this.sampleType = sampleType;
            this.location = location;
        }

        // Getters and Setters
        public String getSampleType() {
            return sampleType;
        }

        public void setSampleType(String sampleType) {
            this.sampleType = sampleType;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }
    }
} 