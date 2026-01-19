import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await axios.post('/api/login', { email, password });

            // Store token and user data
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_role', response.data.roles ? response.data.roles[0] : '');
            localStorage.setItem('user_name', response.data.user.name);

            // Set default Authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            setStatus('success');
            navigate('/'); // Redirect to Dashboard
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Credenciales inválidas.');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', // Blue theme matching App
                p: 2
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 4,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#dbeafe' }}>
                        <LoginIcon sx={{ fontSize: 40, color: '#2563eb' }} />
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight="bold" gutterBottom color="#1f2937">
                    Bienvenido
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Inicia sesión para gestionar el sistema de salud.
                </Typography>

                {status === 'error' && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                        type="email"
                        disabled={status === 'loading'}
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        type="password"
                        disabled={status === 'loading'}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#2563eb', fontSize: '0.875rem' }}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={status === 'loading'}
                        sx={{
                            mt: 3,
                            mb: 2,
                            borderRadius: 2,
                            height: 48
                        }}
                    >
                        {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
