package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

/**
 * Owner Entity
 * Represents animal owners (sahip tablosu)
 */
@Entity
@Table(name = "sahip")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sahip_id")
    private Long id;

    @NotBlank
    @Column(name = "ad")
    private String firstName;

    @NotBlank
    @Column(name = "soyad")
    private String lastName;

    @Column(name = "telefon")
    private String phone;

    @Email
    @Column(name = "e_posta")
    private String email;

    @Column(name = "adres", columnDefinition = "TEXT")
    private String address;

    // One-to-Many relationship with Animal
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Animal> animals = new HashSet<>();

    // One-to-Many relationship with Invoice
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Invoice> invoices = new HashSet<>();

    // One-to-Many relationship with Document
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Document> documents = new HashSet<>();

    // One-to-Many relationship with Communication
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Communication> communications = new HashSet<>();

    // Constructors
    public Owner() {}

    public Owner(String firstName, String lastName, String phone, String email, String address) {
        this.firstName = firstName;
        this.lastName = lastName;
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

    public Set<Animal> getAnimals() {
        return animals;
    }

    public void setAnimals(Set<Animal> animals) {
        this.animals = animals;
    }

    public Set<Invoice> getInvoices() {
        return invoices;
    }

    public void setInvoices(Set<Invoice> invoices) {
        this.invoices = invoices;
    }

    public Set<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(Set<Document> documents) {
        this.documents = documents;
    }

    public Set<Communication> getCommunications() {
        return communications;
    }

    public void setCommunications(Set<Communication> communications) {
        this.communications = communications;
    }

    // Utility methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Override
    public String toString() {
        return "Owner{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
} 