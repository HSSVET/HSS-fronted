import React, { useState } from 'react';
import {
    Button,
    TextField,
    Box,
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress,
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
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 3,
                        borderRadius: '12px',
                        border: '1px solid rgba(211, 47, 47, 0.2)',
                        bgcolor: 'rgba(255, 245, 245, 0.8)',
                        backdropFilter: 'blur(10px)',
                        '& .MuiAlert-icon': {
                            color: '#d32f2f'
                        }
                    }}
                >
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
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            transition: 'all 0.3s ease',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(102, 126, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                        },
                        '&.Mui-focused': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        }
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#667eea',
                            fontWeight: 500,
                        }
                    }
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
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.5)',
                                    '&:hover': {
                                        color: '#667eea',
                                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                                    }
                                }}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            transition: 'all 0.3s ease',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(102, 126, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                        },
                        '&.Mui-focused': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        }
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#667eea',
                            fontWeight: 500,
                        }
                    }
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{ 
                    mt: 1,
                    mb: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    },
                    '&.Mui-disabled': {
                        background: 'rgba(102, 126, 234, 0.3)',
                        color: 'rgba(255, 255, 255, 0.7)',
                    }
                }}
            >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
        </Box>
    );
};

export default LoginForm;

