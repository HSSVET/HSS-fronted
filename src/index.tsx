import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import './shared/styles/index.css';
import './shared/styles/theme.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keycloak, { keycloakInitOptions } from './config/keycloak';
import { apiClient } from './services/api';
import { OFFLINE_MODE } from './config/offline';
import keycloakOffline from './config/keycloakOffline';

const container = document.getElementById('root');
const root = createRoot(container!);

// Keycloak event handlers
const onKeycloakEvent = (event: string, error?: any) => {
  console.log('🔑 Keycloak Event:', event, error);
  
  if (event === 'onReady') {
    console.log('✅ Keycloak ready event');
    console.log('  - Authenticated:', keycloak.authenticated);
    console.log('  - Token:', keycloak.token ? 'EXISTS' : 'MISSING');
    // API client'a keycloak instance'ını set et
    apiClient.setKeycloak(keycloak);
  }
  
  if (event === 'onAuthSuccess') {
    console.log('✅ Keycloak auth success event');
    console.log('  - Token:', keycloak.token ? 'EXISTS' : 'MISSING');
    console.log('  - TokenParsed:', keycloak.tokenParsed);
    // API client'a keycloak instance'ını set et
    apiClient.setKeycloak(keycloak);
  }
  
  if (event === 'onAuthError') {
    console.error('❌ Keycloak Auth Error:', error);
  }
  
  if (event === 'onAuthRefreshSuccess') {
    console.log('🔄 Keycloak token refresh success');
  }
  
  if (event === 'onAuthRefreshError') {
    console.error('❌ Keycloak token refresh error:', error);
  }
  
  if (event === 'onTokenExpired') {
    console.warn('⚠️ Keycloak token expired');
  }
};

const onKeycloakTokens = (tokens: any) => {
  console.log('🔑 Keycloak Tokens Updated');
  console.log('  - Authenticated:', keycloak.authenticated);
  console.log('  - Token exists:', !!keycloak.token);
  console.log('  - Token parsed exists:', !!keycloak.tokenParsed);
  
  // API client'ı güncel token ile güncelle (sadece authenticated ise)
  if (keycloak.authenticated && keycloak.token) {
    apiClient.setKeycloak(keycloak);
  }
};

if (OFFLINE_MODE) {
  // Keycloak tamamen devre dışı: sadece App render edilir
  root.render(<App />);
} else {
  root.render(
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={keycloakInitOptions}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
      LoadingComponent={<div style={{ padding: '20px', textAlign: 'center' }}>HSS Yükleniyor...</div>}
    >
      <App />
    </ReactKeycloakProvider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
