import React, { useState, useEffect, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { OFFLINE_MODE } from '../../config/offline';

interface UserInfo {
  sub?: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles?: string[];
  };
}

const AuthButton: React.FC = () => {
  if (OFFLINE_MODE) {
    return null;
  }
  const { keycloak, initialized } = useKeycloak();
  const [tokenTimeRemaining, setTokenTimeRemaining] = useState<number>(0);

  // Token süresini hesapla
  const getTokenTimeRemaining = useCallback((): number => {
    if (!keycloak?.tokenParsed?.exp) {
      return 0;
    }
    const tokenExpiration = keycloak.tokenParsed.exp * 1000;
    const now = Date.now();
    return Math.max(0, Math.floor((tokenExpiration - now) / 1000));
  }, [keycloak?.tokenParsed?.exp]);

  // Token süresini güncelle
  useEffect(() => {
    if (!initialized || !keycloak.authenticated) {
      return;
    }

    const updateTokenTime = () => {
      setTokenTimeRemaining(getTokenTimeRemaining());
    };
    
    updateTokenTime();
    // Reduce frequency to prevent excessive re-renders
    const interval = setInterval(updateTokenTime, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [initialized, keycloak.authenticated, keycloak.tokenParsed, getTokenTimeRemaining]);

  if (!initialized) {
    return <div>Yükleniyor...</div>;
  }

  const userInfo = keycloak.tokenParsed as UserInfo;
  const roles = userInfo?.realm_access?.roles || [];

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  const handleProfile = () => {
    keycloak.accountManagement();
  };

  const handleRefreshToken = async () => {
    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed) {
        console.log('Token refreshed successfully');
      } else {
        console.log('Token is still valid');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Sistem Yöneticisi',
      'VETERINER': 'Veteriner Hekim',
      'SEKRETER': 'Klinik Sekreteri',
      'TEKNISYEN': 'Veteriner Teknisyeni'
    };
    return roleMap[role] || role;
  };

  if (!keycloak.authenticated) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px' }}>
        <h3>HSS - Hayvan Sağlığı Sistemi</h3>
        <p>Sisteme erişmek için giriş yapmanız gerekmektedir.</p>
        <button 
          onClick={handleLogin}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Hoş geldiniz, {userInfo?.given_name} {userInfo?.family_name}</h3>
          <p><strong>Kullanıcı Adı:</strong> {userInfo?.preferred_username}</p>
          <p><strong>E-posta:</strong> {userInfo?.email}</p>
          {roles.length > 0 && (
            <p><strong>Roller:</strong> {roles.map(role => getRoleDisplay(role)).join(', ')}</p>
          )}
          
          {/* Token Süre Bilgisi */}
          <div style={{ 
            marginTop: '10px', 
            padding: '8px 12px', 
            backgroundColor: tokenTimeRemaining < 60 ? '#f8d7da' : '#d1ecf1', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Oturum Süresi:</strong> {formatTime(tokenTimeRemaining)}
            {tokenTimeRemaining < 60 && tokenTimeRemaining > 0 && (
              <span style={{ color: '#721c24', fontWeight: 'bold' }}> (Yakında sona erecek!)</span>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleRefreshToken}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            title="Token'ı yenile"
          >
            🔄 Token Yenile
          </button>
          <button 
            onClick={handleProfile}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Profil
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
      
      {/* Token bilgileri - geliştirme için */}
      <details style={{ marginTop: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Geliştirici Bilgileri</summary>
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p><strong>Token Valid:</strong> {keycloak.authenticated ? 'Evet' : 'Hayır'}</p>
          <p><strong>Token Expires:</strong> {keycloak.tokenParsed?.exp ? new Date(keycloak.tokenParsed.exp * 1000).toLocaleString('tr-TR') : 'N/A'}</p>
          <p><strong>Refresh Token Expires:</strong> {keycloak.refreshTokenParsed?.exp ? new Date(keycloak.refreshTokenParsed.exp * 1000).toLocaleString('tr-TR') : 'N/A'}</p>
          {keycloak.token && (
            <div>
              <p><strong>Access Token (ilk 100 karakter):</strong></p>
              <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {keycloak.token.substring(0, 100)}...
              </code>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default AuthButton; 