import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { ErrorProvider } from '../context/ErrorContext';
import { createTheme } from '@mui/material/styles';

// Create test theme
const testTheme = createTheme({
  palette: {
    primary: {
      main: '#92A78C',
    },
    secondary: {
      main: '#F7CD82',
    },
  },
});

/**
 * Custom render function that includes all necessary providers
 * Use this instead of the default render from @testing-library/react
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={testTheme}>
      <CssBaseline />
      <ErrorProvider>
        <AuthProvider>
          <AppProvider>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </AppProvider>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper functions for testing
export const createMockAnimal = (overrides = {}) => ({
  id: '1',
  name: 'Test Animal',
  species: 'Kedi',
  breed: 'Tekir',
  health: 'İyi',
  owner: 'Test Owner',
  lastCheckup: new Date().toISOString(),
  nextVaccine: new Date().toISOString(),
  ...overrides,
});

export const createMockOwner = (overrides = {}) => ({
  ownerId: 1,
  firstName: 'Test',
  lastName: 'Owner',
  email: 'test@example.com',
  phone: '5551234567',
  ...overrides,
});

export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

