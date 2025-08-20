package com.vetverse.hss.controller;

import com.vetverse.hss.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final WebSocketService webSocketService;

    /**
     * Genel mesaj gönderme
     */
    @MessageMapping("/send-message")
    @SendTo("/topic/public")
    public String sendMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "Anonim";
        log.info("Kullanıcı '{}' mesaj gönderdi: {}", username, message);
        return username + ": " + message;
    }

    /**
     * Randevu mesajı gönderme
     */
    @MessageMapping("/appointment-message")
    @SendTo("/topic/appointments")
    public String sendAppointmentMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "Anonim";
        log.info("Randevu mesajı gönderildi: {}", message);
        return username + " - Randevu: " + message;
    }

    /**
     * Laboratuvar sonuç mesajı gönderme
     */
    @MessageMapping("/lab-result-message")
    @SendTo("/topic/lab-results")
    public String sendLabResultMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "Anonim";
        log.info("Laboratuvar sonuç mesajı gönderildi: {}", message);
        return username + " - Lab Sonuç: " + message;
    }

    /**
     * Acil durum mesajı gönderme
     */
    @MessageMapping("/emergency-message")
    @SendTo("/topic/emergency")
    public String sendEmergencyMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "Anonim";
        log.info("ACİL DURUM mesajı gönderildi: {}", message);
        return "🚨 ACİL - " + username + ": " + message;
    }

    /**
     * Kullanıcı bağlantı mesajı
     */
    @MessageMapping("/add-user")
    @SendTo("/topic/public")
    public String addUser(@Payload String username, SimpMessageHeaderAccessor headerAccessor) {
        // Kullanıcıyı WebSocket oturumuna ekle
        headerAccessor.getSessionAttributes().put("username", username);
        log.info("Kullanıcı bağlandı: {}", username);
        return username + " sohbete katıldı!";
    }

    /**
     * Özel mesaj gönderme
     */
    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload Map<String, String> messageData, SimpMessageHeaderAccessor headerAccessor) {
        String fromUser = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : "Anonim";
        String toUser = messageData.get("toUser");
        String message = messageData.get("message");
        
        log.info("Özel mesaj gönderiliyor: {} -> {}: {}", fromUser, toUser, message);
        
        // Alıcıya mesaj gönder
        webSocketService.sendToUser(toUser, "/queue/private-messages", 
            Map.of("from", fromUser, "message", message, "timestamp", System.currentTimeMillis()));
    }
} 