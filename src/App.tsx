import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './shared';
import { Dashboard } from './features/dashboard';
import { AnimalPage, AnimalDetailPage } from './features/animals';
import { AppointmentPage } from './features/appointments';
import { LabDashboard, LabTestTypes } from './features/laboratory';
import { Billing } from './features/billing';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute, {
  RoleBasedRoute,
  PermissionBasedRoute,
  AdminRoute,
  VeterinarianRoute
} from './components/auth/ProtectedRoute';
import AccessDenied from './components/common/AccessDenied';

// Error Boundaries
import {
  GlobalErrorBoundary,
  PageErrorBoundary,
  ComponentErrorBoundary
} from './components/common/ErrorBoundary';

// Test Components
import AuthButton from './components/auth/AuthButton';
import ApiTestComponent from './components/auth/ApiTestComponent';

import './shared/styles/App.css';

// ============================================================================
// Theme Configuration
// ============================================================================

const theme = createTheme({
  palette: {
    primary: {
      main: '#92A78C',
      light: '#B4C7AF',
      dark: '#6A7B65',
    },
    secondary: {
      main: '#F7CD82',
      light: '#FFEEB0',
      dark: '#D5AE60',
    },
    background: {
      default: '#F9F9F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// ============================================================================
// Main App Component
// ============================================================================

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalErrorBoundary>
        <AuthProvider>
          <AppProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PageErrorBoundary pageName="Login">
                      <LoginPage />
                    </PageErrorBoundary>
                  }
                />

                {/* Access Denied Route */}
                <Route
                  path="/access-denied"
                  element={
                    <PageErrorBoundary pageName="Access Denied">
                      <AccessDenied />
                    </PageErrorBoundary>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PageErrorBoundary pageName="Dashboard">
                          <Dashboard />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PageErrorBoundary pageName="Dashboard">
                          <Dashboard />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Animals - Role-based access */}
                <Route
                  path="/animals"
                  element={
                    <ProtectedRoute requiredPermissions={['animals:read']}>
                      <Layout>
                        <PageErrorBoundary pageName="Animals">
                          <AnimalPage />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/animals/:id"
                  element={
                    <ProtectedRoute requiredPermissions={['animals:read']}>
                      <Layout>
                        <PageErrorBoundary pageName="Animal Details">
                          <AnimalDetailPage />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Appointments - Role-based access */}
                <Route
                  path="/appointments"
                  element={
                    <ProtectedRoute requiredPermissions={['appointments:read']}>
                      <Layout>
                        <PageErrorBoundary pageName="Appointments">
                          <AppointmentPage />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Laboratory - Role-based access */}
                <Route
                  path="/laboratory"
                  element={
                    <ProtectedRoute requiredPermissions={['laboratory:read']}>
                      <Layout>
                        <PageErrorBoundary pageName="Laboratory">
                          <LabDashboard />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/laboratory/test-types"
                  element={
                    <ProtectedRoute requiredPermissions={['laboratory:read']}>
                      <Layout>
                        <PageErrorBoundary pageName="Lab Test Types">
                          <LabTestTypes />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Billing - Role-based access */}
                <Route
                  path="/billing"
                  element={
                    <ProtectedRoute requiredPermissions={['billing:read']}>
                      <Layout>
                        <PageErrorBoundary pageName="Billing">
                          <Billing />
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Inventory - Admin/Veterinarian only */}
                <Route
                  path="/inventory"
                  element={
                    <VeterinarianRoute>
                      <Layout>
                        <PageErrorBoundary pageName="Inventory">
                          <div>Envanter/Stok Sayfası (Yakında)</div>
                        </PageErrorBoundary>
                      </Layout>
                    </VeterinarianRoute>
                  }
                />

                {/* Reports - Admin/Veterinarian only */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute requiredPermissions={['reports:read']}>
                      <Layout>
                        <PageErrorBoundary pageName="Reports">
                          <div>Raporlar Sayfası (Yakında)</div>
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Settings - Admin only */}
                <Route
                  path="/settings"
                  element={
                    <AdminRoute>
                      <Layout>
                        <PageErrorBoundary pageName="Settings">
                          <div>Ayarlar Sayfası (Yakında)</div>
                        </PageErrorBoundary>
                      </Layout>
                    </AdminRoute>
                  }
                />

                {/* User Management - Admin only */}
                <Route
                  path="/users"
                  element={
                    <AdminRoute>
                      <Layout>
                        <PageErrorBoundary pageName="User Management">
                          <div>Kullanıcı Yönetimi (Yakında)</div>
                        </PageErrorBoundary>
                      </Layout>
                    </AdminRoute>
                  }
                />

                {/* Audit Logs - Admin only */}
                <Route
                  path="/audit"
                  element={
                    <AdminRoute>
                      <Layout>
                        <PageErrorBoundary pageName="Audit Logs">
                          <div>Denetim Günlükleri (Yakında)</div>
                        </PageErrorBoundary>
                      </Layout>
                    </AdminRoute>
                  }
                />

                {/* Development/Testing Routes */}
                <Route
                  path="/auth-test"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PageErrorBoundary pageName="Auth Test">
                          <ComponentErrorBoundary componentName="AuthTest">
                            <div>
                              <AuthButton />
                              <ApiTestComponent />
                            </div>
                          </ComponentErrorBoundary>
                        </PageErrorBoundary>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Error Test Route - Admin only */}
                <Route
                  path="/error-test"
                  element={
                    <AdminRoute>
                      <Layout>
                        <PageErrorBoundary pageName="Error Test">
                          <ComponentErrorBoundary componentName="ErrorTest">
                            <div>
                              <h2>Error Testing</h2>
                              <button onClick={() => { throw new Error('Test error!'); }}>
                                Throw Test Error
                              </button>
                              <button onClick={() => {
                                const badComponent = null as any;
                                return badComponent.nonExistentMethod();
                              }}>
                                Cause Runtime Error
                              </button>
                            </div>
                          </ComponentErrorBoundary>
                        </PageErrorBoundary>
                      </Layout>
                    </AdminRoute>
                  }
                />

                {/* Fallback - Redirect to login */}
                <Route
                  path="*"
                  element={<Navigate to="/login" replace />}
                />
              </Routes>
            </Router>
          </AppProvider>
        </AuthProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
