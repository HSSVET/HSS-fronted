package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Appointment Entity
 * Represents appointment records (randevu tablosu)
 */
@Entity
@Table(name = "randevu")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "randevu_id")
    private Long id;

    @Column(name = "tarih_saat")
    private LocalDateTime dateTime;

    @Column(name = "konu", columnDefinition = "TEXT")
    private String subject;

    @Column(name = "veteriner_id")
    private Long veterinarianId;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // One-to-Many relationship with Reminder
    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Reminder> reminders = new HashSet<>();

    // Constructors
    public Appointment() {}

    public Appointment(LocalDateTime dateTime, String subject, Long veterinarianId, Animal animal) {
        this.dateTime = dateTime;
        this.subject = subject;
        this.veterinarianId = veterinarianId;
        this.animal = animal;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public Set<Reminder> getReminders() {
        return reminders;
    }

    public void setReminders(Set<Reminder> reminders) {
        this.reminders = reminders;
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "id=" + id +
                ", dateTime=" + dateTime +
                ", subject='" + subject + '\'' +
                ", veterinarianId=" + veterinarianId +
                '}';
    }
} 