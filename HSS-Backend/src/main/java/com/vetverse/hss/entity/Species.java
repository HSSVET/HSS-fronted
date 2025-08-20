package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

/**
 * Species Entity
 * Represents animal species (tur tablosu)
 */
@Entity
@Table(name = "tur")
public class Species {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tur_id")
    private Long id;

    @NotBlank
    @Column(name = "ad", nullable = false)
    private String name;

    // One-to-Many relationship with Breed
    @OneToMany(mappedBy = "species", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Breed> breeds = new HashSet<>();

    // One-to-Many relationship with Animal
    @OneToMany(mappedBy = "species", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Animal> animals = new HashSet<>();

    // Constructors
    public Species() {}

    public Species(String name) {
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

    public Set<Breed> getBreeds() {
        return breeds;
    }

    public void setBreeds(Set<Breed> breeds) {
        this.breeds = breeds;
    }

    public Set<Animal> getAnimals() {
        return animals;
    }

    public void setAnimals(Set<Animal> animals) {
        this.animals = animals;
    }

    // Utility methods
    public void addBreed(Breed breed) {
        this.breeds.add(breed);
        breed.setSpecies(this);
    }

    public void removeBreed(Breed breed) {
        this.breeds.remove(breed);
        breed.setSpecies(null);
    }

    @Override
    public String toString() {
        return "Species{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
} 