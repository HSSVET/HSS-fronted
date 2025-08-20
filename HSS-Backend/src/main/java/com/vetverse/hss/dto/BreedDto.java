package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Breed DTO classes
 */
public class BreedDto {

    /**
     * Breed creation/update request DTO
     */
    public static class Request {
        @NotBlank(message = "Breed name cannot be blank")
        @Size(max = 100, message = "Breed name cannot exceed 100 characters")
        private String name;

        @NotNull(message = "Species ID is required")
        private Long speciesId;

        // Constructors
        public Request() {}

        public Request(String name, Long speciesId) {
            this.name = name;
            this.speciesId = speciesId;
        }

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getSpeciesId() {
            return speciesId;
        }

        public void setSpeciesId(Long speciesId) {
            this.speciesId = speciesId;
        }
    }

    /**
     * Breed response DTO
     */
    public static class Response {
        private Long id;
        private String name;
        private SpeciesDto.Basic species;
        private Integer animalCount;

        // Constructors
        public Response() {}

        public Response(Long id, String name, SpeciesDto.Basic species) {
            this.id = id;
            this.name = name;
            this.species = species;
        }

        public Response(Long id, String name, SpeciesDto.Basic species, Integer animalCount) {
            this.id = id;
            this.name = name;
            this.species = species;
            this.animalCount = animalCount;
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

        public SpeciesDto.Basic getSpecies() {
            return species;
        }

        public void setSpecies(SpeciesDto.Basic species) {
            this.species = species;
        }

        public Integer getAnimalCount() {
            return animalCount;
        }

        public void setAnimalCount(Integer animalCount) {
            this.animalCount = animalCount;
        }
    }

    /**
     * Basic breed info DTO for dropdown/selection purposes
     */
    public static class Basic {
        private Long id;
        private String name;
        private Long speciesId;

        // Constructors
        public Basic() {}

        public Basic(Long id, String name, Long speciesId) {
            this.id = id;
            this.name = name;
            this.speciesId = speciesId;
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

        public Long getSpeciesId() {
            return speciesId;
        }

        public void setSpeciesId(Long speciesId) {
            this.speciesId = speciesId;
        }
    }
} 