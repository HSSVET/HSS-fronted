// Basit offline kip bayrağı okuması
// .env dosyasında REACT_APP_OFFLINE_MODE=true ise backend ve keycloak devre dışı bırakılır

// Varsayılanı true yapıyoruz; REACT_APP_OFFLINE_MODE=false derseniz kapatılır.
const envFlag = String(process.env.REACT_APP_OFFLINE_MODE ?? 'true').toLowerCase();
export const OFFLINE_MODE: boolean = envFlag === 'true' || envFlag === '1';

// Geliştirici kolaylığı: konsolda göster
if (typeof window !== 'undefined') {
  (window as any).__OFFLINE_MODE__ = OFFLINE_MODE;
  if (OFFLINE_MODE) {
    // eslint-disable-next-line no-console
    console.warn('[OFFLINE] Offline kip aktif: Backend ve Keycloak devre dışı.');
  }
}


