import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, CircularProgress, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ErrorProvider } from './context/ErrorContext';
import { Layout } from './shared';

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
import Toast from './components/Toast';
import './shared/styles/App.css';

// Code Splitting: Route bazlı lazy loading
/* eslint-disable import/first */
const Dashboard = lazy(() => import('./features/dashboard').then(module => ({ default: module.Dashboard })));
const AnimalPage = lazy(() => import('./features/animals').then(module => ({ default: module.AnimalPage })));
const AnimalDetailPage = lazy(() => import('./features/animals').then(module => ({ default: module.AnimalDetailPage })));
const AppointmentPage = lazy(() => import('./features/appointments').then(module => ({ default: module.AppointmentPage })));
const LabDashboard = lazy(() => import('./features/laboratory').then(module => ({ default: module.LabDashboard })));
const LabTestTypes = lazy(() => import('./features/laboratory').then(module => ({ default: module.LabTestTypes })));
const Billing = lazy(() => import('./features/billing').then(module => ({ default: module.Billing })));
const DocumentPage = lazy(() => import('./features/documents').then(module => ({ default: module.DocumentPage })));
const RemindersPage = lazy(() => import('./features/reminders').then(module => ({ default: module.RemindersPage })));
const SmsPage = lazy(() => import('./features/sms').then(module => ({ default: module.SmsPage })));
/* eslint-enable import/first */

// ============================================================================
// Loading Fallback Component for Suspense
// ============================================================================

const SuspenseFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <CircularProgress size={40} />
    <Box sx={{ fontSize: '14px', color: 'text.secondary' }}>
      Sayfa yükleniyor...
    </Box>
  </Box>
);

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
  console.log('🏠 App starting without authentication');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalErrorBoundary>
        <ErrorProvider>
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

                  {/* Main Dashboard Route - Protected */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Dashboard">
                            <Suspense fallback={<SuspenseFallback />}>
                              <Dashboard />
                            </Suspense>
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
                            <Suspense fallback={<SuspenseFallback />}>
                              <Dashboard />
                            </Suspense>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Animals - Protected & Role Based */}
                  <Route
                    path="/animals"
                    element={
                      <ProtectedRoute requiredPermissions={['animals:read']}>
                        <Layout>
                          <PageErrorBoundary pageName="Animals">
                            <Suspense fallback={<SuspenseFallback />}>
                              <AnimalPage />
                            </Suspense>
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
                            <Suspense fallback={<SuspenseFallback />}>
                              <AnimalDetailPage />
                            </Suspense>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Appointments - Protected & Role Based */}
                  <Route
                    path="/appointments"
                    element={
                      <ProtectedRoute requiredPermissions={['appointments:read']}>
                        <Layout>
                          <PageErrorBoundary pageName="Appointments">
                            <Suspense fallback={<SuspenseFallback />}>
                              <AppointmentPage />
                            </Suspense>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Laboratory - Protected & Role Based */}
                  <Route
                    path="/laboratory"
                    element={
                      <ProtectedRoute requiredPermissions={['laboratory:read']}>
                        <Layout>
                          <PageErrorBoundary pageName="Laboratory">
                            <Suspense fallback={<SuspenseFallback />}>
                              <LabDashboard />
                            </Suspense>
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
                            <Suspense fallback={<SuspenseFallback />}>
                              <LabTestTypes />
                            </Suspense>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Billing - Protected & Role Based */}
                  <Route
                    path="/billing"
                    element={
                      <ProtectedRoute requiredPermissions={['billing:read']}>
                        <Layout>
                          <PageErrorBoundary pageName="Billing">
                            <Suspense fallback={<SuspenseFallback />}>
                              <Billing />
                            </Suspense>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* SMS - Protected & Role Based (NEW) */}
                  <Route
                    path="/sms"
                    element={
                      <ProtectedRoute requiredPermissions={['sms:read']}>
                        <Layout>
                          <PageErrorBoundary pageName="SMS">
                            <Suspense fallback={<SuspenseFallback />}>
                              <SmsPage />
                            </Suspense>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Reminders - Admin/Veterinarian only (NEW) */}
                  <Route
                    path="/reminders"
                    element={
                      <VeterinarianRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Reminders">
                            <Suspense fallback={<SuspenseFallback />}>
                              <RemindersPage />
                            </Suspense>
                          </PageErrorBoundary>
                        </Layout>
                      </VeterinarianRoute>
                    }
                  />

                  {/* Inventory - Admin/Veterinarian only (NEW - Placeholder) */}
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

                  {/* Reports - Protected & Role Based */}
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

                  {/* Documents - Protected */}
                  <Route
                    path="/documents"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Documents">
                            <Suspense fallback={<SuspenseFallback />}>
                              <DocumentPage />
                            </Suspense>
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
              <Toast />
            </AppProvider>
          </AuthProvider>
        </ErrorProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
