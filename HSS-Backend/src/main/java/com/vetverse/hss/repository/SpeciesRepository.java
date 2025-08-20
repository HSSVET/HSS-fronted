package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Species Repository
 * Species entity'si için veri erişim katmanı
 */
@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {

    /**
     * İsime göre tür bulma
     */
    Optional<Species> findByName(String name);

    /**
     * İsimin mevcut olup olmadığını kontrol etme
     */
    boolean existsByName(String name);

    /**
     * İsim ile arama (case insensitive)
     */
    @Query("SELECT s FROM Species s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Species> searchByName(@Param("name") String name);

    /**
     * Aktif hayvanları olan türleri listeleme
     */
    @Query("SELECT DISTINCT s FROM Species s JOIN s.animals a WHERE a IS NOT NULL")
    List<Species> findSpeciesWithAnimals();

    /**
     * Belirli sayıda ırkı olan türleri bulma
     */
    @Query("SELECT s FROM Species s WHERE SIZE(s.breeds) >= :minBreedCount")
    List<Species> findSpeciesWithMinimumBreeds(@Param("minBreedCount") int minBreedCount);
} 