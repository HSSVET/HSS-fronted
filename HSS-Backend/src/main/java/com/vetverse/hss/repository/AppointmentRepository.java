package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Appointment;
import com.vetverse.hss.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Appointment Repository
 * Appointment entity'si için veri erişim katmanı
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Hayvana göre randevuları listeleme
     */
    List<Appointment> findByAnimal(Animal animal);

    /**
     * Hayvan ID'sine göre randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE a.animal.id = :animalId")
    List<Appointment> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Veteriner ID'sine göre randevuları listeleme
     */
    List<Appointment> findByVeterinarianId(Long veterinarianId);

    /**
     * Belirli tarih aralığındaki randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE a.dateTime BETWEEN :startDate AND :endDate ORDER BY a.dateTime")
    List<Appointment> findByDateTimeBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Belirli tarihteki randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE CAST(a.dateTime AS date) = :date ORDER BY a.dateTime")
    List<Appointment> findByDate(@Param("date") LocalDate date);

    /**
     * Veteriner ve tarih aralığına göre randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE a.veterinarianId = :veterinarianId AND a.dateTime BETWEEN :startDate AND :endDate ORDER BY a.dateTime")
    List<Appointment> findByVeterinarianIdAndDateTimeBetween(@Param("veterinarianId") Long veterinarianId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Konu ile arama
     */
    @Query("SELECT a FROM Appointment a WHERE LOWER(a.subject) LIKE LOWER(CONCAT('%', :subject, '%'))")
    List<Appointment> searchBySubject(@Param("subject") String subject);

    /**
     * Hayvan adı ile randevu arama
     */
    @Query("SELECT a FROM Appointment a WHERE LOWER(a.animal.name) LIKE LOWER(CONCAT('%', :animalName, '%'))")
    List<Appointment> searchByAnimalName(@Param("animalName") String animalName);

    /**
     * Sahip adı ile randevu arama
     */
    @Query("SELECT a FROM Appointment a WHERE LOWER(CONCAT(a.animal.owner.firstName, ' ', a.animal.owner.lastName)) LIKE LOWER(CONCAT('%', :ownerName, '%'))")
    List<Appointment> searchByOwnerName(@Param("ownerName") String ownerName);

    /**
     * Bugünkü randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE CAST(a.dateTime AS date) = CURRENT_DATE ORDER BY a.dateTime")
    List<Appointment> findTodayAppointments();

    /**
     * Gelecek hafta randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE a.dateTime BETWEEN CURRENT_TIMESTAMP AND :nextWeek ORDER BY a.dateTime")
    List<Appointment> findUpcomingAppointments(@Param("nextWeek") LocalDateTime nextWeek);

    /**
     * Geçmiş randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE a.dateTime < CURRENT_TIMESTAMP ORDER BY a.dateTime DESC")
    List<Appointment> findPastAppointments();

    /**
     * Belirli saat aralığında randevu çakışması kontrolü
     */
    @Query(value = "SELECT COUNT(*) FROM randevu a WHERE a.veteriner_id = :veterinarianId AND " +
           "a.tarih_saat < :endTime AND " +
           "(a.tarih_saat + INTERVAL '1 hour') > :startTime", nativeQuery = true)
    Long countConflictingAppointments(@Param("veterinarianId") Long veterinarianId, 
                                    @Param("startTime") LocalDateTime startTime, 
                                    @Param("endTime") LocalDateTime endTime);

    /**
     * Sahip ID'sine göre randevuları listeleme
     */
    @Query("SELECT a FROM Appointment a WHERE a.animal.owner.id = :ownerId ORDER BY a.dateTime DESC")
    List<Appointment> findByOwnerId(@Param("ownerId") Long ownerId);
} 