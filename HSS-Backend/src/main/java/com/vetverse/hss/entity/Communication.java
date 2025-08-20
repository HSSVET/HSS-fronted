package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Communication Entity
 * Represents communication records (iletisim tablosu)
 */
@Entity
@Table(name = "iletisim")
public class Communication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iletisim_id")
    private Long id;

    @Column(name = "konu")
    private String subject;

    @Column(name = "mesaj", columnDefinition = "TEXT")
    private String message;

    @Column(name = "tarih")
    private LocalDateTime date;

    // Many-to-One relationship with Owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sahip_id", referencedColumnName = "sahip_id")
    @JsonBackReference
    private Owner owner;

    // Constructors
    public Communication() {}

    public Communication(String subject, String message, LocalDateTime date, Owner owner) {
        this.subject = subject;
        this.message = message;
        this.date = date;
        this.owner = owner;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    @Override
    public String toString() {
        return "Communication{" +
                "id=" + id +
                ", subject='" + subject + '\'' +
                ", date=" + date +
                '}';
    }
} 