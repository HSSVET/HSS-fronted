import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Button,
  Fade,
  Slide,
  Zoom,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Avatar,
  Container,
  Snackbar
} from '@mui/material';
import {
  Info,
  CheckCircle,
  VpnKey,
  Shield,
  Person,
  Language,
  DarkMode,
  LightMode,
  Close,
  Smartphone,
  Email,
  Pets,
  MedicalServices,
  Schedule,
  Analytics,
  Fingerprint,
  AdminPanelSettings
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import LoginForm from './LoginForm';
import { getSubdomainInfo, validateUserSubdomainAccess } from '../../utils/subdomain';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface LoginPageProps {
  onLogin?: () => void;
  onError?: (error: string) => void;
  allowRememberMe?: boolean;
  showLanguageSelector?: boolean;
  showThemeSelector?: boolean;
  customBackground?: string;
  customLogo?: string;
  companyName?: string;
  loginMethods?: ('sso' | 'password' | 'mfa')[];
}

interface MFAMethod {
  type: 'sms' | 'email' | 'authenticator' | 'biometric';
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
}

interface LoginStats {
  totalLogins: number;
  successRate: number;
  averageResponseTime: number;
  activeUsers: number;
  lastUpdate: Date;
}

// ============================================================================
// Animations
// ============================================================================

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ============================================================================
// Mock Data
// ============================================================================

const mockLoginStats: LoginStats = {
  totalLogins: 1247,
  successRate: 98.5,
  averageResponseTime: 0.8,
  activeUsers: 32,
  lastUpdate: new Date()
};

const mockMFAMethods: MFAMethod[] = [
  {
    type: 'authenticator',
    name: 'Authenticator App',
    icon: <Smartphone />,
    description: 'Use your mobile authenticator app',
    available: true
  },
  {
    type: 'sms',
    name: 'SMS Code',
    icon: <Smartphone />,
    description: 'Receive code via SMS',
    available: true
  },
  {
    type: 'email',
    name: 'Email Code',
    icon: <Email />,
    description: 'Receive code via email',
    available: true
  },
  {
    type: 'biometric',
    name: 'Biometric',
    icon: <Fingerprint />,
    description: 'Use fingerprint or face ID',
    available: false
  }
];

// ============================================================================
// Main Login Page Component
// ============================================================================

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onError,
  allowRememberMe = true,
  showLanguageSelector = true,
  showThemeSelector = true,
  customBackground,
  customLogo,
  companyName = 'HSS - Hayvan Sağlığı Sistemi',
  loginMethods = ['sso', 'password', 'mfa']
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();

  // ============================================================================
  // Subdomain Detection
  // ============================================================================
  const subdomainInfo = useMemo(() => getSubdomainInfo(), []);
  const isAdminPortal = subdomainInfo.isAdmin;

  // ============================================================================
  // State Management
  // ============================================================================

  // Default to password login (Firebase Auth)
  const [loginStep, setLoginStep] = useState<'initial' | 'password' | 'mfa' | 'success'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMFA, setSelectedMFA] = useState<MFAMethod | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showMFADialog, setShowMFADialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [currentLanguage, setCurrentLanguage] = useState<'tr' | 'en'>('tr');
  const [animationStep, setAnimationStep] = useState(0);

  // ============================================================================
  // Effects
  // ============================================================================

  // DEBUG: Add auth state to window for debugging
  useEffect(() => {
    (window as any).authState = state;
    (window as any).authDebug = {
      isAuthenticated: state.isAuthenticated,
      isInitialized: state.isInitialized,
      isLoading: state.isLoading,
      user: state.user,
      error: state.error,
      loginStep: loginStep
    };
  }, [state, loginStep]);

  // Clean up any auth redirect URLs when component mounts
  useEffect(() => {
    localStorage.removeItem('auth_redirect_url');
    localStorage.removeItem('login_redirect_in_progress');
    console.log('🧹 LoginPage: Cleaned up redirect URLs on mount');
    // Reset redirect flag when component mounts (fresh login)
    redirectAttempted.current = false;
  }, []);

  const redirectAttempted = React.useRef(false);

  useEffect(() => {
    // Redirect after successful authentication
    if (state.isAuthenticated && state.isInitialized && !state.isLoading && !redirectAttempted.current) {
      console.log('✅ Authentication successful, validating subdomain access...');
      redirectAttempted.current = true; // Prevent multiple redirects

      // Check for access_denied error to prevent infinite loops
      const params = new URLSearchParams(location.search);
      if (params.get('error') === 'access_denied') {
        const errorReason = params.get('error_reason');
        console.log('⛔ Access Denied from Protected Route. Stopping auto-redirect.');
        setError(`Erişim engellendi: ${errorReason || 'Bu sayfayı görüntüleme yetkiniz yok.'}`);
        setLoading(false);
        redirectAttempted.current = true; // Mark as attempted so it doesn't retry
        return;
      }

      // Validate user role matches subdomain
      if (state.user?.roles) {
        const validation = validateUserSubdomainAccess(state.user.roles);

        if (!validation.isValid && validation.shouldRedirect && validation.redirectUrl) {
          console.log('⚠️ User role mismatch with subdomain, redirecting to:', validation.redirectUrl);
          window.location.href = validation.redirectUrl;
          return;
        }
      }

      // Build the correct target URL based on user type
      const buildRedirectUrl = (): string => {
        const user = state.user;

        // SUPER_ADMIN → /admin/clinics
        if (user?.roles?.includes('SUPER_ADMIN')) {
          return '/admin/clinics';
        }

        // STAFF with clinicSlug → /:clinicSlug/dashboard
        if (user?.userType === 'STAFF' && user?.clinicSlug) {
          return `/${user.clinicSlug}/dashboard`;
        }

        // OWNER → /portal/dashboard
        if (user?.userType === 'OWNER') {
          return '/portal/dashboard';
        }

        // Fallback: use redirect param or dashboard
        const params = new URLSearchParams(location.search);
        return params.get('redirect') || '/dashboard';
      };

      const targetUrl = buildRedirectUrl();
      console.log('🔗 Redirecting to:', targetUrl);

      // Set success state and redirect after a short delay
      setLoginStep('success');
      setShowSuccessMessage(true);
      setTimeout(() => {
        // Use window.location.href for cross-subdomain navigation, navigate() for same-origin
        if (targetUrl.startsWith('http')) {
          window.location.href = targetUrl;
        } else {
          navigate(targetUrl, { replace: true });
        }
      }, 1500);
    }
  }, [state.isAuthenticated, state.isInitialized, state.isLoading, state.user, location.search, navigate]);

  useEffect(() => {
    // Only show error if it's not an initialization error
    if (state.error && state.error !== 'Not authenticated' && state.isInitialized) {
      setError(state.error);
      setLoading(false);
    }
  }, [state.error, state.isInitialized]);

  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep(1);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleMFAVerification = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate MFA verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (mfaCode.length === 6) {
        setLoginStep('success');
        setShowMFADialog(false);
      } else {
        setError('Invalid MFA code');
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'MFA verification failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [mfaCode, onError]);

  const handleThemeChange = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(newTheme);
    // This would typically update the app theme
  }, []);

  const handleLanguageChange = useCallback((newLanguage: 'tr' | 'en') => {
    setCurrentLanguage(newLanguage);
    // This would typically update the app language
  }, []);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const redirectUrl = useMemo(() => {
    return new URLSearchParams(location.search).get('redirect') || '/dashboard';
  }, [location.search]);

  // ============================================================================
  // Render Components
  // ============================================================================

  const renderHeader = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Fade in={animationStep >= 1} timeout={800}>
        <Box>
          <Zoom in={animationStep >= 1} timeout={1000}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: 'auto',
                mb: 2,
                background: isAdminPortal
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: `${floatAnimation} 3s ease-in-out infinite`,
              }}
            >
              {isAdminPortal ? <AdminPanelSettings sx={{ fontSize: 40 }} /> : <Pets sx={{ fontSize: 40 }} />}
            </Avatar>
          </Zoom>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              animation: `${gradientAnimation} 3s ease infinite`,
              backgroundSize: '200% 200%'
            }}
          >
            {isAdminPortal ? 'Admin Portal' : companyName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {isAdminPortal ? 'Sistem Yönetimi' : 'Veteriner Klinik Yönetim Sistemi'}
          </Typography>
          {isAdminPortal ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<Shield />}
                label="Güvenli"
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<AdminPanelSettings />}
                label="Yönetici"
                size="small"
                variant="outlined"
                color="secondary"
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<MedicalServices />}
                label="Sağlık"
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<Schedule />}
                label="Randevu"
                size="small"
                variant="outlined"
                color="secondary"
              />
              <Chip
                icon={<Analytics />}
                label="Analiz"
                size="small"
                variant="outlined"
                color="success"
              />
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );

  const renderLoginOptions = () => (
    <Fade in={animationStep >= 1} timeout={1200}>
      <Box sx={{ mb: 3 }}>
        {loginMethods.includes('password') && (
          <Slide in={animationStep >= 1} direction="up" timeout={1000}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => setLoginStep('password')}
              disabled={loading}
              startIcon={<Person />}
              sx={{
                mb: 2,
                py: 1.5,
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Email ve Şifre ile Giriş
            </Button>
          </Slide>
        )}

        {loginMethods.includes('mfa') && (
          <Slide in={animationStep >= 1} direction="up" timeout={1200}>
            <Button
              fullWidth
              variant="text"
              size="large"
              onClick={() => setShowMFADialog(true)}
              disabled={loading}
              startIcon={<Shield />}
              sx={{
                py: 1.5,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'primary.main',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Multi-Factor Authentication
            </Button>
          </Slide>
        )}
      </Box>
    </Fade>
  );

  const renderPasswordForm = () => (
    <Fade in={loginStep === 'password'} timeout={600}>
      <Box sx={{ mb: 3 }}>
        <LoginForm
          onSuccess={(idToken: any) => {
            console.log('✅ LoginForm: Login successful, token received');
            setLoading(false);
          }}
          onError={(errorMsg: any) => {
            setError(errorMsg);
            setLoading(false);
            if (onError) {
              onError(errorMsg);
            }
          }}
        />

        <Button
          fullWidth
          variant="text"
          onClick={() => setLoginStep('initial')}
          disabled={loading}
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          Geri Dön
        </Button>
      </Box>
    </Fade>
  );

  const renderMFADialog = () => (
    <Dialog
      open={showMFADialog}
      onClose={() => setShowMFADialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield color="primary" />
          Multi-Factor Authentication
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Güvenliğiniz için ek doğrulama gereklidir. Lütfen bir doğrulama yöntemi seçin.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {mockMFAMethods.map((method) => (
            <Paper
              key={method.type}
              elevation={selectedMFA?.type === method.type ? 8 : 2}
              sx={{
                p: 2,
                cursor: method.available ? 'pointer' : 'not-allowed',
                opacity: method.available ? 1 : 0.5,
                border: selectedMFA?.type === method.type ? '2px solid' : '1px solid',
                borderColor: selectedMFA?.type === method.type ? 'primary.main' : 'divider',
                '&:hover': method.available ? {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                } : {},
                transition: 'all 0.3s ease'
              }}
              onClick={() => method.available && setSelectedMFA(method)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {method.icon}
                <Typography variant="subtitle2" sx={{ ml: 1 }}>
                  {method.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {method.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        {selectedMFA && (
          <Fade in={!!selectedMFA} timeout={400}>
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Doğrulama Kodu"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="6 haneli kod"
                inputProps={{ maxLength: 6 }}
                disabled={loading}
                helperText={`${selectedMFA.name} ile gönderilen kodu giriniz`}
              />
            </Box>
          </Fade>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowMFADialog(false)}
          disabled={loading}
        >
          İptal
        </Button>
        <Button
          onClick={handleMFAVerification}
          disabled={loading || !selectedMFA || mfaCode.length !== 6}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <VpnKey />}
        >
          {loading ? 'Doğrulanıyor...' : 'Doğrula'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderSuccessState = () => (
    <Fade in={loginStep === 'success'} timeout={600}>
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Zoom in={loginStep === 'success'} timeout={800}>
          <CheckCircle
            sx={{
              fontSize: 80,
              color: 'success.main',
              animation: `${pulseAnimation} 2s ease-in-out infinite`
            }}
          />
        </Zoom>
        <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          Giriş Başarılı!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Yönlendiriliyorsunuz...
        </Typography>
        <LinearProgress
          sx={{
            mb: 2,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Hedef: {redirectUrl}
        </Typography>
      </Box>
    </Fade>
  );

  const renderControls = () => (
    <Box sx={{
      position: 'absolute',
      top: 20,
      right: 20,
      display: 'flex',
      gap: 1,
      zIndex: 1000
    }}>
      {showThemeSelector && (
        <Tooltip title="Tema Değiştir">
          <IconButton
            onClick={() => handleThemeChange(currentTheme === 'light' ? 'dark' : 'light')}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {currentTheme === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Tooltip>
      )}

      {showLanguageSelector && (
        <Tooltip title="Dil Değiştir">
          <IconButton
            onClick={() => handleLanguageChange(currentLanguage === 'tr' ? 'en' : 'tr')}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Language />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Sistem İstatistikleri">
        <IconButton
          onClick={() => setShowStatsDialog(true)}
          sx={{
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <Info />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderStatsDialog = () => (
    <Dialog
      open={showStatsDialog}
      onClose={() => setShowStatsDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Analytics color="primary" />
          Sistem İstatistikleri
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {mockLoginStats.totalLogins.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Giriş
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
              {mockLoginStats.successRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Başarı Oranı
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
              {mockLoginStats.averageResponseTime}s
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ortalama Yanıt Süresi
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
              {mockLoginStats.activeUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aktif Kullanıcı
            </Typography>
          </Paper>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Son güncelleme: {mockLoginStats.lastUpdate.toLocaleString('tr-TR')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowStatsDialog(false)}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );

  const renderErrorAlert = () => (
    <Fade in={!!error} timeout={400}>
      <Alert
        severity="error"
        sx={{ mb: 3 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setError(null)}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>Giriş Hatası</AlertTitle>
        {error}
      </Alert>
    </Fade>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: customBackground || `
            linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
            url('https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?q=80&w=2525&auto=format&fit=crop')
          `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {renderControls()}

      {/* Decorative Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
          filter: 'blur(50px)',
          animation: `${pulseAnimation} 4s ease-in-out infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.2) 0%, rgba(102, 126, 234, 0.2) 100%)',
          filter: 'blur(30px)',
          animation: `${floatAnimation} 5s ease-in-out infinite`
        }}
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            }}
          >
            {renderHeader()}
            {renderErrorAlert()}

            <Box sx={{ position: 'relative', minHeight: 200 }}>
              {loginStep === 'initial' && renderLoginOptions()}
              {loginStep === 'password' && renderPasswordForm()}
              {loginStep === 'success' && renderSuccessState()}
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                &copy; {new Date().getFullYear()} {companyName}. Tüm hakları saklıdır.
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>

      {renderMFADialog()}
      {renderStatsDialog()}

      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
      >
        <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
          İşlem başarılı!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;