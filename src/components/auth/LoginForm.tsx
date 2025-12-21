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
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{ mt: 3, mb: 2 }}
            >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
        </Box>
    );
};

export default LoginForm;

