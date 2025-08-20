package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.entity.Breed;
import com.vetverse.hss.entity.Owner;
import com.vetverse.hss.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Animal Repository
 * Animal entity'si için veri erişim katmanı
 */
@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    /**
     * İsime göre hayvan bulma
     */
    List<Animal> findByName(String name);

    /**
     * Mikroçip numarasına göre hayvan bulma
     */
    Optional<Animal> findByMicrochipNumber(String microchipNumber);

    /**
     * Mikroçip numarasının mevcut olup olmadığını kontrol etme
     */
    boolean existsByMicrochipNumber(String microchipNumber);

    /**
     * Belirli bir sahibe ait hayvanları listeleme
     */
    List<Animal> findByOwner(Owner owner);

    /**
     * Sahip ID'sine göre hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE a.owner.id = :ownerId")
    List<Animal> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Belirli bir türe ait hayvanları listeleme
     */
    List<Animal> findBySpecies(Species species);

    /**
     * Tür ID'sine göre hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE a.species.id = :speciesId")
    List<Animal> findBySpeciesId(@Param("speciesId") Long speciesId);

    /**
     * Belirli bir ırka ait hayvanları listeleme
     */
    List<Animal> findByBreed(Breed breed);

    /**
     * Irk ID'sine göre hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE a.breed.id = :breedId")
    List<Animal> findByBreedId(@Param("breedId") Long breedId);

    /**
     * Cinsiyete göre hayvanları listeleme
     */
    List<Animal> findByGender(String gender);

    /**
     * Belirli bir tarih aralığında doğan hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE a.birthDate BETWEEN :startDate AND :endDate")
    List<Animal> findByBirthDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * İsim ile arama (case insensitive)
     */
    @Query("SELECT a FROM Animal a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Animal> searchByName(@Param("name") String name);

    /**
     * Sahip adı ile hayvan arama
     */
    @Query("SELECT a FROM Animal a WHERE LOWER(CONCAT(a.owner.firstName, ' ', a.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<Animal> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Mikroçip numarası ile arama
     */
    @Query("SELECT a FROM Animal a WHERE a.microchipNumber LIKE CONCAT('%', :microchip, '%')")
    List<Animal> searchByMicrochip(@Param("microchip") String microchip);

    /**
     * Alerji bilgisi olan hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE a.allergies IS NOT NULL AND a.allergies != ''")
    List<Animal> findAnimalsWithAllergies();

    /**
     * Kronik hastalığı olan hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE a.chronicDiseases IS NOT NULL AND a.chronicDiseases != ''")
    List<Animal> findAnimalsWithChronicDiseases();

    /**
     * Belirli yaş aralığındaki hayvanları bulma
     */
    @Query("SELECT a FROM Animal a WHERE EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM a.birthDate) BETWEEN :minAge AND :maxAge")
    List<Animal> findByAgeRange(@Param("minAge") int minAge, @Param("maxAge") int maxAge);

    /**
     * Bu ay doğum günü olan hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE EXTRACT(MONTH FROM a.birthDate) = EXTRACT(MONTH FROM CURRENT_DATE)")
    List<Animal> findAnimalsWithBirthdayThisMonth();

    /**
     * Bugün doğum günü olan hayvanları listeleme
     */
    @Query("SELECT a FROM Animal a WHERE EXTRACT(MONTH FROM a.birthDate) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(DAY FROM a.birthDate) = EXTRACT(DAY FROM CURRENT_DATE)")
    List<Animal> findAnimalsWithBirthdayToday();
} 