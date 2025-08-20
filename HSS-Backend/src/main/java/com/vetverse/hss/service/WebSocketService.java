package com.vetverse.hss.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Belirli bir topic'e mesaj gönder
     */
    public void sendToTopic(String topic, Object message) {
        log.info("Topic '{}' için mesaj gönderiliyor: {}", topic, message);
        messagingTemplate.convertAndSend("/topic/" + topic, message);
    }

    /**
     * Belirli bir kullanıcıya mesaj gönder
     */
    public void sendToUser(String username, String destination, Object message) {
        log.info("Kullanıcı '{}' için mesaj gönderiliyor: {}", username, message);
        messagingTemplate.convertAndSendToUser(username, destination, message);
    }

    /**
     * Belirli bir queue'ya mesaj gönder
     */
    public void sendToQueue(String queue, Object message) {
        log.info("Queue '{}' için mesaj gönderiliyor: {}", queue, message);
        messagingTemplate.convertAndSend("/queue/" + queue, message);
    }

    /**
     * Tüm kullanıcılara bildirim gönder
     */
    public void sendNotificationToAll(Object notification) {
        log.info("Tüm kullanıcılara bildirim gönderiliyor: {}", notification);
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }

    /**
     * Randevu bildirimi gönder
     */
    public void sendAppointmentNotification(String message) {
        sendToTopic("appointments", message);
    }

    /**
     * Laboratuvar sonuç bildirimi gönder
     */
    public void sendLabResultNotification(String message) {
        sendToTopic("lab-results", message);
    }

    /**
     * Acil durum bildirimi gönder
     */
    public void sendEmergencyNotification(String message) {
        sendToTopic("emergency", message);
    }
} 