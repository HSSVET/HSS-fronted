import Keycloak from 'keycloak-js';

// Keycloak instance configuration
const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'veterinary-clinic',
  clientId: 'hss-frontend'
};

// Create Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Keycloak initialization options
export const keycloakInitOptions = {
  onLoad: undefined, // SSO kontrolünü tamamen kapat
  checkLoginIframe: false, // Login iframe'ini devre dışı bırak
  enableLogging: true, // Debug için logging'i aç
  responseMode: 'fragment' as const,
  flow: 'standard' as const,
  timeoutInMs: 3000, // 3 saniye timeout
  promiseType: 'native' as const
};

export default keycloak; 