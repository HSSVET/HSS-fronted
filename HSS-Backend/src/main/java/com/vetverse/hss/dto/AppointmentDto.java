package com.vetverse.hss.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Appointment DTO classes
 */
public class AppointmentDto {

    /**
     * Appointment creation/update request DTO
     */
    public static class Request {
        @NotNull(message = "Animal ID is required")
        private Long animalId;

        @NotNull(message = "Date and time is required")
        private LocalDateTime dateTime;

        @Size(max = 500, message = "Subject cannot exceed 500 characters")
        private String subject;

        private Long veterinarianId;

        // Constructors
        public Request() {}

        public Request(Long animalId, LocalDateTime dateTime, String subject, Long veterinarianId) {
            this.animalId = animalId;
            this.dateTime = dateTime;
            this.subject = subject;
            this.veterinarianId = veterinarianId;
        }

        // Getters and Setters
        public Long getAnimalId() {
            return animalId;
        }

        public void setAnimalId(Long animalId) {
            this.animalId = animalId;
        }

        public LocalDateTime getDateTime() {
            return dateTime;
        }

        public void setDateTime(LocalDateTime dateTime) {
            this.dateTime = dateTime;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public Long getVeterinarianId() {
            return veterinarianId;
        }

        public void setVeterinarianId(Long veterinarianId) {
            this.veterinarianId = veterinarianId;
        }
    }

    /**
     * Appointment response DTO
     */
    public static class Response {
        private Long id;
        private AnimalDto.Basic animal;
        private LocalDateTime dateTime;
        private String subject;
        private Long veterinarianId;
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

        public LocalDateTime getDateTime() {
            return dateTime;
        }

        public void setDateTime(LocalDateTime dateTime) {
            this.dateTime = dateTime;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public Long getVeterinarianId() {
            return veterinarianId;
        }

        public void setVeterinarianId(Long veterinarianId) {
            this.veterinarianId = veterinarianId;
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
     * Basic appointment info DTO for calendar/listing purposes
     */
    public static class Basic {
        private Long id;
        private String animalName;
        private String ownerName;
        private LocalDateTime dateTime;
        private String subject;
        private Long veterinarianId;

        // Constructors
        public Basic() {}

        public Basic(Long id, String animalName, String ownerName, LocalDateTime dateTime, String subject) {
            this.id = id;
            this.animalName = animalName;
            this.ownerName = ownerName;
            this.dateTime = dateTime;
            this.subject = subject;
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

        public LocalDateTime getDateTime() {
            return dateTime;
        }

        public void setDateTime(LocalDateTime dateTime) {
            this.dateTime = dateTime;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public Long getVeterinarianId() {
            return veterinarianId;
        }

        public void setVeterinarianId(Long veterinarianId) {
            this.veterinarianId = veterinarianId;
        }
    }

    /**
     * Calendar view DTO for appointment calendar
     */
    public static class CalendarView {
        private Long id;
        private String title;
        private LocalDateTime start;
        private LocalDateTime end;
        private String backgroundColor;
        private String textColor;
        private AppointmentMeta extendedProps;

        // Constructors
        public CalendarView() {}

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public LocalDateTime getStart() {
            return start;
        }

        public void setStart(LocalDateTime start) {
            this.start = start;
        }

        public LocalDateTime getEnd() {
            return end;
        }

        public void setEnd(LocalDateTime end) {
            this.end = end;
        }

        public String getBackgroundColor() {
            return backgroundColor;
        }

        public void setBackgroundColor(String backgroundColor) {
            this.backgroundColor = backgroundColor;
        }

        public String getTextColor() {
            return textColor;
        }

        public void setTextColor(String textColor) {
            this.textColor = textColor;
        }

        public AppointmentMeta getExtendedProps() {
            return extendedProps;
        }

        public void setExtendedProps(AppointmentMeta extendedProps) {
            this.extendedProps = extendedProps;
        }
    }

    /**
     * Appointment metadata for calendar
     */
    public static class AppointmentMeta {
        private String animalName;
        private String ownerName;
        private String veterinarianName;
        private String subject;

        // Constructors
        public AppointmentMeta() {}

        // Getters and Setters
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

        public String getVeterinarianName() {
            return veterinarianName;
        }

        public void setVeterinarianName(String veterinarianName) {
            this.veterinarianName = veterinarianName;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }
    }
} 