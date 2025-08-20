package com.vetverse.hss.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

/**
 * Notification Service
 * SMS ve Email gönderme işlemleri
 */
@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Value("${hss.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${hss.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${hss.sms.api.url:}")
    private String smsApiUrl;

    @Value("${hss.sms.api.key:}")
    private String smsApiKey;

    @Value("${hss.email.api.url:}")
    private String emailApiUrl;

    @Value("${hss.email.api.key:}")
    private String emailApiKey;

    @Value("${hss.email.from:noreply@vetclinic.com}")
    private String emailFrom;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * SMS gönder
     */
    public boolean sendSMS(String phoneNumber, String message) {
        if (!smsEnabled) {
            logger.info("SMS service disabled. Would send to {}: {}", phoneNumber, message);
            return true; // Test amaçlı true dön
        }

        try {
            // SMS API entegrasyonu (örnek implementation)
            Map<String, Object> smsRequest = new HashMap<>();
            smsRequest.put("to", phoneNumber);
            smsRequest.put("message", message);
            smsRequest.put("from", "VetClinic");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(smsApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(smsRequest, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(smsApiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("SMS sent successfully to {}", phoneNumber);
                return true;
            } else {
                logger.error("Failed to send SMS to {}. Status: {}", phoneNumber, response.getStatusCode());
                return false;
            }

        } catch (Exception e) {
            logger.error("Error sending SMS to {}: {}", phoneNumber, e.getMessage());
            return false;
        }
    }

    /**
     * Email gönder
     */
    public boolean sendEmail(String to, String subject, String message) {
        if (!emailEnabled) {
            logger.info("Email service disabled. Would send to {}: {} - {}", to, subject, message);
            return true; // Test amaçlı true dön
        }

        try {
            // Email API entegrasyonu (örnek implementation)
            Map<String, Object> emailRequest = new HashMap<>();
            emailRequest.put("to", to);
            emailRequest.put("from", emailFrom);
            emailRequest.put("subject", subject);
            emailRequest.put("text", message);
            emailRequest.put("html", createEmailTemplate(subject, message));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(emailApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailRequest, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(emailApiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Email sent successfully to {}", to);
                return true;
            } else {
                logger.error("Failed to send email to {}. Status: {}", to, response.getStatusCode());
                return false;
            }

        } catch (Exception e) {
            logger.error("Error sending email to {}: {}", to, e.getMessage());
            return false;
        }
    }

    /**
     * WhatsApp mesajı gönder (gelecekte eklenebilir)
     */
    public boolean sendWhatsApp(String phoneNumber, String message) {
        logger.info("WhatsApp service not implemented yet. Would send to {}: {}", phoneNumber, message);
        return false;
    }

    /**
     * Push notification gönder (gelecekte eklenebilir)
     */
    public boolean sendPushNotification(String deviceToken, String title, String message) {
        logger.info("Push notification service not implemented yet. Would send: {} - {}", title, message);
        return false;
    }

    /**
     * Email HTML template oluştur
     */
    private String createEmailTemplate(String subject, String message) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>%s</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { background-color: #2c5aa0; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Veteriner Kliniği</h2>
                </div>
                <div class="content">
                    <h3>%s</h3>
                    <p>%s</p>
                </div>
                <div class="footer">
                    <p>Bu mesaj otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
                    <p>Veteriner Kliniği - Sağlıklı dostlarınız için buradayız</p>
                </div>
            </body>
            </html>
            """, subject, subject, message.replace("\n", "<br>"));
    }

    /**
     * Toplu SMS gönder
     */
    public int sendBulkSMS(Map<String, String> phoneMessageMap) {
        int successCount = 0;
        
        for (Map.Entry<String, String> entry : phoneMessageMap.entrySet()) {
            if (sendSMS(entry.getKey(), entry.getValue())) {
                successCount++;
            }
        }
        
        return successCount;
    }

    /**
     * Toplu Email gönder
     */
    public int sendBulkEmail(Map<String, String> emailMessageMap, String subject) {
        int successCount = 0;
        
        for (Map.Entry<String, String> entry : emailMessageMap.entrySet()) {
            if (sendEmail(entry.getKey(), subject, entry.getValue())) {
                successCount++;
            }
        }
        
        return successCount;
    }

    /**
     * Acil durum bildirimi gönder (tüm kanallar)
     */
    public boolean sendEmergencyNotification(String phoneNumber, String email, String message) {
        boolean smsResult = sendSMS(phoneNumber, "[ACİL] " + message);
        boolean emailResult = sendEmail(email, "Acil Durum Bildirimi", message);
        
        return smsResult || emailResult; // En az biri başarılı olmalı
    }

    /**
     * Test mesajı gönder
     */
    public boolean sendTestNotification(String channel, String destination) {
        String testMessage = "Bu bir test mesajıdır. Veteriner kliniği hatırlatma sistemi çalışıyor.";
        
        switch (channel.toUpperCase()) {
            case "SMS":
                return sendSMS(destination, testMessage);
            case "EMAIL":
                return sendEmail(destination, "Test Bildirimi", testMessage);
            default:
                logger.warn("Unknown notification channel: {}", channel);
                return false;
        }
    }
}
