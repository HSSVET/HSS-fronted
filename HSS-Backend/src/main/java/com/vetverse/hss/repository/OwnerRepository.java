package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Owner Repository
 * Owner entity'si için veri erişim katmanı
 */
@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {

    /**
     * Email adresine göre sahip bulma
     */
    Optional<Owner> findByEmail(String email);

    /**
     * Telefon numarasına göre sahip bulma
     */
    Optional<Owner> findByPhone(String phone);

    /**
     * Email adresinin mevcut olup olmadığını kontrol etme
     */
    boolean existsByEmail(String email);

    /**
     * Telefon numarasının mevcut olup olmadığını kontrol etme
     */
    boolean existsByPhone(String phone);

    /**
     * Ad ile arama (case insensitive)
     */
    @Query("SELECT o FROM Owner o WHERE LOWER(o.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))")
    List<Owner> searchByFirstName(@Param("firstName") String firstName);

    /**
     * Soyad ile arama (case insensitive)
     */
    @Query("SELECT o FROM Owner o WHERE LOWER(o.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))")
    List<Owner> searchByLastName(@Param("lastName") String lastName);

    /**
     * Ad soyad ile arama (case insensitive)
     */
    @Query("SELECT o FROM Owner o WHERE LOWER(CONCAT(o.firstName, ' ', o.lastName)) LIKE LOWER(CONCAT('%', :fullName, '%'))")
    List<Owner> searchByFullName(@Param("fullName") String fullName);

    /**
     * Telefon numarası ile arama
     */
    @Query("SELECT o FROM Owner o WHERE o.phone LIKE CONCAT('%', :phone, '%')")
    List<Owner> searchByPhone(@Param("phone") String phone);

    /**
     * Email ile arama (case insensitive)
     */
    @Query("SELECT o FROM Owner o WHERE LOWER(o.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<Owner> searchByEmail(@Param("email") String email);

    /**
     * Hayvanı olan sahipleri listeleme
     */
    @Query("SELECT DISTINCT o FROM Owner o JOIN o.animals a WHERE a IS NOT NULL")
    List<Owner> findOwnersWithAnimals();

    /**
     * Belirli sayıda hayvanı olan sahipleri bulma
     */
    @Query("SELECT o FROM Owner o WHERE SIZE(o.animals) >= :minAnimalCount")
    List<Owner> findOwnersWithMinimumAnimals(@Param("minAnimalCount") int minAnimalCount);
} 