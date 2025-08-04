const SockJS = require('sockjs-client');
const { Stomp } = require('@stomp/stompjs');

export interface WebSocketMessage {
  type: string;
  from?: string;
  to?: string;
  message: string;
  data?: any;
  timestamp: string;
  sessionId?: string;
}

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  category: 'APPOINTMENT' | 'LAB_RESULT' | 'EMERGENCY' | 'GENERAL';
  recipient?: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

class WebSocketService {
  private stompClient: any = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000;

  // Callback fonksiyonları
  private messageCallbacks: Map<string, (message: any) => void> = new Map();
  private connectionCallbacks: ((connected: boolean) => void)[] = [];

  constructor() {
    this.connect();
  }

  /**
   * WebSocket bağlantısını kur
   */
  private connect(): void {
    try {
      // Önce SockJS ile dene
      const socket = new SockJS('http://localhost:8090/ws');
      this.stompClient = Stomp.over(socket);
      
      // Debug için
      console.log('SockJS bağlantısı deneniyor...');

      this.stompClient.connect(
        {},
        (frame: any) => {
          console.log('WebSocket bağlantısı başarılı:', frame);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.notifyConnectionCallbacks(true);
          this.subscribeToTopics();
        },
        (error: any) => {
          console.error('WebSocket bağlantı hatası:', error);
          this.isConnected = false;
          this.notifyConnectionCallbacks(false);
          this.handleReconnect();
        }
      );
    } catch (error) {
      console.error('WebSocket bağlantısı kurulamadı:', error);
      this.handleReconnect();
    }
  }

  /**
   * Yeniden bağlanma işlemi
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Yeniden bağlanma denemesi ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Maksimum yeniden bağlanma denemesi aşıldı');
    }
  }

  /**
   * Topic'lere abone ol
   */
  private subscribeToTopics(): void {
    if (!this.stompClient || !this.isConnected) return;

    // Genel mesajlar (public chat)
    this.stompClient.subscribe('/topic/public', (message: any) => {
      const publicMessage = message.body;
      console.log('Public mesaj alındı:', publicMessage);
      this.handleMessage('public', publicMessage);
    });

    // Randevu bildirimleri
    this.stompClient.subscribe('/topic/appointments', (message: any) => {
      const appointmentMessage = message.body;
      console.log('Randevu mesajı alındı:', appointmentMessage);
      this.handleMessage('appointments', appointmentMessage);
    });

    // Laboratuvar sonuç bildirimleri
    this.stompClient.subscribe('/topic/lab-results', (message: any) => {
      const labResultMessage = message.body;
      console.log('Lab sonuç mesajı alındı:', labResultMessage);
      this.handleMessage('lab-results', labResultMessage);
    });

    // Acil durum bildirimleri
    this.stompClient.subscribe('/topic/emergency', (message: any) => {
      const emergencyMessage = message.body;
      console.log('Acil durum mesajı alındı:', emergencyMessage);
      this.handleMessage('emergency', emergencyMessage);
    });

    // Özel mesajlar
    this.stompClient.subscribe('/user/queue/private-messages', (message: any) => {
      const privateMessage = JSON.parse(message.body);
      console.log('Özel mesaj alındı:', privateMessage);
      this.handleMessage('private-messages', privateMessage);
    });
  }

  /**
   * Mesaj işleme
   */
  private handleMessage(topic: string, message: any): void {
    console.log(`${topic} topic'inden mesaj alındı:`, message);
    
    const callback = this.messageCallbacks.get(topic);
    if (callback) {
      callback(message);
    }
  }

  /**
   * Bağlantı durumu callback'lerini bildir
   */
  private notifyConnectionCallbacks(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => callback(connected));
  }

  /**
   * Mesaj gönder
   */
  public sendMessage(destination: string, message: any): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient.send(`/app/${destination}`, {}, JSON.stringify(message));
    } else {
      console.error('WebSocket bağlantısı yok, mesaj gönderilemedi');
    }
  }

  /**
   * Genel mesaj gönder
   */
  public sendGeneralMessage(message: string): void {
    this.sendMessage('send-message', message);
  }

  /**
   * Randevu mesajı gönder
   */
  public sendAppointmentMessage(message: string): void {
    this.sendMessage('appointment-message', message);
  }

  /**
   * Laboratuvar sonuç mesajı gönder
   */
  public sendLabResultMessage(message: string): void {
    this.sendMessage('lab-result-message', message);
  }

  /**
   * Acil durum mesajı gönder
   */
  public sendEmergencyMessage(message: string): void {
    this.sendMessage('emergency-message', message);
  }

  /**
   * Özel mesaj gönder
   */
  public sendPrivateMessage(toUser: string, message: string): void {
    this.sendMessage('private-message', { toUser, message });
  }

  /**
   * Kullanıcı ekle
   */
  public addUser(username: string): void {
    this.sendMessage('add-user', username);
  }

  /**
   * Mesaj callback'i ekle
   */
  public onMessage(topic: string, callback: (message: any) => void): void {
    this.messageCallbacks.set(topic, callback);
  }

  /**
   * Bağlantı durumu callback'i ekle
   */
  public onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  /**
   * Bağlantı durumunu kontrol et
   */
  public isConnectedToWebSocket(): boolean {
    return this.isConnected;
  }

  /**
   * Bağlantıyı kapat
   */
  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.isConnected = false;
      this.notifyConnectionCallbacks(false);
    }
  }
}

// Singleton instance
const webSocketService = new WebSocketService();
export default webSocketService; 