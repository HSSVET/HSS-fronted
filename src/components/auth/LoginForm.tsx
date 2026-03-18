import React, { useState } from 'react';
import {
    Button,
    TextField,
    Box,
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress,
    useTheme,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
} from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface LoginFormProps {
    onSuccess?: (idToken: string) => void;
    onError?: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Firebase SDK ile login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // ID token al
            const idToken = await userCredential.user.getIdToken(true);

            // Token'ı localStorage'a kaydet (API çağrıları için)
            localStorage.setItem('hss_id_token', idToken);

            if (onSuccess) {
                onSuccess(idToken);
            }
        } catch (err: any) {
            let errorMessage = 'Giriş başarısız';

            // Firebase Auth error codes
            switch (err.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Kullanıcı bulunamadı';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Hatalı şifre';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Geçersiz e-posta adresi';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Bu kullanıcı hesabı devre dışı bırakılmış';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin';
                    break;
                default:
                    errorMessage = err.message || 'Giriş başarısız';
            }

            setError(errorMessage);
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                autoComplete="email"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(10px)',
                        transition: 'box-shadow 150ms ease, border-color 150ms ease, transform 150ms ease',
                        '& fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
                        '&:hover fieldset': { borderColor: 'rgba(46,125,50,0.25)' },
                        '&.Mui-focused': {
                            boxShadow: '0 0 0 4px rgba(46,125,50,0.14)',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.dark },
                }}
            />

            <TextField
                fullWidth
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                autoComplete="current-password"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                disabled={loading}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(10px)',
                        transition: 'box-shadow 150ms ease, border-color 150ms ease, transform 150ms ease',
                        '& fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
                        '&:hover fieldset': { borderColor: 'rgba(46,125,50,0.25)' },
                        '&.Mui-focused': {
                            boxShadow: '0 0 0 4px rgba(46,125,50,0.14)',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.dark },
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.35,
                    borderRadius: 3,
                    fontWeight: 900,
                    letterSpacing: '-0.2px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 14px 30px rgba(0,0,0,0.14)',
                    transition: 'transform 150ms ease, box-shadow 150ms ease, filter 150ms ease',
                    '&:hover': {
                        filter: 'brightness(1.02)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    },
                }}
            >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
        </Box>
    );
};

export default LoginForm;

