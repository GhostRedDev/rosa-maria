import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RoleManager from './components/RoleManager';
import CommunityManager from './components/CommunityManager';
import FacilityManager from './components/FacilityManager';
import PatientManager from './components/PatientManager';
import CaseManager from './components/CaseManager';
import PersonnelManager from './components/PersonnelManager';
import InventoryManager from './components/InventoryManager';
import StatisticsManager from './components/StatisticsManager';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import AuthProvider from './components/AuthProvider';

// Modern & Beautiful Theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2563eb', // Modern vibrant Blue
            light: '#60a5fa',
            dark: '#1e40af',
        },
        secondary: {
            main: '#ec4899', // Pink/Magenta accent
        },
        background: {
            default: '#f3f4f6', // Light gray background
            paper: '#ffffff',
        },
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#111827',
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none', // Remove uppercase from buttons
            fontWeight: 600,
            borderRadius: 8,
        },
    },
    shape: {
        borderRadius: 12, // Softer, more modern rounded corners
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    transition: 'all 0.3s ease-in-out',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Routes */}
                <Route path="/" element={
                    <AuthProvider>
                        <Layout />
                    </AuthProvider>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="communities" element={<CommunityManager />} />
                    <Route path="facilities" element={<FacilityManager />} />
                    <Route path="patients" element={<PatientManager />} />
                    <Route path="medical-cases" element={<CaseManager />} />
                    <Route path="personnel" element={<PersonnelManager />} />
                    <Route path="inventory" element={<InventoryManager />} />
                    <Route path="statistics" element={<StatisticsManager />} />
                    <Route path="roles" element={<RoleManager />} />
                    <Route path="*" element={<h2>404 Not Found</h2>} />
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
