package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * LabResult DTO classes
 */
public class LabResultDto {

    /**
     * LabResult creation/update request DTO
     */
    public static class Request {
        @NotNull(message = "Lab test ID is required")
        private Long labTestId;

        @NotBlank(message = "Result is required")
        @Size(max = 1000, message = "Result cannot exceed 1000 characters")
        private String result;

        @Size(max = 100, message = "Value cannot exceed 100 characters")
        private String value;

        @Size(max = 50, message = "Unit cannot exceed 50 characters")
        private String unit;

        // Constructors
        public Request() {}

        public Request(Long labTestId, String result, String value, String unit) {
            this.labTestId = labTestId;
            this.result = result;
            this.value = value;
            this.unit = unit;
        }

        // Getters and Setters
        public Long getLabTestId() {
            return labTestId;
        }

        public void setLabTestId(Long labTestId) {
            this.labTestId = labTestId;
        }

        public String getResult() {
            return result;
        }

        public void setResult(String result) {
            this.result = result;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }
    }

    /**
     * LabResult response DTO
     */
    public static class Response {
        private Long id;
        private String result;
        private String value;
        private String unit;
        private String status; // NORMAL, ABNORMAL, HIGH, LOW

        // Constructors
        public Response() {}

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getResult() {
            return result;
        }

        public void setResult(String result) {
            this.result = result;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
} 