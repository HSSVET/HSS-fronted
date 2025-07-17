import React from 'react';
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
  onLoad: undefined, // Otomatik login olmasın
  checkLoginIframe: false, // Login iframe'ini devre dışı bırak
  pkceMethod: 'S256' as const,
  enableLogging: false, // Logging'i kapat
  responseMode: 'fragment' as const,
  flow: 'standard' as const
};

export default keycloak; 