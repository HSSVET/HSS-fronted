import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import { QueryProvider } from './lib/react-query';
import { Layout } from './shared';
import CustomerLayout from './shared/components/CustomerLayout';
import { Dashboard } from './features/dashboard';
import CustomerDashboard from './features/dashboard/components/CustomerDashboard';
import { AnimalPage, AnimalDetailPage } from './features/animals';
import { AppointmentPage } from './features/appointments';
import { LabDashboard, LabTestTypes } from './features/laboratory';
import { Billing } from './features/billing';
import { DocumentPage } from './features/documents';
import RemindersPage from './features/reminders/components/RemindersPage';
import SurgeryDetails from './features/surgery/components/SurgeryDetails';
import HospitalizationDetails from './features/hospitalization/components/HospitalizationDetails';
import SuperAdminLayout from './shared/components/SuperAdminLayout';
import ClinicsPage from './features/super-admin/ClinicsPage';
import { OwnerPage, OwnerDetailPage } from './features/owners';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Toast from './components/Toast';
import VaccinationDashboard from './features/vaccinations/components/VaccinationDashboard';
import SmsPage from './features/sms/components/SmsPage';
import StockSystem from './features/stock/components/StockSystem';
import ReportsPage from './features/reports/components/ReportsPage';
import SettingsPage from './features/settings/components/SettingsPage';

// Error Boundaries

import {
  GlobalErrorBoundary,
  PageErrorBoundary,
} from './components/common/ErrorBoundary';
import './shared/styles/App.css';
import { LandingPage, ProductsPage, AboutPage, DemoPage } from './features/landing';
import GlobalConfirmDialog from './components/common/GlobalConfirmDialog';

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
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
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

