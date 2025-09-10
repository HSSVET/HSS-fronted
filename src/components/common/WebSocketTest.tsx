import React, { useState, useEffect } from 'react';
import { Send, Wifi, WifiOff } from 'lucide-react';
import webSocketService from '../../services/websocketService';
import './WebSocketTest.css';

const WebSocketTest: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [username, setUsername] = useState('TestUser');

  useEffect(() => {
    // Bağlantı durumu dinleyicisi
    webSocketService.onConnectionChange((connected) => {
      console.log('WebSocket bağlantı durumu değişti:', connected);
      setIsConnected(connected);
    });

    // Mesaj dinleyicileri
    webSocketService.onMessage('public', (msg) => {
      addMessage(`Genel: ${msg}`);
    });

    webSocketService.onMessage('appointments', (msg) => {
      addMessage(`Randevu: ${msg}`);
    });

    webSocketService.onMessage('lab-results', (msg) => {
      addMessage(`Lab Sonuç: ${msg}`);
    });

    webSocketService.onMessage('emergency', (msg) => {
      addMessage(`ACİL: ${msg}`);
    });

    // Mevcut bağlantı durumunu kontrol et
    const currentConnectionStatus = webSocketService.isConnectedToWebSocket();
    console.log('Mevcut WebSocket bağlantı durumu:', currentConnectionStatus);
    setIsConnected(currentConnectionStatus);

    return () => {
      // Cleanup
    };
  }, []);

  // Kullanıcı ekleme için ayrı useEffect
  useEffect(() => {
    if (username && isConnected) {
      console.log('Kullanıcı ekleniyor:', username);
      setTimeout(() => {
        webSocketService.addUser(username);
      }, 1000); // 1 saniye bekle
    }
  }, [username, isConnected]);

  const addMessage = (newMessage: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${newMessage}`]);
  };

  const sendMessage = () => {
    if (message.trim()) {
      webSocketService.sendGeneralMessage(message);
      addMessage(`Sen: ${message}`);
      setMessage('');
    }
  };

  const sendAppointmentMessage = () => {
    const appointmentMsg = `Test randevu mesajı - ${new Date().toLocaleTimeString()}`;
    webSocketService.sendAppointmentMessage(appointmentMsg);
    addMessage(`Randevu mesajı gönderildi: ${appointmentMsg}`);
  };

  const sendLabResultMessage = () => {
    const labMsg = `Test laboratuvar sonucu - ${new Date().toLocaleTimeString()}`;
    webSocketService.sendLabResultMessage(labMsg);
    addMessage(`Lab sonuç mesajı gönderildi: ${labMsg}`);
  };

  const sendEmergencyMessage = () => {
    const emergencyMsg = `Test acil durum mesajı - ${new Date().toLocaleTimeString()}`;
    webSocketService.sendEmergencyMessage(emergencyMsg);
    addMessage(`Acil durum mesajı gönderildi: ${emergencyMsg}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="websocket-test">
      <div className="test-header">
        <h3>WebSocket Test Paneli</h3>
        <div className="connection-status">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span className={isConnected ? 'connected' : 'disconnected'}>
            {isConnected ? 'Bağlı' : 'Bağlantı Yok'}
          </span>
        </div>
      </div>

      <div className="test-controls">
        <div className="username-input">
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adınızı girin"
          />
        </div>

        <div className="message-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            disabled={!isConnected}
          />
          <button onClick={sendMessage} disabled={!isConnected || !message.trim()}>
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="test-buttons">
          <button onClick={sendAppointmentMessage} disabled={!isConnected}>
            Randevu Mesajı Gönder
          </button>
          <button onClick={sendLabResultMessage} disabled={!isConnected}>
            Lab Sonuç Mesajı Gönder
          </button>
          <button onClick={sendEmergencyMessage} disabled={!isConnected}>
            Acil Durum Mesajı Gönder
          </button>
        </div>
      </div>

      <div className="messages-container">
        <h4>Mesajlar:</h4>
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-messages">Henüz mesaj yok</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="message-item">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest; 