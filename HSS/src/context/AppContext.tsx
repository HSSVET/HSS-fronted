import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { User } from '../types/common';

// State interface
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  theme: 'light',
  sidebarOpen: true,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Action creators
export const appActions = {
  setUser: (user: User) => ({ type: 'SET_USER' as const, payload: user }),
  logout: () => ({ type: 'LOGOUT' as const }),
  setLoading: (loading: boolean) => ({ type: 'SET_LOADING' as const, payload: loading }),
  setError: (error: string | null) => ({ type: 'SET_ERROR' as const, payload: error }),
  toggleTheme: () => ({ type: 'TOGGLE_THEME' as const }),
  toggleSidebar: () => ({ type: 'TOGGLE_SIDEBAR' as const }),
  setSidebar: (open: boolean) => ({ type: 'SET_SIDEBAR' as const, payload: open }),
}; 