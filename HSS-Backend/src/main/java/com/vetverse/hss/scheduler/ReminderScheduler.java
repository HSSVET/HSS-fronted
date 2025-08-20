package com.vetverse.hss.scheduler;

import com.vetverse.hss.service.ReminderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Reminder Scheduler
 * Otomatik hatırlatma sistemi için scheduled tasks
 */
@Component
@ConditionalOnProperty(name = "hss.reminders.enabled", havingValue = "true", matchIfMissing = true)
public class ReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ReminderScheduler.class);

    @Autowired
    private ReminderService reminderService;

    /**
     * Beklemedeki hatırlatmaları kontrol et ve gönder - Her 15 dakikada bir
     */
    @Scheduled(fixedRate = 900000) // 15 dakika = 900000 ms
    public void processPendingReminders() {
        logger.info("Starting scheduled reminder processing...");
        
        try {
            int processedCount = reminderService.processPendingReminders();
            logger.info("Processed {} pending reminders successfully", processedCount);
            
        } catch (Exception e) {
            logger.error("Failed to process pending reminders", e);
        }
    }

    /**
     * Yeni randevu hatırlatmaları oluştur - Her saat başı
     */
    @Scheduled(cron = "0 0 * * * *") // Her saat başı
    public void createAppointmentReminders() {
        logger.info("Creating appointment reminders...");
        
        try {
            int createdCount = reminderService.createAppointmentReminders();
            logger.info("Created {} new appointment reminders", createdCount);
            
        } catch (Exception e) {
            logger.error("Failed to create appointment reminders", e);
        }
    }

    /**
     * Aşı hatırlatmaları oluştur - Günde bir kez (sabah 8:00)
     */
    @Scheduled(cron = "0 0 8 * * *") // Her gün sabah 8:00
    public void createVaccinationReminders() {
        logger.info("Creating vaccination reminders...");
        
        try {
            int createdCount = reminderService.createVaccinationReminders();
            logger.info("Created {} new vaccination reminders", createdCount);
            
        } catch (Exception e) {
            logger.error("Failed to create vaccination reminders", e);
        }
    }

    /**
     * Başarısız hatırlatmaları yeniden dene - Günde 2 kez
     */
    @Scheduled(cron = "0 0 9,17 * * *") // Sabah 9:00 ve akşam 17:00
    public void retryFailedReminders() {
        logger.info("Retrying failed reminders...");
        
        try {
            int retriedCount = reminderService.retryFailedReminders();
            logger.info("Retried {} failed reminders", retriedCount);
            
        } catch (Exception e) {
            logger.error("Failed to retry failed reminders", e);
        }
    }

    /**
     * Eski hatırlatmaları temizle - Haftalık (Pazar günü gece 2:00)
     */
    @Scheduled(cron = "0 0 2 * * SUN") // Her Pazar gece 2:00
    public void cleanupOldReminders() {
        logger.info("Cleaning up old reminders...");
        
        try {
            int cleanedCount = reminderService.cleanupOldReminders();
            logger.info("Cleaned up {} old reminders", cleanedCount);
            
        } catch (Exception e) {
            logger.error("Failed to cleanup old reminders", e);
        }
    }

    /**
     * Hatırlatma istatistiklerini logla - Günlük (gece 23:00)
     */
    @Scheduled(cron = "0 0 23 * * *") // Her gün gece 23:00
    public void logReminderStatistics() {
        try {
            reminderService.logDailyStatistics();
            
        } catch (Exception e) {
            logger.error("Failed to log reminder statistics", e);
        }
    }
}