const AuthRedirector = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!state.isInitialized) return;

    if (!state.isAuthenticated) {
      // If not authenticated and not already at login, redirect to login
      // ProtectedRoute handles this usually, but this is root level
      // navigate('/login', { replace: true }); 
      // We let <Navigate to="/login" /> handle this in routes usually
      return;
    }

    if (state.user) {
      const { userType, clinicId, roles } = state.user;

      if (roles?.includes('SUPER_ADMIN')) {
        navigate('/super-admin/clinics', { replace: true });
        return;
      }

      if (location.pathname === '/' || location.pathname === '/dashboard') {
        if (userType === 'STAFF' && roles?.includes('SUPER_ADMIN')) {
          navigate('/super-admin/clinics', { replace: true });
        } else if (userType === 'STAFF' && state.user.clinicSlug) {
          navigate(`/clinic/${state.user.clinicSlug}/dashboard`, { replace: true });
        } else if (userType === 'OWNER') {
          // If Owner has no clinicId, redirect to generic portal or '0'
          const targetClinicId = clinicId || '0';
          navigate(`/portal/${targetClinicId}/dashboard`, { replace: true });
        }
      }
    }
  }, [state.isInitialized, state.isAuthenticated, state.user, navigate, location.pathname]);

  if (!state.isInitialized) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Fallback if authenticated but no redirect happened (e.g. unknown role)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
      <CircularProgress />
      <Box sx={{ textAlign: 'center' }}>
        <div>Redirecting...</div>
        <div style={{ fontSize: '0.8em', color: '#666' }}>Role: {state.user?.roles?.join(', ')}</div>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider enablePersistence={true}>
        <GlobalErrorBoundary>
          <AuthProvider>
            <ErrorProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />

                  {/* Public Routes - Wrapped in AuthRedirector to auto-redirect if logged in */}
                  <Route path="/" element={<AuthRedirector><LandingPage /></AuthRedirector>} />
                  <Route path="/products" element={<AuthRedirector><ProductsPage /></AuthRedirector>} />
                  <Route path="/about" element={<AuthRedirector><AboutPage /></AuthRedirector>} />
                  <Route path="/demo" element={<AuthRedirector><DemoPage /></AuthRedirector>} />
                  <Route path="/dashboard" element={<AuthRedirector><LandingPage /></AuthRedirector>} />
                  <Route path="/register" element={<AuthRedirector><RegisterPage /></AuthRedirector>} />

                  {/* ========================================================= */}
                  {/* SUPER ADMIN ROUTES */}
                  {/* ========================================================= */}
                  <Route
                    path="/super-admin/*"
                    element={
                      <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                        <SuperAdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="clinics" element={<ClinicsPage />} />
                    <Route index element={<Navigate to="clinics" replace />} />
                  </Route>

                  {/* ========================================================= */}
                  {/* CLINIC STAFF ROUTES */}
                  {/* ========================================================= */}
                  <Route
                    path="/clinic/:slug/*"
                    element={
                      <ProtectedRoute requiredRoles={['ADMIN', 'VETERINER', 'STAFF', 'SEKRETER', 'TEKNISYEN']}>
                        <Layout>
                          <Routes>
                            <Route path="dashboard" element={
                              <PageErrorBoundary pageName="Dashboard">
                                <Dashboard />
                              </PageErrorBoundary>
                            } />

                            <Route path="animals/*" element={
                              <PageErrorBoundary pageName="Animals">
                                <Routes>
                                  <Route index element={<AnimalPage />} />
                                  <Route path=":id" element={<AnimalDetailPage />} />
                                </Routes>
                              </PageErrorBoundary>
                            } />

                            <Route path="owners/*" element={
                              <PageErrorBoundary pageName="Owners">
                                <Routes>
                                  <Route index element={<OwnerPage />} />
                                  <Route path=":id" element={<OwnerDetailPage />} />
                                </Routes>
                              </PageErrorBoundary>
                            } />

                            <Route path="appointments" element={
                              <PageErrorBoundary pageName="Appointments">
                                <AppointmentPage />
                              </PageErrorBoundary>
                            } />

                            <Route path="laboratory/*" element={
                              <PageErrorBoundary pageName="Laboratory">
                                <Routes>
                                  <Route index element={<LabDashboard />} />
                                  <Route path="test-types" element={<LabTestTypes />} />
                                </Routes>
                              </PageErrorBoundary>
                            } />

                            <Route path="billing" element={
                              <PageErrorBoundary pageName="Billing">
                                <Billing />
                              </PageErrorBoundary>
                            } />

                            <Route path="documents" element={
                              <PageErrorBoundary pageName="Documents">
                                <DocumentPage />
                              </PageErrorBoundary>
                            } />


                            <Route path="reminders" element={
                              <PageErrorBoundary pageName="Reminders">
                                <RemindersPage />
                              </PageErrorBoundary>
                            } />

                            <Route path="vaccinations" element={
                              <PageErrorBoundary pageName="Vaccinations">
                                <VaccinationDashboard />
                              </PageErrorBoundary>
                            } />

                            <Route path="sms" element={
                              <PageErrorBoundary pageName="SMS">
                                <SmsPage />
                              </PageErrorBoundary>
                            } />

                            <Route path="inventory" element={
                              <PageErrorBoundary pageName="Inventory">
                                <StockSystem />
                              </PageErrorBoundary>
                            } />

                            <Route path="reports" element={
                              <PageErrorBoundary pageName="Reports">
                                <ReportsPage />
                              </PageErrorBoundary>
                            } />

                            <Route path="settings" element={
                              <PageErrorBoundary pageName="Settings">
                                <SettingsPage />

                              </PageErrorBoundary>
                            } />

                            <Route path="surgeries/:id" element={
                              <PageErrorBoundary pageName="SurgeryDetails">
                                <SurgeryDetails />
                              </PageErrorBoundary>
                            } />

                            <Route path="hospitalizations/:id" element={
                              <PageErrorBoundary pageName="HospitalizationDetails">
                                <HospitalizationDetails />
                              </PageErrorBoundary>
                            } />

                            {/* Redirect /clinic/:slug to dashboard */}
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* ========================================================= */}
                  {/* CUSTOMER PORTAL ROUTES */}
                  {/* ========================================================= */}
                  <Route
                    path="/portal/:clinicId/*"
                    element={
                      <ProtectedRoute requiredRoles={['OWNER']}>
                        <CustomerLayout>
                          <Routes>
                            <Route path="dashboard" element={
                              <PageErrorBoundary pageName="Customer Dashboard">
                                <CustomerDashboard />
                              </PageErrorBoundary>
                            } />
                            {/* Redirect /portal/:id to dashboard */}
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                          </Routes>
                        </CustomerLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
              <Toast />
              <GlobalConfirmDialog />
            </ErrorProvider>
          </AuthProvider>
        </GlobalErrorBoundary>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
