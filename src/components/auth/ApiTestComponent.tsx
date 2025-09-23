import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { testApi, apiClient } from '../../services/api';
import { OFFLINE_MODE } from '../../config/offline';

const ApiTestComponent: React.FC = () => {
  if (OFFLINE_MODE) {
    return null;
  }
  const { keycloak, initialized } = useKeycloak();
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Set keycloak instance in API client
  React.useEffect(() => {
    if (initialized && keycloak) {
      apiClient.setKeycloak(keycloak);
    }
  }, [initialized, keycloak]);

  const testEndpoint = async (name: string, apiCall: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error: any) {
      setResults(prev => ({ ...prev, [name]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const renderResult = (name: string) => {
    const result = results[name];
    const isLoading = loading[name];

    if (isLoading) {
      return <div style={{ color: '#6c757d' }}>Yükleniyor...</div>;
    }

    if (!result) {
      return <div style={{ color: '#6c757d' }}>Test edilmedi</div>;
    }

    if (result.success) {
      return (
        <div style={{ color: '#28a745' }}>
          <strong>✓ Başarılı</strong>
          <pre style={{ fontSize: '12px', marginTop: '5px', maxHeight: '100px', overflow: 'auto' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      );
    } else {
      return (
        <div style={{ color: '#dc3545' }}>
          <strong>✗ Hata</strong>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {result.error}
          </div>
        </div>
      );
    }
  };

  if (!initialized) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px' }}>
      <h3>Backend API Test Paneli</h3>
      <p>HSS Backend API endpoint'lerini test edin:</p>

      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        
        {/* Public Endpoint Test */}
        <div style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Public Endpoint</strong>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>GET /api/test/public</div>
            </div>
            <button
              onClick={() => testEndpoint('public', testApi.getPublic)}
              disabled={loading.public}
              style={{
                padding: '5px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test Et
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            {renderResult('public')}
          </div>
        </div>

        {/* Protected Endpoint Test */}
        <div style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Protected Endpoint</strong>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>GET /api/test/protected (Token gerekli)</div>
            </div>
            <button
              onClick={() => testEndpoint('protected', testApi.getProtected)}
              disabled={loading.protected || !keycloak.authenticated}
              style={{
                padding: '5px 15px',
                backgroundColor: keycloak.authenticated ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: keycloak.authenticated ? 'pointer' : 'not-allowed'
              }}
            >
              Test Et
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            {renderResult('protected')}
          </div>
        </div>

        {/* Admin Endpoint Test */}
        <div style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Admin Endpoint</strong>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>GET /api/test/admin (ADMIN rolü gerekli)</div>
            </div>
            <button
              onClick={() => testEndpoint('admin', testApi.getAdmin)}
              disabled={loading.admin || !keycloak.authenticated}
              style={{
                padding: '5px 15px',
                backgroundColor: keycloak.authenticated ? '#dc3545' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: keycloak.authenticated ? 'pointer' : 'not-allowed'
              }}
            >
              Test Et
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            {renderResult('admin')}
          </div>
        </div>

        {/* Veteriner Endpoint Test */}
        <div style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Veteriner Endpoint</strong>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>GET /api/test/veteriner (VETERINER/ADMIN rolü gerekli)</div>
            </div>
            <button
              onClick={() => testEndpoint('veteriner', testApi.getVeteriner)}
              disabled={loading.veteriner || !keycloak.authenticated}
              style={{
                padding: '5px 15px',
                backgroundColor: keycloak.authenticated ? '#17a2b8' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: keycloak.authenticated ? 'pointer' : 'not-allowed'
              }}
            >
              Test Et
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            {renderResult('veteriner')}
          </div>
        </div>

        {/* User Info Endpoint Test */}
        <div style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>User Info Endpoint</strong>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>GET /api/test/userinfo (Kullanıcı bilgileri)</div>
            </div>
            <button
              onClick={() => testEndpoint('userinfo', testApi.getUserInfo)}
              disabled={loading.userinfo || !keycloak.authenticated}
              style={{
                padding: '5px 15px',
                backgroundColor: keycloak.authenticated ? '#ffc107' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: keycloak.authenticated ? 'pointer' : 'not-allowed'
              }}
            >
              Test Et
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            {renderResult('userinfo')}
          </div>
        </div>

      </div>

      {!keycloak.authenticated && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px' 
        }}>
          <strong>Uyarı:</strong> Korumalı endpoint'leri test etmek için giriş yapmanız gerekmektedir.
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent; 