package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Species DTO classes
 */
public class SpeciesDto {

    /**
     * Species creation/update request DTO
     */
    public static class Request {
        @NotBlank(message = "Species name cannot be blank")
        @Size(max = 100, message = "Species name cannot exceed 100 characters")
        private String name;

        // Constructors
        public Request() {}

        public Request(String name) {
            this.name = name;
        }

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    /**
     * Species response DTO
     */
    public static class Response {
        private Long id;
        private String name;
        private Integer breedCount;
        private Integer animalCount;

        // Constructors
        public Response() {}

        public Response(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Response(Long id, String name, Integer breedCount, Integer animalCount) {
            this.id = id;
            this.name = name;
            this.breedCount = breedCount;
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

        public Integer getBreedCount() {
            return breedCount;
        }

        public void setBreedCount(Integer breedCount) {
            this.breedCount = breedCount;
        }

        public Integer getAnimalCount() {
            return animalCount;
        }

        public void setAnimalCount(Integer animalCount) {
            this.animalCount = animalCount;
        }
    }

    /**
     * Basic species info DTO for dropdown/selection purposes
     */
    public static class Basic {
        private Long id;
        private String name;

        // Constructors
        public Basic() {}

        public Basic(Long id, String name) {
            this.id = id;
            this.name = name;
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
    }
} 