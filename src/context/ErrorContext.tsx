import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ErrorInfo {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (message: string, type?: ErrorInfo['type'], details?: string, action?: ErrorInfo['action']) => void;
  removeError: (id: string) => void;
  clearAllErrors: () => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  showError: (message: string, details?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = useCallback((
    message: string, 
    type: ErrorInfo['type'] = 'error',
    details?: string,
    action?: ErrorInfo['action']
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newError: ErrorInfo = {
      id,
      message,
      type,
      timestamp: new Date(),
      details,
      action,
    };
    
    setErrors(prev => [...prev, newError]);
    
    // Auto remove after 5 seconds for non-error types
    if (type !== 'error') {
      setTimeout(() => {
        removeError(id);
      }, 5000);
    }
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const showSuccess = useCallback((message: string) => {
    addError(message, 'success');
  }, [addError]);

  const showWarning = useCallback((message: string) => {
    addError(message, 'warning');
  }, [addError]);

  const showInfo = useCallback((message: string) => {
    addError(message, 'info');
  }, [addError]);

  const showError = useCallback((message: string, details?: string) => {
    addError(message, 'error', details);
  }, [addError]);

  return (
    <ErrorContext.Provider value={{
      errors,
      addError,
      removeError,
      clearAllErrors,
      showSuccess,
      showWarning,
      showInfo,
      showError,
    }}>
      {children}
    </ErrorContext.Provider>
  );
};
