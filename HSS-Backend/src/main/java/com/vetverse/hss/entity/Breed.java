package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

/**
 * Breed Entity
 * Represents animal breeds (ırk tablosu)
 */
@Entity
@Table(name = "ırk")
public class Breed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ırk_id")
    private Long id;

    @NotBlank
    @Column(name = "ad", nullable = false)
    private String name;

    // Many-to-One relationship with Species
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tur_id", referencedColumnName = "tur_id")
    @JsonBackReference
    private Species species;

    // One-to-Many relationship with Animal
    @OneToMany(mappedBy = "breed", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Animal> animals = new HashSet<>();

    // Constructors
    public Breed() {}

    public Breed(String name, Species species) {
        this.name = name;
        this.species = species;
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

    public Species getSpecies() {
        return species;
    }

    public void setSpecies(Species species) {
        this.species = species;
    }

    public Set<Animal> getAnimals() {
        return animals;
    }

    public void setAnimals(Set<Animal> animals) {
        this.animals = animals;
    }

    // Utility methods
    public void addAnimal(Animal animal) {
        this.animals.add(animal);
        animal.setBreed(this);
    }

    public void removeAnimal(Animal animal) {
        this.animals.remove(animal);
        animal.setBreed(null);
    }

    @Override
    public String toString() {
        return "Breed{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", speciesId=" + (species != null ? species.getId() : null) +
                '}';
    }
} 