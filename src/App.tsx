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
import { DocumentPage } from './features/documents';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
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
                  {/* Login Route - Public */}
                  <Route
                    path="/login"
                    element={<LoginPage />}
                  />

                  {/* Main Dashboard Route - Protected */}
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

                  {/* Animals - Protected */}
                  <Route
                    path="/animals"
                    element={
                      <ProtectedRoute>
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
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Animal Details">
                            <AnimalDetailPage />
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Appointments - Protected */}
                  <Route
                    path="/appointments"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Appointments">
                            <AppointmentPage />
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Laboratory - Protected */}
                  <Route
                    path="/laboratory"
                    element={
                      <ProtectedRoute>
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
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Lab Test Types">
                            <LabTestTypes />
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Billing - Protected */}
                  <Route
                    path="/billing"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Billing">
                            <Billing />
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Inventory - Protected */}
                  <Route
                    path="/inventory"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Inventory">
                            <div>Envanter/Stok Sayfası (Yakında)</div>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Reports - Protected */}
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
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
                            <DocumentPage />
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Settings - Protected */}
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Settings">
                            <div>Ayarlar Sayfası (Yakında)</div>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* User Management - Protected */}
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="User Management">
                            <div>Kullanıcı Yönetimi (Yakında)</div>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Audit Logs - Protected */}
                  <Route
                    path="/audit"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PageErrorBoundary pageName="Audit Logs">
                            <div>Denetim Günlükleri (Yakında)</div>
                          </PageErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback - Redirect to login or dashboard based on auth */}
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
