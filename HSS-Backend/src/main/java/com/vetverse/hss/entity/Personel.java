package com.vetverse.hss.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Personel Entity
 * Keycloak kullanıcıları ile senkronize edilen personel bilgileri
 */
@Entity
@Table(name = "personel")
public class Personel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "personel_id")
    private Long id;

    @NotBlank
    @Column(name = "adsoyad", nullable = false, length = 200)
    private String adSoyad;

    @Email
    @NotBlank
    @Column(name = "eposta", nullable = false, unique = true, length = 100)
    private String eposta;

    @Column(name = "telefon", length = 20)
    private String telefon;

    @NotNull
    @Column(name = "ise_baslama_tarihi", nullable = false)
    private LocalDate iseBaslamaTarihi;

    @NotNull
    @Column(name = "aktif", nullable = false)
    private Boolean aktif = true;

    // Keycloak senkronizasyonu için ek alanlar
    @Column(name = "keycloak_user_id", unique = true, length = 50)
    private String keycloakUserId;

    @Column(name = "son_senkronizasyon")
    private LocalDateTime sonSenkronizasyon;

    @Column(name = "olusturma_tarihi")
    private LocalDateTime olusturmaTarihi;

    @Column(name = "guncelleme_tarihi")
    private LocalDateTime guncellemeTarihi;

    // Roller - Many-to-Many ilişki
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "personel_rol",
        joinColumns = @JoinColumn(name = "personel_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    @JsonManagedReference
    private Set<Rol> roller = new HashSet<>();

    // Constructors
    public Personel() {}

    public Personel(String adSoyad, String eposta, String telefon, LocalDate iseBaslamaTarihi) {
        this.adSoyad = adSoyad;
        this.eposta = eposta;
        this.telefon = telefon;
        this.iseBaslamaTarihi = iseBaslamaTarihi;
        this.aktif = true;
        this.olusturmaTarihi = LocalDateTime.now();
    }

    // JPA Lifecycle methods
    @PrePersist
    protected void onCreate() {
        olusturmaTarihi = LocalDateTime.now();
        guncellemeTarihi = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        guncellemeTarihi = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdSoyad() {
        return adSoyad;
    }

    public void setAdSoyad(String adSoyad) {
        this.adSoyad = adSoyad;
    }

    public String getEposta() {
        return eposta;
    }

    public void setEposta(String eposta) {
        this.eposta = eposta;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public LocalDate getIseBaslamaTarihi() {
        return iseBaslamaTarihi;
    }

    public void setIseBaslamaTarihi(LocalDate iseBaslamaTarihi) {
        this.iseBaslamaTarihi = iseBaslamaTarihi;
    }

    public Boolean getAktif() {
        return aktif;
    }

    public void setAktif(Boolean aktif) {
        this.aktif = aktif;
    }

    public String getKeycloakUserId() {
        return keycloakUserId;
    }

    public void setKeycloakUserId(String keycloakUserId) {
        this.keycloakUserId = keycloakUserId;
    }

    public LocalDateTime getSonSenkronizasyon() {
        return sonSenkronizasyon;
    }

    public void setSonSenkronizasyon(LocalDateTime sonSenkronizasyon) {
        this.sonSenkronizasyon = sonSenkronizasyon;
    }

    public LocalDateTime getOlusturmaTarihi() {
        return olusturmaTarihi;
    }

    public void setOlusturmaTarihi(LocalDateTime olusturmaTarihi) {
        this.olusturmaTarihi = olusturmaTarihi;
    }

    public LocalDateTime getGuncellemeTarihi() {
        return guncellemeTarihi;
    }

    public void setGuncellemeTarihi(LocalDateTime guncellemeTarihi) {
        this.guncellemeTarihi = guncellemeTarihi;
    }

    public Set<Rol> getRoller() {
        return roller;
    }

    public void setRoller(Set<Rol> roller) {
        this.roller = roller;
    }

    // Utility methods
    public void addRol(Rol rol) {
        this.roller.add(rol);
    }

    public void removeRol(Rol rol) {
        this.roller.remove(rol);
    }

    public boolean hasRole(String roleName) {
        return roller.stream().anyMatch(rol -> rol.getAd().equals(roleName));
    }

    @Override
    public String toString() {
        return "Personel{" +
                "id=" + id +
                ", adSoyad='" + adSoyad + '\'' +
                ", eposta='" + eposta + '\'' +
                ", aktif=" + aktif +
                ", keycloakUserId='" + keycloakUserId + '\'' +
                '}';
    }
} 