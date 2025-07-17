import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
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
  Switch,
  FormControlLabel,
  Container,
  Paper,
  Avatar,
  Snackbar
} from '@mui/material';
import {
  Security as SecurityIcon,
  Visibility,
  VisibilityOff,
  Info,
  CheckCircle,
  Error,
  VpnKey,
  Shield,
  Lock,
  Person,
  Language,
  DarkMode,
  LightMode,
  Close,
  ArrowForward,
  Fingerprint,
  Smartphone,
  Email,
  Pets,
  MedicalServices,
  Schedule,
  Analytics
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

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
  const { state, login } = useAuth();

  // ============================================================================
  // State Management
  // ============================================================================

  const [loginStep, setLoginStep] = useState<'initial' | 'password' | 'mfa' | 'success'>('initial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedMFA, setSelectedMFA] = useState<MFAMethod | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showMFADialog, setShowMFADialog] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [currentLanguage, setCurrentLanguage] = useState<'tr' | 'en'>('tr');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      setLoginStep('success');
      setShowSuccessMessage(true);
      
      // Auto-redirect after success
      const timer = setTimeout(() => {
        const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/dashboard';
        navigate(redirectUrl, { replace: true });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [state.isAuthenticated, state.isLoading, navigate, location]);

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

  const handleSSOLogin = useCallback(async () => {
    try {
      console.log('🔑 SSO Login started...');
      setLoading(true);
      setError(null);
      
      const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/dashboard';
      console.log('🔗 Redirect URL:', redirectUrl);
      
      console.log('🚀 Calling login function...');
      await login(redirectUrl);
      console.log('✅ Login function completed');
      
      if (onLogin) {
        onLogin();
      }
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      const errorMessage = (error as Error)?.message || 'Login failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [login, location, onLogin, onError]);

  const handlePasswordLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate password login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (loginMethods.includes('mfa')) {
        setLoginStep('mfa');
        setShowMFADialog(true);
      } else {
        setLoginStep('success');
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Password login failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [loginMethods, onError]);

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

  const isFormValid = useMemo(() => {
    if (loginStep === 'password') {
      return username.length > 0 && password.length > 0;
    }
    if (loginStep === 'mfa') {
      return mfaCode.length === 6;
    }
    return true;
  }, [loginStep, username, password, mfaCode]);

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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: `${floatAnimation} 3s ease-in-out infinite`,
              }}
            >
              <Pets sx={{ fontSize: 40 }} />
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
            {companyName}
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Veteriner Klinik Yönetim Sistemi
          </Typography>
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
        </Box>
      </Fade>
    </Box>
  );

  const renderLoginOptions = () => (
    <Fade in={animationStep >= 1} timeout={1200}>
      <Box sx={{ mb: 3 }}>
        {loginMethods.includes('sso') && (
          <Slide in={animationStep >= 1} direction="up" timeout={800}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSSOLogin}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
              sx={{
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(102, 126, 234, 0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Keycloak ile Giriş Yap'}
            </Button>
          </Slide>
        )}

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
              Kullanıcı Adı ve Şifre ile Giriş
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
        <TextField
          fullWidth
          label="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
          disabled={loading}
          InputProps={{
            startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          disabled={loading}
          InputProps={{
            startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        
        {allowRememberMe && (
          <FormControlLabel
            control={
              <Switch
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
            }
            label="Beni Hatırla"
            sx={{ mt: 1, mb: 2 }}
          />
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePasswordLogin}
          disabled={loading || !isFormValid}
          startIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
          sx={{
            mb: 2,
            py: 1.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              background: 'rgba(102, 126, 234, 0.3)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={() => setLoginStep('initial')}
          disabled={loading}
          sx={{ color: 'text.secondary' }}
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
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      {renderControls()}
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, 
        gap: 4, 
        minHeight: '100vh' 
      }}>
        {/* Left Panel - Branding & Info */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          height: '100%',
          px: { xs: 2, md: 4 }
        }}>
          <Slide in={animationStep >= 1} direction="right" timeout={1000}>
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Veteriner Klinik
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3,
                  color: 'text.secondary',
                  fontWeight: 300
                }}
              >
                Yönetim Sistemi
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}
              >
                Modern, güvenli ve kullanıcı dostu arayüz ile veteriner klinik süreçlerinizi 
                dijitalleştirin. Randevu yönetimi, hasta takibi, faturalandırma ve daha fazlası.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<MedicalServices />}
                  label="Hasta Yönetimi"
                  variant="outlined"
                  size="medium"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
                <Chip
                  icon={<Schedule />}
                  label="Randevu Sistemi"
                  variant="outlined"
                  size="medium"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
                <Chip
                  icon={<Analytics />}
                  label="Raporlama"
                  variant="outlined"
                  size="medium"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
                <Chip
                  icon={<Shield />}
                  label="Güvenli"
                  variant="outlined"
                  size="medium"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </Box>
            </Box>
          </Slide>
        </Box>

        {/* Right Panel - Login Form */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          height: '100%',
          px: { xs: 2, md: 4 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            height: '100%',
            px: { xs: 2, md: 4 }
          }}>
            <Slide in={animationStep >= 1} direction="left" timeout={1200}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 4,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  overflow: 'visible',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px 16px 0 0',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {loginStep === 'success' ? renderSuccessState() : (
                    <>
                      {renderHeader()}
                      {error && renderErrorAlert()}
                      {loginStep === 'initial' && renderLoginOptions()}
                      {loginStep === 'password' && renderPasswordForm()}
                    </>
                  )}
                </CardContent>
              </Card>
            </Slide>
          </Box>
        </Box>
      </Box>

      {renderMFADialog()}
      {renderStatsDialog()}
      
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Giriş başarılı! Yönlendiriliyorsunuz...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage; 