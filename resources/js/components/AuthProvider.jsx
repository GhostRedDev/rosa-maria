import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
            if (!isPublicRoute(location.pathname)) {
                navigate('/login');
            }
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
            const res = await axios.get('/api/user');
            setUser(res.data);
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem('auth_token');
            if (!isPublicRoute(location.pathname)) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const isPublicRoute = (path) => {
        return ['/login', '/forgot-password', '/reset-password'].includes(path);
    };

    if (loading) {
        return <div>Cargando...</div>; // Or a nice Spinner
    }

    return (
        <AuthContext.Provider value={{ user, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
