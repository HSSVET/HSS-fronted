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
  onLoad: 'check-sso', // Otomatik SSO kontrolü yap
  checkLoginIframe: false, // Login iframe'ini devre dışı bırak
  checkLoginIframeInterval: 5, // Iframe check interval'ini artır
  pkceMethod: 'S256' as const,
  enableLogging: false, // Logging'i kapat (infinite loop debug için)
  responseMode: 'fragment' as const,
  flow: 'standard' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
};

export default keycloak; 