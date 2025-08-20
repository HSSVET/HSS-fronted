package com.vetverse.hss.service;

import com.vetverse.hss.entity.Reminder;
import com.vetverse.hss.entity.Appointment;
import com.vetverse.hss.entity.VaccinationRecord;
import com.vetverse.hss.entity.Animal;
import com.vetverse.hss.repository.ReminderRepository;
import com.vetverse.hss.repository.AppointmentRepository;
import com.vetverse.hss.repository.VaccinationRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

/**
 * Reminder Service
 * Hatırlatma yönetimi ve otomatik oluşturma işlemleri
 */
@Service
@Transactional
public class ReminderService {

    private static final Logger logger = LoggerFactory.getLogger(ReminderService.class);

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private VaccinationRecordRepository vaccinationRecordRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Beklemedeki hatırlatmaları işle ve gönder
     */
    public int processPendingReminders() {
        List<Reminder> pendingReminders = reminderRepository.findPendingReminders();
        int processedCount = 0;

        for (Reminder reminder : pendingReminders) {
            try {
                boolean sent = sendReminder(reminder);
                if (sent) {
                    reminder.setStatus("SENT");
                    processedCount++;
                    logger.debug("Reminder {} sent successfully", reminder.getId());
                } else {
                    reminder.setStatus("FAILED");
                    logger.warn("Failed to send reminder {}", reminder.getId());
                }
                reminderRepository.save(reminder);

            } catch (Exception e) {
                logger.error("Error processing reminder {}: {}", reminder.getId(), e.getMessage());
                reminder.setStatus("FAILED");
                reminderRepository.save(reminder);
            }
        }

        return processedCount;
    }

    /**
     * Randevu hatırlatmaları oluştur
     */
    public int createAppointmentReminders() {
        // Yarından 7 gün sonrasına kadar olan randevuları al
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0);
        LocalDateTime weekLater = tomorrow.plusDays(7);
        
        List<Appointment> upcomingAppointments = appointmentRepository
            .findByDateTimeBetween(tomorrow, weekLater);

        int createdCount = 0;

        for (Appointment appointment : upcomingAppointments) {
            // Bu randevu için hatırlatma var mı kontrol et
            List<Reminder> existingReminders = reminderRepository.findByAppointmentId(appointment.getId());
            
            if (existingReminders.isEmpty()) {
                // 1 gün öncesi için SMS hatırlatması oluştur
                LocalDateTime reminderTime = appointment.getDateTime().minusDays(1).withHour(9).withMinute(0);
                
                if (reminderTime.isAfter(LocalDateTime.now())) {
                    Reminder smsReminder = new Reminder();
                    smsReminder.setAppointment(appointment);
                    smsReminder.setSendTime(reminderTime);
                    smsReminder.setChannel("SMS");
                    smsReminder.setStatus("PENDING");
                    
                    reminderRepository.save(smsReminder);
                    createdCount++;

                    // Aynı zamanda email hatırlatması da oluştur
                    Reminder emailReminder = new Reminder();
                    emailReminder.setAppointment(appointment);
                    emailReminder.setSendTime(reminderTime);
                    emailReminder.setChannel("EMAIL");
                    emailReminder.setStatus("PENDING");
                    
                    reminderRepository.save(emailReminder);
                    createdCount++;
                    
                    logger.debug("Created reminders for appointment {} on {}", 
                               appointment.getId(), appointment.getDateTime());
                }
            }
        }

