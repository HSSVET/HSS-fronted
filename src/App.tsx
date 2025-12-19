import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, CircularProgress, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ErrorProvider } from './context/ErrorContext';
import { Layout } from './shared';
import Toast from './components/Toast';
import {
  GlobalErrorBoundary,
  PageErrorBoundary,
  ComponentErrorBoundary
} from './components/common/ErrorBoundary';
import './shared/styles/App.css';

// Code Splitting: Route bazlı lazy loading
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
              {/* Main Dashboard Route */}
              <Route
                path="/"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Dashboard">
                      <Suspense fallback={<SuspenseFallback />}>
                        <Dashboard />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Dashboard">
                      <Suspense fallback={<SuspenseFallback />}>
                        <Dashboard />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Animals */}
              <Route
                path="/animals"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Animals">
                      <Suspense fallback={<SuspenseFallback />}>
                        <AnimalPage />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              <Route
                path="/animals/:id"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Animal Details">
                      <Suspense fallback={<SuspenseFallback />}>
                        <AnimalDetailPage />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Appointments */}
              <Route
                path="/appointments"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Appointments">
                      <Suspense fallback={<SuspenseFallback />}>
                        <AppointmentPage />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Laboratory */}
              <Route
                path="/laboratory"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Laboratory">
                      <Suspense fallback={<SuspenseFallback />}>
                        <LabDashboard />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              <Route
                path="/laboratory/test-types"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Lab Test Types">
                      <Suspense fallback={<SuspenseFallback />}>
                        <LabTestTypes />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Billing */}
              <Route
                path="/billing"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Billing">
                      <Suspense fallback={<SuspenseFallback />}>
                        <Billing />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Inventory */}
              <Route
                path="/inventory"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Inventory">
                      <div>Envanter/Stok Sayfası (Yakında)</div>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Reports */}
              <Route
                path="/reports"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Reports">
                      <div>Raporlar Sayfası (Yakında)</div>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Documents */}
              <Route
                path="/documents"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Documents">
                      <Suspense fallback={<SuspenseFallback />}>
                        <DocumentPage />
                      </Suspense>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Settings */}
              <Route
                path="/settings"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Settings">
                      <div>Ayarlar Sayfası (Yakında)</div>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* User Management */}
              <Route
                path="/users"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="User Management">
                      <div>Kullanıcı Yönetimi (Yakında)</div>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Audit Logs */}
              <Route
                path="/audit"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Audit Logs">
                      <div>Denetim Günlükleri (Yakında)</div>
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              {/* Fallback - Redirect to dashboard */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
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
