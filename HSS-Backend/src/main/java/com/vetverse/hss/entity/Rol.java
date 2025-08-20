package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

/**
 * Rol Entity
 * Kullanıcı rollerini temsil eder (ADMIN, VETERINER, SEKRETER, TEKNISYEN)
 */
@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rol_id")
    private Long id;

    @NotBlank
    @Column(name = "ad", nullable = false, unique = true, length = 50)
    private String ad;

    @Column(name = "aciklama", length = 200)
    private String aciklama;

    // Personel ilişkisi - Many-to-Many
    @ManyToMany(mappedBy = "roller")
    @JsonBackReference
    private Set<Personel> personeller = new HashSet<>();

    // Constructors
    public Rol() {}

    public Rol(String ad, String aciklama) {
        this.ad = ad;
        this.aciklama = aciklama;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAd() {
        return ad;
    }

    public void setAd(String ad) {
        this.ad = ad;
    }

    public String getAciklama() {
        return aciklama;
    }

    public void setAciklama(String aciklama) {
        this.aciklama = aciklama;
    }

    public Set<Personel> getPersoneller() {
        return personeller;
    }

    public void setPersoneller(Set<Personel> personeller) {
        this.personeller = personeller;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Rol rol = (Rol) o;
        return ad != null ? ad.equals(rol.ad) : rol.ad == null;
    }

    @Override
    public int hashCode() {
        return ad != null ? ad.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Rol{" +
                "id=" + id +
                ", ad='" + ad + '\'' +
                ", aciklama='" + aciklama + '\'' +
                '}';
    }
} 