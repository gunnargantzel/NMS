import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import OrderForm from './pages/OrderForm';
import SurveyTypes from './pages/SurveyTypes';
import Layout from './components/Layout';
import 'dayjs/locale/nb';
import './styles/modern_app_foundation.css';
import './styles/app.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // --color-primary
      light: '#3b82f6', // --color-primary-light
      dark: '#1d4ed8', // --color-primary-dark
    },
    secondary: {
      main: '#dc2626', // --color-secondary
      light: '#ef4444', // --color-secondary-light
      dark: '#b91c1c', // --color-secondary-dark
    },
    background: {
      default: '#f8fafc', // --bg-secondary
      paper: '#ffffff', // --bg-primary
    },
    text: {
      primary: '#0f172a', // --text-primary
      secondary: '#475569', // --text-secondary
    },
    success: {
      main: '#38a169', // --color-success
      light: '#68d391', // --color-success-light
    },
    warning: {
      main: '#d69e2e', // --color-warning
      light: '#f6e05e', // --color-warning-light
    },
    error: {
      main: '#e53e3e', // --color-danger
      light: '#fc8181', // --color-danger-light
    },
    info: {
      main: '#3182ce', // --color-info
      light: '#63b3ed', // --color-info-light
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    h1: {
      fontSize: '2.25rem', // --font-size-4xl
      fontWeight: 600, // --font-weight-semibold
      lineHeight: 1.25, // --line-height-tight
    },
    h2: {
      fontSize: '1.875rem', // --font-size-3xl
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.5rem', // --font-size-2xl
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h4: {
      fontSize: '1.25rem', // --font-size-xl
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h5: {
      fontSize: '1.125rem', // --font-size-lg
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h6: {
      fontSize: '1rem', // --font-size-md
      fontWeight: 600,
      lineHeight: 1.25,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5, // --line-height-normal
    },
    body2: {
      fontSize: '0.875rem', // --font-size-sm
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 500, // --font-weight-medium
          transition: 'all var(--transition-fast)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-md)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-gray-200)',
          transition: 'all var(--transition-normal)',
          '&:hover': {
            boxShadow: 'var(--shadow-md)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--radius-md)',
            transition: 'all var(--transition-fast)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-primary)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-primary)',
              boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-full)',
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-md)',
        },
      },
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SplashScreen onComplete={handleSplashComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nb">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/new" element={<OrderForm />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="survey-types" element={<SurveyTypes />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;