package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Rol Repository
 * Rol entity'si için veri erişim katmanı
 */
@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {

    /**
     * Rol adına göre rol bulma
     */
    Optional<Rol> findByAd(String ad);

    /**
     * Rol adının mevcut olup olmadığını kontrol etme
     */
    boolean existsByAd(String ad);
} 