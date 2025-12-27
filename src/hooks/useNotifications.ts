import { useUIStore } from '../stores';

/**
 * Backward-compatible hook for components using ErrorContext
 * Maps ErrorContext API to uiStore notification methods
 */
export function useNotifications() {
    const showSuccess = useUIStore((state) => state.showSuccess);
    const showError = useUIStore((state) => state.showError);
    const showWarning = useUIStore((state) => state.showWarning);
    const showInfo = useUIStore((state) => state.showInfo);

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        // Alias for ErrorContext compatibility
        addError: (message: string, type?: 'error' | 'warning' | 'info' | 'success', details?: string) => {
            switch (type) {
                case 'success':
                    showSuccess(message);
                    break;
                case 'warning':
                    showWarning(message);
                    break;
                case 'info':
                    showInfo(message);
                    break;
                case 'error':
                default:
                    showError(message, details);
                    break;
            }
        },
    };
}
