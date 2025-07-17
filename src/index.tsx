import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import './shared/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keycloak, { keycloakInitOptions } from './config/keycloak';
import { apiClient } from './services/api';

const container = document.getElementById('root');
const root = createRoot(container!);

// Keycloak event handlers
const onKeycloakEvent = (event: string, error?: any) => {
  console.log('Keycloak Event:', event, error);
  
  if (event === 'onReady' || event === 'onAuthSuccess') {
    // API client'a keycloak instance'ını set et
    apiClient.setKeycloak(keycloak);
  }
  
  if (event === 'onAuthError') {
    console.error('Keycloak Auth Error:', error);
  }
};

const onKeycloakTokens = (tokens: any) => {
  console.log('Keycloak Tokens Updated');
  
  // API client'ı güncel token ile güncelle
  if (keycloak.authenticated) {
    apiClient.setKeycloak(keycloak);
  }
};

root.render(
  <React.StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={keycloakInitOptions}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
      LoadingComponent={<div style={{ padding: '20px', textAlign: 'center' }}>HSS Yükleniyor...</div>}
    >
      <App />
    </ReactKeycloakProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
