package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Breed;
import com.vetverse.hss.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Breed Repository
 * Breed entity'si için veri erişim katmanı
 */
@Repository
public interface BreedRepository extends JpaRepository<Breed, Long> {

    /**
     * İsime göre ırk bulma
     */
    Optional<Breed> findByName(String name);

    /**
     * İsimin mevcut olup olmadığını kontrol etme
     */
    boolean existsByName(String name);

    /**
     * Belirli bir türe ait ırkları listeleme
     */
    List<Breed> findBySpecies(Species species);

    /**
     * Tür ID'sine göre ırkları listeleme
     */
    @Query("SELECT b FROM Breed b WHERE b.species.id = :speciesId")
    List<Breed> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * İsim ile arama (case insensitive)
     */
    @Query("SELECT b FROM Breed b WHERE LOWER(b.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Breed> searchByName(@Param("name") String name);

    /**
     * Belirli bir türe ait ırk ismi ile arama
     */
    @Query("SELECT b FROM Breed b WHERE b.species.id = :speciesId AND LOWER(b.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Breed> searchByNameAndSpecies(@Param("name") String name, @Param("speciesId") Long speciesId);

    /**
     * Aktif hayvanları olan ırkları listeleme
     */
    @Query("SELECT DISTINCT b FROM Breed b JOIN b.animals a WHERE a IS NOT NULL")
    List<Breed> findBreedsWithAnimals();
} 