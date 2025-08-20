package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Document Entity
 * Represents documents (dokuman tablosu)
 */
@Entity
@Table(name = "dokuman")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dokuman_id")
    private Long id;

    @Column(name = "baslik")
    private String title;

    @Column(name = "icerik", columnDefinition = "TEXT")
    private String content;

    @Column(name = "tarih")
    private LocalDate date;

    // Many-to-One relationship with Owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sahip_id", referencedColumnName = "sahip_id")
    @JsonBackReference
    private Owner owner;

    // Many-to-One relationship with Animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hayvan_id", referencedColumnName = "hayvan_id")
    @JsonBackReference
    private Animal animal;

    // Constructors
    public Document() {}

    public Document(String title, String content, LocalDate date, Owner owner, Animal animal) {
        this.title = title;
        this.content = content;
        this.date = date;
        this.owner = owner;
        this.animal = animal;
    }

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    @Override
    public String toString() {
        return "Document{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", date=" + date +
                '}';
    }
} 