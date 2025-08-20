package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Animal DTO classes
 */
public class AnimalDto {

    /**
     * Animal creation/update request DTO
     */
    public static class Request {
        @NotBlank(message = "Animal name cannot be blank")
        @Size(max = 100, message = "Animal name cannot exceed 100 characters")
        private String name;

        @NotNull(message = "Owner ID is required")
        private Long ownerId;

        @NotNull(message = "Species ID is required")
        private Long speciesId;

        private Long breedId;

        @Size(max = 10, message = "Gender cannot exceed 10 characters")
        private String gender;

        private LocalDate birthDate;

        private BigDecimal weight;

        @Size(max = 50, message = "Color cannot exceed 50 characters")
        private String color;

        @Size(max = 50, message = "Microchip number cannot exceed 50 characters")
        private String microchipNumber;

        @Size(max = 1000, message = "Allergies cannot exceed 1000 characters")
        private String allergies;

        @Size(max = 1000, message = "Chronic diseases cannot exceed 1000 characters")
        private String chronicDiseases;

        @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
        private String notes;

        // Constructors
        public Request() {}

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getOwnerId() {
            return ownerId;
        }

        public void setOwnerId(Long ownerId) {
            this.ownerId = ownerId;
        }

        public Long getSpeciesId() {
            return speciesId;
        }

        public void setSpeciesId(Long speciesId) {
            this.speciesId = speciesId;
        }

        public Long getBreedId() {
            return breedId;
        }

        public void setBreedId(Long breedId) {
            this.breedId = breedId;
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
    }

    /**
     * Animal response DTO
     */
    public static class Response {
        private Long id;
        private String name;
        private OwnerDto.Basic owner;
        private SpeciesDto.Basic species;
        private BreedDto.Basic breed;
        private String gender;
        private LocalDate birthDate;
        private Integer ageInYears;
        private BigDecimal weight;
        private String color;
        private String microchipNumber;
        private String allergies;
        private String chronicDiseases;
        private String notes;

        // Constructors
        public Response() {}

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

        public OwnerDto.Basic getOwner() {
            return owner;
        }

        public void setOwner(OwnerDto.Basic owner) {
            this.owner = owner;
        }

        public SpeciesDto.Basic getSpecies() {
            return species;
        }

        public void setSpecies(SpeciesDto.Basic species) {
            this.species = species;
        }

        public BreedDto.Basic getBreed() {
            return breed;
        }

        public void setBreed(BreedDto.Basic breed) {
            this.breed = breed;
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

        public Integer getAgeInYears() {
            return ageInYears;
        }

        public void setAgeInYears(Integer ageInYears) {
            this.ageInYears = ageInYears;
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
    }

    /**
     * Basic animal info DTO for dropdown/selection purposes
     */
    public static class Basic {
        private Long id;
        private String name;
        private String ownerName;
        private String speciesName;
        private String breedName;
        private String microchipNumber;

        // Constructors
        public Basic() {}

        public Basic(Long id, String name, String ownerName, String speciesName) {
            this.id = id;
            this.name = name;
            this.ownerName = ownerName;
            this.speciesName = speciesName;
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

        public String getOwnerName() {
            return ownerName;
        }

        public void setOwnerName(String ownerName) {
            this.ownerName = ownerName;
        }

        public String getSpeciesName() {
            return speciesName;
        }

        public void setSpeciesName(String speciesName) {
            this.speciesName = speciesName;
        }

        public String getBreedName() {
            return breedName;
        }

        public void setBreedName(String breedName) {
            this.breedName = breedName;
        }

        public String getMicrochipNumber() {
            return microchipNumber;
        }

        public void setMicrochipNumber(String microchipNumber) {
            this.microchipNumber = microchipNumber;
        }
    }
} 