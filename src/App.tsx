import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ErrorProvider } from './context/ErrorContext';
import { Layout } from './shared';
import { Dashboard } from './features/dashboard';
import { AnimalPage, AnimalDetailPage } from './features/animals';
import { AppointmentPage } from './features/appointments';
import { LabDashboard, LabTestTypes } from './features/laboratory';
import { Billing } from './features/billing';
import Toast from './components/Toast';

// Error Boundaries
import {
  GlobalErrorBoundary,
  PageErrorBoundary,
  ComponentErrorBoundary
} from './components/common/ErrorBoundary';


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
                      <Dashboard />
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Dashboard">
                      <Dashboard />
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
                      <AnimalPage />
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              <Route
                path="/animals/:id"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Animal Details">
                      <AnimalDetailPage />
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
                      <AppointmentPage />
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
                      <LabDashboard />
                    </PageErrorBoundary>
                  </Layout>
                }
              />

              <Route
                path="/laboratory/test-types"
                element={
                  <Layout>
                    <PageErrorBoundary pageName="Lab Test Types">
                      <LabTestTypes />
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
                      <Billing />
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
