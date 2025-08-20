package com.vetverse.hss.scheduler;

import com.vetverse.hss.service.UserSyncService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * User Synchronization Scheduler
 * Keycloak ve PostgreSQL arasında otomatik kullanıcı senkronizasyonu
 */
@Component
@ConditionalOnProperty(name = "hss.sync.enabled", havingValue = "true", matchIfMissing = true)
public class UserSyncScheduler {

    private static final Logger logger = LoggerFactory.getLogger(UserSyncScheduler.class);

    @Autowired
    private UserSyncService userSyncService;

    /**
     * Tam senkronizasyon - Her 30 dakikada bir
     * Tüm kullanıcıları Keycloak'tan çekip PostgreSQL ile senkronize eder
     */
    @Scheduled(fixedRate = 1800000) // 30 dakika = 1800000 ms
    public void fullUserSync() {
        logger.info("Starting scheduled full user synchronization...");
        
        try {
            userSyncService.syncAllUsers();
            logger.info("Scheduled full user synchronization completed successfully");
            
        } catch (Exception e) {
            logger.error("Scheduled full user synchronization failed", e);
        }
    }

    /**
     * Silinen kullanıcıları kontrol et - Her 1 saatte bir
     * Keycloak'ta olmayan kullanıcıları deaktif eder
     */
    @Scheduled(fixedRate = 3600000) // 1 saat = 3600000 ms
    public void checkRemovedUsers() {
        logger.info("Starting scheduled check for removed users...");
        
        try {
            userSyncService.deactivateRemovedUsers();
            logger.info("Scheduled removed users check completed successfully");
            
        } catch (Exception e) {
            logger.error("Scheduled removed users check failed", e);
        }
    }

    /**
     * Senkronizasyon istatistiklerini logla - Her 5 dakikada bir
     */
    @Scheduled(fixedRate = 300000) // 5 dakika = 300000 ms
    public void logSyncStats() {
        try {
            UserSyncService.SyncStats stats = userSyncService.getSyncStats();
            logger.info("Sync Stats - Total: {}, Synced: {}, Unsynced: {}", 
                      stats.getTotalPersonel(), 
                      stats.getSyncedPersonel(), 
                      stats.getUnsyncedPersonel());
                      
        } catch (Exception e) {
            logger.error("Failed to get sync stats", e);
        }
    }
} 