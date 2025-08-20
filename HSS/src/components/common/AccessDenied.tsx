import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { NoAccounts, Home, ArrowBack } from '@mui/icons-material';

interface AccessDeniedProps {
  message?: string;
  requiredRole?: string;
  requiredPermission?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
  requiredRole,
  requiredPermission,
  showBackButton = true,
  showHomeButton = true
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: 3,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 500, 
          width: '100%',
          textAlign: 'center',
          padding: 3,
          boxShadow: 3
        }}
      >
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <NoAccounts 
              sx={{ 
                fontSize: 80, 
                color: '#ff5722',
                mb: 2
              }} 
            />
          </Box>
          
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 2, 
              color: '#d32f2f',
              fontWeight: 'bold'
            }}
          >
            Erişim Reddedildi
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              color: '#666',
              fontSize: '1.1rem'
            }}
          >
            {message}
          </Typography>

          {requiredRole && (
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2, 
                color: '#888',
                fontStyle: 'italic'
              }}
            >
              Gerekli rol: <strong>{requiredRole}</strong>
            </Typography>
          )}

          {requiredPermission && (
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                color: '#888',
                fontStyle: 'italic'
              }}
            >
              Gerekli yetki: <strong>{requiredPermission}</strong>
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {showBackButton && (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
                sx={{
                  minWidth: 120,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Geri Dön
              </Button>
            )}
            
            {showHomeButton && (
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={handleGoHome}
                sx={{
                  minWidth: 120,
                  backgroundColor: '#2196f3',
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }}
              >
                Ana Sayfa
              </Button>
            )}
          </Box>
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              mt: 3, 
              color: '#999'
            }}
          >
            Eğer bu sayfaya erişmeniz gerektiğini düşünüyorsanız, 
            lütfen sistem yöneticinizle iletişime geçin.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccessDenied; 