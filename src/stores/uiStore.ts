import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

/**
 * UI Store - Manages global UI state
 * This includes modals, notifications, loading states, etc.
 */

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export interface Modal {
    id: string;
    isOpen: boolean;
    title?: string;
    content?: React.ReactNode;
    onClose?: () => void;
}

interface UIState {
    // Toast notifications
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // Notification helpers (ErrorContext compatibility)
    showSuccess: (message: string) => void;
    showError: (message: string, details?: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;

    // Modals
    modals: Record<string, boolean>;
    openModal: (id: string) => void;
    closeModal: (id: string) => void;
    toggleModal: (id: string) => void;

    // Loading states
    loadingStates: Record<string, boolean>;
    setLoading: (key: string, loading: boolean) => void;
    isLoading: (key: string) => boolean;

    // Sidebar
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // Theme
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;

    // Confirmation dialogs
    confirmDialog: {
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    } | null;
    showConfirmDialog: (config: Omit<NonNullable<UIState['confirmDialog']>, 'isOpen'>) => void;
    hideConfirmDialog: () => void;
}

export const useUIStore = create<UIState>()(
    devtools(
        immer((set, get) => ({
            // Toast notifications
            toasts: [],

            addToast: (toast) => {
                const id = crypto.randomUUID();
                set((state) => {
                    state.toasts.push({ ...toast, id });
                });

                // Auto remove after duration
                if (toast.duration !== 0) {
                    setTimeout(() => {
                        get().removeToast(id);
                    }, toast.duration || 5000);
                }
            },

            removeToast: (id) => {
                set((state) => {
                    state.toasts = state.toasts.filter((t) => t.id !== id);
                });
            },

            clearToasts: () => {
                set((state) => {
                    state.toasts = [];
                });
            },

            // Notification helpers (ErrorContext compatibility)
            showSuccess: (message) => {
                get().addToast({ message, type: 'success', duration: 5000 });
            },

            showError: (message, details) => {
                const fullMessage = details ? `${message}: ${details}` : message;
                get().addToast({ message: fullMessage, type: 'error', duration: 0 }); // Don't auto-dismiss errors
            },

            showWarning: (message) => {
                get().addToast({ message, type: 'warning', duration: 5000 });
            },

            showInfo: (message) => {
                get().addToast({ message, type: 'info', duration: 5000 });
            },

            // Modals
            modals: {},

            openModal: (id) => {
                set((state) => {
                    state.modals[id] = true;
                });
            },

            closeModal: (id) => {
                set((state) => {
                    state.modals[id] = false;
                });
            },

            toggleModal: (id) => {
                set((state) => {
                    state.modals[id] = !state.modals[id];
                });
            },

            // Loading states
            loadingStates: {},

            setLoading: (key, loading) => {
                set((state) => {
                    state.loadingStates[key] = loading;
                });
            },

            isLoading: (key) => {
                return get().loadingStates[key] || false;
            },

            // Sidebar
            sidebarOpen: true,

            setSidebarOpen: (open) => {
                set((state) => {
                    state.sidebarOpen = open;
                });
            },

            toggleSidebar: () => {
                set((state) => {
                    state.sidebarOpen = !state.sidebarOpen;
                });
            },

            // Theme
            theme: 'light',

            setTheme: (theme) => {
                set((state) => {
                    state.theme = theme;
                });
            },

            toggleTheme: () => {
                set((state) => {
                    state.theme = state.theme === 'light' ? 'dark' : 'light';
                });
            },

            // Confirmation dialog
            confirmDialog: null,

            showConfirmDialog: (config) => {
                set((state) => {
                    state.confirmDialog = { ...config, isOpen: true };
                });
            },

            hideConfirmDialog: () => {
                set((state) => {
                    state.confirmDialog = null;
                });
            },
        })),
        { name: 'HSS-UI-Store' }
    )
);

// Selectors for better performance
export const selectToasts = (state: UIState) => state.toasts;
export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectConfirmDialog = (state: UIState) => state.confirmDialog;
export const selectModalOpen = (id: string) => (state: UIState) => state.modals[id] || false;
export const selectIsLoading = (key: string) => (state: UIState) => state.loadingStates[key] || false;