        return createdCount;
    }

    /**
     * Aşı hatırlatmaları oluştur
     */
    public int createVaccinationReminders() {
        // Son aşı kayıtlarına göre gelecek aşı tarihleri hesapla
        LocalDate today = LocalDate.now();
        LocalDate nextMonth = today.plusMonths(1);
        
        int createdCount = 0;

        // Örnek: Yıllık aşılar için
        List<VaccinationRecord> lastYearVaccinations = vaccinationRecordRepository
            .findLastVaccinationsByType("ANNUAL"); // Bu metodu implement etmek gerekli

        for (VaccinationRecord vaccination : lastYearVaccinations) {
            LocalDate nextVaccinationDate = vaccination.getDate().plusYears(1);
            
            // Eğer gelecek aşı tarihi 1 ay içindeyse hatırlatma oluştur
            if (nextVaccinationDate.isAfter(today) && !nextVaccinationDate.isAfter(nextMonth)) {
                LocalDateTime reminderTime = nextVaccinationDate.minusDays(7).atTime(9, 0);
                
                // Bu aşı için hatırlatma var mı kontrol et
                boolean hasReminder = reminderRepository.findByAnimalId(vaccination.getAnimal().getId())
                    .stream()
                    .anyMatch(r -> r.getSendTime().toLocalDate().equals(reminderTime.toLocalDate()));
                
                if (!hasReminder) {
                    // Aşı hatırlatması için geçici randevu oluştur veya mevcut sistemi genişlet
                    createVaccinationReminder(vaccination, reminderTime);
                    createdCount++;
                }
            }
        }

        return createdCount;
    }

    /**
     * Başarısız hatırlatmaları yeniden dene
     */
    public int retryFailedReminders() {
        List<Reminder> failedReminders = reminderRepository.findFailedReminders();
        int retriedCount = 0;

        for (Reminder reminder : failedReminders) {
            // Son 24 saat içinde başarısız olan hatırlatmaları yeniden dene
            if (reminder.getSendTime().isAfter(LocalDateTime.now().minusDays(1))) {
                reminder.setStatus("PENDING");
                reminderRepository.save(reminder);
                retriedCount++;
            }
        }

        return retriedCount;
    }

    /**
     * Eski hatırlatmaları temizle
     */
    public int cleanupOldReminders() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(3);
        
        List<Reminder> oldReminders = reminderRepository.findBySendTimeBetween(
            LocalDateTime.of(2020, 1, 1, 0, 0), cutoffDate);
        
        int cleanedCount = oldReminders.size();
        reminderRepository.deleteAll(oldReminders);
        
        return cleanedCount;
    }

    /**
     * Günlük istatistikleri logla
     */
    public void logDailyStatistics() {
        List<Reminder> todayReminders = reminderRepository.findTodayReminders();
        
        long sentCount = todayReminders.stream().filter(r -> "SENT".equals(r.getStatus())).count();
        long pendingCount = todayReminders.stream().filter(r -> "PENDING".equals(r.getStatus())).count();
        long failedCount = todayReminders.stream().filter(r -> "FAILED".equals(r.getStatus())).count();
        
        logger.info("Daily Reminder Stats - Total: {}, Sent: {}, Pending: {}, Failed: {}", 
                   todayReminders.size(), sentCount, pendingCount, failedCount);
    }

    /**
     * Hatırlatma gönder
     */
    private boolean sendReminder(Reminder reminder) {
        try {
            Appointment appointment = reminder.getAppointment();
            Animal animal = appointment.getAnimal();
            
            String message = createReminderMessage(appointment, animal);
            
            if ("SMS".equals(reminder.getChannel())) {
                return notificationService.sendSMS(animal.getOwner().getPhone(), message);
            } else if ("EMAIL".equals(reminder.getChannel())) {
                return notificationService.sendEmail(animal.getOwner().getEmail(), 
                                                   "Randevu Hatırlatması", message);
            }
            
            return false;
            
        } catch (Exception e) {
            logger.error("Error sending reminder: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Hatırlatma mesajı oluştur
     */
    private String createReminderMessage(Appointment appointment, Animal animal) {
        return String.format(
            "Sayın %s, %s adlı hayvanınızın %s tarihinde randevusu bulunmaktadır. Konusu: %s. Lütfen zamanında gelmeyi unutmayınız.",
            animal.getOwner().getFirstName() + " " + animal.getOwner().getLastName(),
            animal.getName(),
            appointment.getDateTime().toLocalDate(),
            appointment.getSubject()
        );
    }

    /**
     * Aşı hatırlatması oluştur
     */
    private void createVaccinationReminder(VaccinationRecord vaccination, LocalDateTime reminderTime) {
        // Bu metod aşı hatırlatması için özel logic içerebilir
        // Şimdilik basit bir implementation
        logger.info("Creating vaccination reminder for animal {} on {}", 
                   vaccination.getAnimal().getId(), reminderTime);
    }

    /**
     * Manuel hatırlatma oluştur
     */
    public Reminder createManualReminder(Long appointmentId, String channel, LocalDateTime sendTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        Reminder reminder = new Reminder();
        reminder.setAppointment(appointment);
        reminder.setChannel(channel);
        reminder.setSendTime(sendTime);
        reminder.setStatus("PENDING");
        
        return reminderRepository.save(reminder);
    }
}
