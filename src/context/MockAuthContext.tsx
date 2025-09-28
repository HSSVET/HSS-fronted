import React, { createContext, useContext, ReactNode } from 'react';

// Mock user for offline mode
const mockUser = {
  id: 'mock-user',
  sub: 'mock-user',
  username: 'demo_user',
  email: 'demo@vetklinik.com',
  firstName: 'Demo',
  lastName: 'User',
  roles: ['ADMIN', 'VETERINER'], // Give all roles for demo
  permissions: [
    'dashboard:read',
    'animals:read',
    'animals:write',
    'appointments:read',
    'appointments:write',
    'laboratory:read',
    'laboratory:write',
    'billing:read',
    'billing:write',
    'inventory:read',
    'inventory:write',
    'reports:read',
    'settings:read',
    'settings:write',
    'vaccinations:read',
    'vaccinations:write'
  ],
  lastLogin: new Date(),
  sessionId: 'mock-session',
  department: 'Veterinary',
  title: 'Demo Veteriner'
};

// Mock auth context interface
interface MockAuthContextType {
  user: typeof mockUser;
  isAuthenticated: boolean;
  isInitialized: boolean;
  permissions: string[];
  roles: string[];
  logout: () => void;
}

const MockAuthContext = createContext<MockAuthContextType | null>(null);

interface MockAuthProviderProps {
  children: ReactNode;
}

export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({ children }) => {
  const logout = () => {
    console.log('Mock logout called - redirecting to dashboard');
    // In offline mode, we don't actually logout, just show a message
  };

  const contextValue: MockAuthContextType = {
    user: mockUser,
    isAuthenticated: true,
    isInitialized: true,
    permissions: mockUser.permissions,
    roles: mockUser.roles,
    logout
  };

  return (
    <MockAuthContext.Provider value={contextValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within MockAuthProvider');
  }
  return context;
};

export default MockAuthProvider;