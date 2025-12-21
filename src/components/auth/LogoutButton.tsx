import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
    onLogout?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, ...buttonProps }) => {
    const [loading, setLoading] = React.useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            // Firebase SDK ile logout
            await signOut(auth);

            // Token'ları temizle
            localStorage.removeItem('hss_id_token');
            localStorage.removeItem('hss_refresh_token');
            localStorage.removeItem('hss_token_expiry');
            localStorage.removeItem('hss_user_info');

            if (onLogout) {
                onLogout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Even if signOut fails, clear local state
            localStorage.removeItem('hss_id_token');
            localStorage.removeItem('hss_refresh_token');
            localStorage.removeItem('hss_token_expiry');
            localStorage.removeItem('hss_user_info');
            if (onLogout) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            {...buttonProps}
            onClick={handleLogout}
            disabled={loading || buttonProps.disabled}
            startIcon={<LogoutIcon />}
        >
            {loading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
        </Button>
    );
};

export default LogoutButton;

