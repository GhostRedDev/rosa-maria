import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await axios.post('/api/forgot-password', { email });
            setStatus('success');
            setMessage(response.data.message || 'Enlace enviado. Revisa tu correo.');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Error al enviar el enlace.');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#e0f2fe' }}>
                        <LockResetIcon sx={{ fontSize: 40, color: '#0288d1' }} />
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight="bold" gutterBottom color="#1e293b">
                    Recuperar Contraseña
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </Typography>

                {status === 'success' && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
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
                        disabled={status === 'loading' || status === 'success'}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={status === 'loading' || status === 'success'}
                        sx={{
                            mt: 3,
                            mb: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #0288d1 30%, #03a9f4 90%)',
                            height: 48
                        }}
                    >
                        {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Enviar Enlace'}
                    </Button>

                    <Button
                        component={Link}
                        to="/login"
                        fullWidth
                        sx={{ textTransform: 'none' }}
                    >
                        Volver al Inicio de Sesión
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
