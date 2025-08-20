package com.vetverse.hss.controller;

import com.vetverse.hss.entity.Reminder;
import com.vetverse.hss.service.ReminderService;
import com.vetverse.hss.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Reminder Controller
 * Hatırlatma yönetimi endpoint'leri
 */
@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private NotificationService notificationService;

    /**
     * Manuel hatırlatma oluştur
     */
    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('VETERINER', 'ADMIN', 'SEKRETER')")
    public ResponseEntity<Reminder> createReminder(
            @RequestParam Long appointmentId,
            @RequestParam String channel,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime sendTime) {
        
        try {
            Reminder reminder = reminderService.createManualReminder(appointmentId, channel, sendTime);
            return ResponseEntity.status(HttpStatus.CREATED).body(reminder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Test bildirimi gönder
     */
    @PostMapping("/test")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> sendTestNotification(
            @RequestParam String channel,
            @RequestParam String destination) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean result = notificationService.sendTestNotification(channel, destination);
            response.put("success", result);
            response.put("message", result ? "Test notification sent successfully" : "Failed to send test notification");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Hatırlatma işleme durumunu kontrol et
     */
    @PostMapping("/process")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> processReminders() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            int processedCount = reminderService.processPendingReminders();
            response.put("success", true);
            response.put("processedCount", processedCount);
            response.put("message", "Processed " + processedCount + " reminders");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Randevu hatırlatmaları oluştur
     */
    @PostMapping("/create-appointment-reminders")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createAppointmentReminders() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            int createdCount = reminderService.createAppointmentReminders();
            response.put("success", true);
            response.put("createdCount", createdCount);
            response.put("message", "Created " + createdCount + " appointment reminders");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Aşı hatırlatmaları oluştur
     */
    @PostMapping("/create-vaccination-reminders")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createVaccinationReminders() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            int createdCount = reminderService.createVaccinationReminders();
            response.put("success", true);
            response.put("createdCount", createdCount);
            response.put("message", "Created " + createdCount + " vaccination reminders");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Başarısız hatırlatmaları yeniden dene
     */
    @PostMapping("/retry-failed")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> retryFailedReminders() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            int retriedCount = reminderService.retryFailedReminders();
            response.put("success", true);
            response.put("retriedCount", retriedCount);
            response.put("message", "Retried " + retriedCount + " failed reminders");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Sistem durumu kontrolü
     */
    @GetMapping("/system-status")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Sistem durumu bilgilerini topla
            response.put("success", true);
            response.put("schedulerEnabled", true);
            response.put("lastProcessTime", LocalDateTime.now().toString());
            response.put("message", "Reminder system is running");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
