package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * RadiologicalImaging Entity
 * Represents radiological imaging records (radyolojik_goruntuleme tablosu)
 */
@Entity
@Table(name = "radyolojik_goruntuleme")
public class RadiologicalImaging {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goruntu_id")
    private Long id;

    @Column(name = "tarih")
    private LocalDate date;

    @Column(name = "tur")
    private String type;

    @Column(name = "goruntu_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "yorum", columnDefinition = "TEXT")
    private String comment;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // Constructors
    public RadiologicalImaging() {}

    public RadiologicalImaging(LocalDate date, String type, String imageUrl, String comment, Animal animal) {
        this.date = date;
        this.type = type;
        this.imageUrl = imageUrl;
        this.comment = comment;
        this.animal = animal;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    @Override
    public String toString() {
        return "RadiologicalImaging{" +
                "id=" + id +
                ", date=" + date +
                ", type='" + type + '\'' +
                ", comment='" + comment + '\'' +
                '}';
    }
} 