package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * RadiologicalImaging DTO classes
 */
public class RadiologicalImagingDto {

    /**
     * RadiologicalImaging creation/update request DTO
     */
    public static class Request {
        @NotNull(message = "Animal ID is required")
        private Long animalId;

        @NotNull(message = "Date is required")
        private LocalDate date;

        @NotBlank(message = "Type is required")
        @Size(max = 100, message = "Type cannot exceed 100 characters")
        private String type;

        @Size(max = 2000, message = "Comment cannot exceed 2000 characters")
        private String comment;

        @Size(max = 500, message = "Image URL cannot exceed 500 characters")
        private String imageUrl;

        // Constructors
        public Request() {}

        public Request(Long animalId, LocalDate date, String type, String comment, String imageUrl) {
            this.animalId = animalId;
            this.date = date;
            this.type = type;
            this.comment = comment;
            this.imageUrl = imageUrl;
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

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
    }

    /**
     * RadiologicalImaging response DTO
     */
    public static class Response {
        private Long id;
        private AnimalDto.Basic animal;
        private LocalDate date;
        private String type;
        private String comment;
        private String imageUrl;
        private OwnerDto.Basic owner;
        private String region; // Görüntülenen bölge
        private String findings; // Bulgular

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

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public OwnerDto.Basic getOwner() {
            return owner;
        }

        public void setOwner(OwnerDto.Basic owner) {
            this.owner = owner;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getFindings() {
            return findings;
        }

        public void setFindings(String findings) {
            this.findings = findings;
        }
    }

    /**
     * Basic radiological imaging info DTO for listing purposes
     */
    public static class Basic {
        private Long id;
        private String animalName;
        private String ownerName;
        private LocalDate date;
        private String type;
        private String region;
        private boolean hasImage;

        // Constructors
        public Basic() {}

        public Basic(Long id, String animalName, String ownerName, LocalDate date, String type) {
            this.id = id;
            this.animalName = animalName;
            this.ownerName = ownerName;
            this.date = date;
            this.type = type;
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

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public boolean isHasImage() {
            return hasImage;
        }

        public void setHasImage(boolean hasImage) {
            this.hasImage = hasImage;
        }
    }

    /**
     * Imaging type statistics DTO
     */
    public static class ImagingTypeStatistics {
        private String type;
        private Long count;
        private Double percentage;

        // Constructors
        public ImagingTypeStatistics() {}

        public ImagingTypeStatistics(String type, Long count) {
            this.type = type;
            this.count = count;
        }

        // Getters and Setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
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

    /**
     * Imaging record DTO for frontend use
     */
    public static class ImagingRecord {
        private Long id;
        private String date;
        private String type;
        private String region;
        private String findings;
        private String notes;
        private String imageUrl;

        // Constructors
        public ImagingRecord() {}

        public ImagingRecord(Long id, String date, String type, String region, String findings, String notes, String imageUrl) {
            this.id = id;
            this.date = date;
            this.type = type;
            this.region = region;
            this.findings = findings;
            this.notes = notes;
            this.imageUrl = imageUrl;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getFindings() {
            return findings;
        }

        public void setFindings(String findings) {
            this.findings = findings;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
    }
} 