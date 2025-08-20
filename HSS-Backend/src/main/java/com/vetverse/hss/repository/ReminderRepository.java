package com.vetverse.hss.repository;

import com.vetverse.hss.entity.Reminder;
import com.vetverse.hss.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Reminder Repository
 * Reminder entity'si için veri erişim katmanı
 */
@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    /**
     * Randevuya göre hatırlatmaları listeleme
     */
    List<Reminder> findByAppointment(Appointment appointment);

    /**
     * Randevu ID'sine göre hatırlatmaları listeleme
     */
    @Query("SELECT r FROM Reminder r WHERE r.appointment.id = :appointmentId ORDER BY r.sendTime")
    List<Reminder> findByAppointmentId(@Param("appointmentId") Long appointmentId);

    /**
     * Kanala göre hatırlatmaları listeleme
     */
    List<Reminder> findByChannel(String channel);

    /**
     * Duruma göre hatırlatmaları listeleme
     */
    List<Reminder> findByStatus(String status);

    /**
     * Belirli tarih aralığındaki hatırlatmaları listeleme
     */
    @Query("SELECT r FROM Reminder r WHERE r.sendTime BETWEEN :startTime AND :endTime ORDER BY r.sendTime")
    List<Reminder> findBySendTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * Bugünkü hatırlatmaları listeleme
     */
    @Query("SELECT r FROM Reminder r WHERE CAST(r.sendTime AS date) = CURRENT_DATE ORDER BY r.sendTime")
    List<Reminder> findTodayReminders();

    /**
     * Gelecek hatırlatmalar
     */
    @Query("SELECT r FROM Reminder r WHERE r.sendTime > CURRENT_TIMESTAMP ORDER BY r.sendTime")
    List<Reminder> findFutureReminders();

    /**
     * Geçmiş hatırlatmalar
     */
    @Query("SELECT r FROM Reminder r WHERE r.sendTime < CURRENT_TIMESTAMP ORDER BY r.sendTime DESC")
    List<Reminder> findPastReminders();

    /**
     * Gönderilmesi gereken hatırlatmalar (beklemede olanlar)
     */
    @Query("SELECT r FROM Reminder r WHERE r.status = 'PENDING' AND r.sendTime <= CURRENT_TIMESTAMP ORDER BY r.sendTime")
    List<Reminder> findPendingReminders();

    /**
     * Gönderilen hatırlatmalar
     */
    @Query("SELECT r FROM Reminder r WHERE r.status = 'SENT' ORDER BY r.sendTime DESC")
    List<Reminder> findSentReminders();

    /**
     * Başarısız hatırlatmalar
     */
    @Query("SELECT r FROM Reminder r WHERE r.status = 'FAILED' ORDER BY r.sendTime DESC")
    List<Reminder> findFailedReminders();

    /**
     * Hayvan ID'sine göre hatırlatmaları listeleme
     */
    @Query("SELECT r FROM Reminder r WHERE r.appointment.animal.id = :animalId ORDER BY r.sendTime DESC")
    List<Reminder> findByAnimalId(@Param("animalId") Long animalId);

    /**
     * Sahip ID'sine göre hatırlatmaları listeleme
     */
    @Query("SELECT r FROM Reminder r WHERE r.appointment.animal.owner.id = :ownerId ORDER BY r.sendTime DESC")
    List<Reminder> findByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Veteriner ID'sine göre hatırlatmaları listeleme
     */
    @Query("SELECT r FROM Reminder r WHERE r.appointment.veterinarianId = :veterinarianId ORDER BY r.sendTime DESC")
    List<Reminder> findByVeterinarianId(@Param("veterinarianId") Long veterinarianId);

    /**
     * Kanal istatistikleri
     */
    @Query("SELECT r.channel, COUNT(r) FROM Reminder r GROUP BY r.channel ORDER BY COUNT(r) DESC")
    List<Object[]> getChannelStatistics();

    /**
     * Durum istatistikleri
     */
    @Query("SELECT r.status, COUNT(r) FROM Reminder r GROUP BY r.status ORDER BY COUNT(r) DESC")
    List<Object[]> getStatusStatistics();

    /**
     * Belirli kanal ve durum kombinasyonu
     */
    @Query("SELECT r FROM Reminder r WHERE r.channel = :channel AND r.status = :status ORDER BY r.sendTime DESC")
    List<Reminder> findByChannelAndStatus(@Param("channel") String channel, @Param("status") String status);

    /**
     * Son 24 saat içinde gönderilmesi gereken hatırlatmalar
     */
    @Query("SELECT r FROM Reminder r WHERE r.sendTime BETWEEN CURRENT_TIMESTAMP AND :twentyFourHoursLater ORDER BY r.sendTime")
    List<Reminder> findUpcomingReminders(@Param("twentyFourHoursLater") LocalDateTime twentyFourHoursLater);

    /**
     * SMS hatırlatmaları
     */
    @Query("SELECT r FROM Reminder r WHERE r.channel = 'SMS' ORDER BY r.sendTime DESC")
    List<Reminder> findSmsReminders();

    /**
     * Email hatırlatmaları
     */
    @Query("SELECT r FROM Reminder r WHERE r.channel = 'EMAIL' ORDER BY r.sendTime DESC")
    List<Reminder> findEmailReminders();

    /**
     * Bu ayki hatırlatmalar
     */
    @Query("SELECT r FROM Reminder r WHERE EXTRACT(YEAR FROM r.sendTime) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM r.sendTime) = EXTRACT(MONTH FROM CURRENT_DATE) ORDER BY r.sendTime DESC")
    List<Reminder> findCurrentMonthReminders();

    /**
     * Günlük hatırlatma istatistikleri
     */
    @Query("SELECT CAST(r.sendTime AS date), COUNT(r) FROM Reminder r GROUP BY CAST(r.sendTime AS date) ORDER BY CAST(r.sendTime AS date) DESC")
    List<Object[]> getDailyReminderStatistics();

    /**
     * Başarı oranı hesaplama
     */
    @Query("SELECT r.channel, " +
           "SUM(CASE WHEN r.status = 'SENT' THEN 1 ELSE 0 END) as sent, " +
           "COUNT(r) as total " +
           "FROM Reminder r GROUP BY r.channel")
    List<Object[]> getSuccessRateByChannel();
} 