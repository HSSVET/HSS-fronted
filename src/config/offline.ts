// Basit offline kip bayrağı okuması
// .env dosyasında REACT_APP_OFFLINE_MODE=true ise backend ve keycloak devre dışı bırakılır

// Mock data servislerini test etmek için OFFLINE_MODE'u açıyoruz
// Backend API'lar yerine mock servisler kullanılacak
export const OFFLINE_MODE: boolean = true;

console.log('🔍 OFFLINE_MODE manually set to true - Mock services will be used!');
console.log('  OFFLINE_MODE:', OFFLINE_MODE);

// Geliştirici kolaylığı: konsolda göster
if (typeof window !== 'undefined') {
  (window as any).__OFFLINE_MODE__ = OFFLINE_MODE;
  if (OFFLINE_MODE) {
    // eslint-disable-next-line no-console
    console.warn('[OFFLINE] Offline kip aktif: Backend ve Keycloak devre dışı.');
  }
}


