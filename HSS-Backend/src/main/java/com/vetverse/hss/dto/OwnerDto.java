package com.vetverse.hss.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Owner DTO classes
 */
public class OwnerDto {

    /**
     * Owner creation/update request DTO
     */
    public static class Request {
        @NotBlank(message = "First name cannot be blank")
        @Size(max = 50, message = "First name cannot exceed 50 characters")
        private String firstName;

        @NotBlank(message = "Last name cannot be blank")
        @Size(max = 50, message = "Last name cannot exceed 50 characters")
        private String lastName;

        @Size(max = 20, message = "Phone number cannot exceed 20 characters")
        private String phone;

        @Email(message = "Email should be valid")
        @Size(max = 100, message = "Email cannot exceed 100 characters")
        private String email;

        @Size(max = 500, message = "Address cannot exceed 500 characters")
        private String address;

        // Constructors
        public Request() {}

        public Request(String firstName, String lastName, String phone, String email, String address) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.phone = phone;
            this.email = email;
            this.address = address;
        }

        // Getters and Setters
        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    /**
     * Owner response DTO
     */
    public static class Response {
        private Long id;
        private String firstName;
        private String lastName;
        private String fullName;
        private String phone;
        private String email;
        private String address;
        private Integer animalCount;

        // Constructors
        public Response() {}

        public Response(Long id, String firstName, String lastName, String phone, String email, String address) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.fullName = firstName + " " + lastName;
            this.phone = phone;
            this.email = email;
            this.address = address;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
            updateFullName();
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
            updateFullName();
        }

        public String getFullName() {
            return fullName;
        }

        private void updateFullName() {
            this.fullName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public Integer getAnimalCount() {
            return animalCount;
        }

        public void setAnimalCount(Integer animalCount) {
            this.animalCount = animalCount;
        }
    }

    /**
     * Basic owner info DTO for dropdown/selection purposes
     */
    public static class Basic {
        private Long id;
        private String fullName;
        private String phone;
        private String email;

        // Constructors
        public Basic() {}

        public Basic(Long id, String firstName, String lastName) {
            this.id = id;
            this.fullName = firstName + " " + lastName;
        }

        public Basic(Long id, String firstName, String lastName, String phone, String email) {
            this.id = id;
            this.fullName = firstName + " " + lastName;
            this.phone = phone;
            this.email = email;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
} 