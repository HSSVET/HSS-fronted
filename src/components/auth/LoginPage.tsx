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
  Snackbar,
  useTheme
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
import loginIllustration from '../../assets/images/login-page.png';

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
  const theme = useTheme();
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
    <Box sx={{ textAlign: 'center', mb: 3.5 }}>
      <Fade in={animationStep >= 1} timeout={800}>
        <Box>
          <Zoom in={animationStep >= 1} timeout={1000}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                margin: 'auto',
                mb: 2,
                background: isAdminPortal
                  ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: '0 14px 30px rgba(0,0,0,0.12)',
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
              fontWeight: 900,
              mb: 0.75,
              letterSpacing: '-0.6px',
              color: 'text.primary',
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
                sx={{
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(0,0,0,0.10)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<AdminPanelSettings />}
                label="Yönetici"
                size="small"
                sx={{
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(0,0,0,0.10)',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<MedicalServices />}
                label="Sağlık"
                size="small"
                sx={{
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(0,0,0,0.10)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<Schedule />}
                label="Randevu"
                size="small"
                sx={{
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(0,0,0,0.10)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<Analytics />}
                label="Analiz"
                size="small"
                sx={{
                  borderRadius: 999,
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(0,0,0,0.10)',
                  backdropFilter: 'blur(10px)',
                }}
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
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          customBackground ||
          `
            radial-gradient(circle at 12% 12%, rgba(146, 167, 140, 0.34) 0%, rgba(146, 167, 140, 0) 52%),
            radial-gradient(circle at 88% 18%, rgba(180, 199, 175, 0.28) 0%, rgba(180, 199, 175, 0) 56%),
            radial-gradient(circle at 22% 86%, rgba(247, 205, 130, 0.22) 0%, rgba(247, 205, 130, 0) 55%),
            linear-gradient(135deg, rgba(232, 245, 233, 0.95) 0%, rgba(224, 242, 241, 0.86) 45%, rgba(255, 255, 255, 0.94) 100%)
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
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}55 0%, ${theme.palette.primary.main}33 100%)`,
          filter: 'blur(70px)',
          animation: `${pulseAnimation} 4s ease-in-out infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          right: -50,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.secondary.light}55 0%, ${theme.palette.secondary.main}33 100%)`,
          filter: 'blur(60px)',
          animation: `${floatAnimation} 5s ease-in-out infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: '55%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}33 0%, rgba(0,0,0,0) 65%)`,
          filter: 'blur(80px)',
          transform: 'translate(-50%, -50%)',
          animation: `${floatAnimation} 6s ease-in-out infinite`
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <Fade in timeout={800}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              gap: { xs: 2, md: 2.5 },
              alignItems: 'stretch',
            }}
          >
            {/* Brand / Value Panel */}
            <Paper
              elevation={0}
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'relative',
                overflow: 'hidden',
                p: 3.25,
                borderRadius: 6,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.55) 100%)',
                border: '1px solid rgba(255,255,255,0.65)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                boxShadow: '0 18px 48px rgba(0, 0, 0, 0.10)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: 24,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}55, ${theme.palette.secondary.main}44, ${theme.palette.primary.light}55)`,
                  filter: 'blur(18px)',
                  opacity: 0.9,
                  zIndex: 0,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 24,
                  background:
                    'radial-gradient(circle at 20% 20%, rgba(46,125,50,0.22) 0%, rgba(46,125,50,0) 45%), radial-gradient(circle at 85% 30%, rgba(0,121,107,0.18) 0%, rgba(0,121,107,0) 40%), radial-gradient(circle at 50% 90%, rgba(247,205,130,0.18) 0%, rgba(247,205,130,0) 40%)',
                  zIndex: 0,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                    }}
                  >
                    <Pets />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 900, letterSpacing: '-0.4px' }}>
                      {companyName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Klinik operasyonlarını tek panelde yönetin.
                    </Typography>
                  </Box>
                </Box>

                {/* Mini canlı istatistikler */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  {[
                    { label: 'Aktif Klinik', value: '24' },
                    { label: 'Bugünkü Randevu', value: '128' },
                    { label: 'Kayıtlı Hasta', value: '4.320+' },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        bgcolor: 'rgba(255,255,255,0.75)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'rgba(46,125,50,0.9)',
                          boxShadow: '0 0 0 6px rgba(46,125,50,0.16)',
                          animation: `${pulseAnimation} 3s ease-in-out infinite`,
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: 11, color: 'rgba(0,0,0,0.55)' }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{item.value}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1.25,
                    mt: 1,
                  }}
                >
                  {[
                    { icon: <Schedule />, title: 'Akıllı Randevu', desc: 'Günlük akışı hızlı planla' },
                    { icon: <MedicalServices />, title: 'Hasta Kayıtları', desc: 'Hızlı erişim & takip' },
                    { icon: <Analytics />, title: 'Analiz & Rapor', desc: 'Özetlerle karar ver' },
                    { icon: <Shield />, title: 'Güvenli Giriş', desc: 'Rol bazlı erişim' },
                  ].map((item) => (
                    <Box
                      key={item.title}
                      sx={{
                        p: 1.5,
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.65)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 3,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(224,242,241,0.75)',
                            border: '1px solid rgba(0,121,107,0.18)',
                            color: 'rgba(0,121,107,1)',
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>
                            {item.title}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: 'rgba(0,0,0,0.58)' }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Solda statik illüstrasyon (public klasörüne eklenen görsel) */}
                <Box
                  sx={{
                    mt: 2.5,
                    borderRadius: 5,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 16px 34px rgba(0,0,0,0.10)',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Box
                    component="img"
                    src={loginIllustration}
                    alt="Veteriner klinik illüstrasyonu"
                    sx={{
                      width: '100%',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

              </Box>
            </Paper>

            {/* Login Panel */}
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                p: { xs: 3, sm: 4 },
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: '0 18px 48px rgba(0, 0, 0, 0.12)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: 24,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}55, ${theme.palette.secondary.main}44, ${theme.palette.primary.light}55)`,
                  opacity: 0.8,
                  zIndex: 0,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
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
              </Box>
            </Paper>
          </Box>
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