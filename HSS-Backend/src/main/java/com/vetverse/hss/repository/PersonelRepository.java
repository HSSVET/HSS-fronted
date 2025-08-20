package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Personel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Personel Repository
 * Personel entity'si için veri erişim katmanı
 */
@Repository
public interface PersonelRepository extends JpaRepository<Personel, Long> {

    /**
     * Email adresine göre personel bulma
     */
    Optional<Personel> findByEposta(String eposta);

    /**
     * Keycloak User ID'sine göre personel bulma
     */
    Optional<Personel> findByKeycloakUserId(String keycloakUserId);

    /**
     * Aktif personelleri listeleme
     */
    List<Personel> findByAktifTrue();

    /**
     * Belirli role sahip personelleri listeleme
     */
    @Query("SELECT p FROM Personel p JOIN p.roller r WHERE r.ad = :roleName AND p.aktif = true")
    List<Personel> findByRoleName(@Param("roleName") String roleName);

    /**
     * Email adresinin mevcut olup olmadığını kontrol etme
     */
    boolean existsByEposta(String eposta);

    /**
     * Keycloak User ID'sinin mevcut olup olmadığını kontrol etme
     */
    boolean existsByKeycloakUserId(String keycloakUserId);

    /**
     * Senkronizasyon için Keycloak User ID'si olmayan personelleri bulma
     */
    @Query("SELECT p FROM Personel p WHERE p.keycloakUserId IS NULL")
    List<Personel> findPersonelWithoutKeycloakId();

    /**
     * Ad soyad ile arama (case insensitive)
     */
    @Query("SELECT p FROM Personel p WHERE LOWER(p.adSoyad) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Personel> searchByAdSoyad(@Param("searchTerm") String searchTerm);
} 