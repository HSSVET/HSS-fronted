package com.vetverse.hss.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket bağlantı noktasını yapılandır
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // CORS ayarları
                .withSockJS(); // SockJS desteği ekle
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Mesaj broker'ını yapılandır
        registry.setApplicationDestinationPrefixes("/app"); // Uygulama mesajları için prefix
        registry.enableSimpleBroker("/topic", "/queue"); // Basit mesaj broker'ı
        
        // Kullanıcıya özel mesajlar için
        registry.setUserDestinationPrefix("/user");
    }
} 