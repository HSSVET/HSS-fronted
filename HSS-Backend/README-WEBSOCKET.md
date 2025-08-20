# WebSocket ve STOMP Protokolü Kurulumu

Bu dokümanda HSS (Hayvan Sağlığı Sistemi) projesinde Spring WebSocket ve STOMP protokolü kullanarak real-time messaging yapılandırması açıklanmaktadır.

## 🚀 Özellikler

- **Real-time Bildirimler**: Randevu, laboratuvar sonuçları ve acil durum bildirimleri
- **STOMP Protokolü**: WebSocket üzerinde mesajlaşma protokolü
- **Topic-based Messaging**: Farklı kategoriler için ayrı topic'ler
- **User-specific Messages**: Kullanıcıya özel mesajlar
- **Auto-reconnection**: Otomatik yeniden bağlanma
- **Toast Notifications**: Anlık bildirimler

## 📋 Gereksinimler

### Backend Dependencies
```xml
<!-- Spring WebSocket -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- STOMP WebSocket support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-reactor-netty</artifactId>
</dependency>
```

### Frontend Dependencies
```json
{
  "sockjs-client": "^1.6.1",
  "@stomp/stompjs": "^7.0.0"
}
```

## 🔧 Kurulum

### 1. Backend Konfigürasyonu

#### WebSocketConfig.java
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setUserDestinationPrefix("/user");
    }
}
```

#### WebSocketService.java
```java
@Service
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendToTopic(String topic, Object message) {
        messagingTemplate.convertAndSend("/topic/" + topic, message);
    }

    public void sendToUser(String username, String destination, Object message) {
        messagingTemplate.convertAndSendToUser(username, destination, message);
    }
}
```

### 2. Frontend Konfigürasyonu

#### websocketService.ts
```typescript
class WebSocketService {
  private stompClient: any = null;
  private isConnected: boolean = false;

  private connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, (frame: any) => {
      this.isConnected = true;
      this.subscribeToTopics();
    });
  }

  private subscribeToTopics(): void {
    this.stompClient.subscribe('/topic/appointments', (message: any) => {
      // Randevu bildirimlerini işle
    });
  }
}
```

## 📡 Topic Yapısı

### Genel Topic'ler
- `/topic/notifications` - Genel bildirimler
- `/topic/appointments` - Randevu bildirimleri
- `/topic/lab-results` - Laboratuvar sonuç bildirimleri
- `/topic/emergency` - Acil durum bildirimleri

### Kullanıcıya Özel
- `/user/queue/private-messages` - Özel mesajlar

### Uygulama Mesajları
- `/app/send-message` - Genel mesaj gönderme
- `/app/appointment-message` - Randevu mesajı
- `/app/lab-result-message` - Lab sonuç mesajı
- `/app/emergency-message` - Acil durum mesajı

## 🔄 Mesaj Akışı

### 1. Randevu Oluşturma
```java
// AppointmentService.java
public AppointmentDto.Response createAppointment(AppointmentDto.Request request) {
    // ... randevu oluşturma işlemleri
    
    // WebSocket bildirimi
    NotificationDto notification = new NotificationDto();
    notification.setTitle("Yeni Randevu Oluşturuldu");
    notification.setMessage("Hayvan: " + animal.getName() + " için randevu oluşturuldu.");
    
    webSocketService.sendAppointmentNotification(notification.getMessage());
    
    return convertToResponse(appointment);
}
```

### 2. Frontend'de Dinleme
```typescript
// NotificationCenter.tsx
useEffect(() => {
  webSocketService.onMessage('appointments', (message) => {
    addNotification({
      title: 'Randevu Bildirimi',
      message: message,
      type: 'INFO',
      category: 'APPOINTMENT'
    });
  });
}, []);
```

## 🎯 Kullanım Örnekleri

### Backend'den Mesaj Gönderme
```java
// Tüm kullanıcılara bildirim
webSocketService.sendNotificationToAll("Sistem bakımı başlayacak");

// Belirli topic'e mesaj
webSocketService.sendToTopic("appointments", "Yeni randevu eklendi");

// Kullanıcıya özel mesaj
webSocketService.sendToUser("veteriner1", "/queue/private-messages", "Özel mesaj");
```

### Frontend'den Mesaj Gönderme
```typescript
// Genel mesaj
webSocketService.sendGeneralMessage("Merhaba!");

// Randevu mesajı
webSocketService.sendAppointmentMessage("Randevu bilgisi");

// Acil durum mesajı
webSocketService.sendEmergencyMessage("Acil durum!");
```

## 🔒 Güvenlik

### SecurityConfig.java
```java
.authorizeHttpRequests(auth -> auth
    // WebSocket endpoints - kimlik doğrulama gerektirmez
    .requestMatchers("/ws/**", "/topic/**", "/queue/**", "/app/**").permitAll()
    // ... diğer kurallar
)
```

## 🧪 Test

### WebSocket Test Bileşeni
Dashboard'da WebSocket test paneli bulunmaktadır:
- Bağlantı durumu kontrolü
- Mesaj gönderme/alma testi
- Farklı topic'lere mesaj gönderme
- Gerçek zamanlı mesaj görüntüleme

### Manuel Test
1. Backend'i başlatın: `./mvnw spring-boot:run`
2. Frontend'i başlatın: `npm start`
3. Dashboard'a gidin ve WebSocket test panelini kullanın
4. Farklı tarayıcı pencerelerinde test edin

## 📱 Bildirim Merkezi

### Özellikler
- Real-time bildirimler
- Toast notifications
- Okundu/okunmadı durumu
- Bildirim kategorileri
- Responsive tasarım

### Kullanım
```typescript
// NotificationCenter bileşeni otomatik olarak:
// - WebSocket bağlantısını kurar
// - Topic'lere abone olur
// - Bildirimleri gösterir
// - Toast bildirimleri gösterir
```

## 🔧 Sorun Giderme

### Bağlantı Sorunları
1. Backend'in çalıştığından emin olun
2. CORS ayarlarını kontrol edin
3. WebSocket endpoint'inin doğru olduğunu kontrol edin
4. Browser console'da hata mesajlarını kontrol edin

### Mesaj Alınamıyor
1. Topic aboneliğini kontrol edin
2. Message handler'ların doğru çalıştığını kontrol edin
3. WebSocket bağlantı durumunu kontrol edin

### Performance
1. Gereksiz mesaj gönderimini önleyin
2. Mesaj boyutunu optimize edin
3. Bağlantı sayısını sınırlayın

## 📚 Ek Kaynaklar

- [Spring WebSocket Documentation](https://docs.spring.io/spring-framework/reference/web/websocket.html)
- [STOMP Protocol Specification](https://stomp.github.io/stomp-specification-1.2.html)
- [SockJS Documentation](https://github.com/sockjs/sockjs-client)
- [@stomp/stompjs Documentation](https://stomp-js.github.io/)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 