import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    const [email, setEmail] = useState(emailParam || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setStatus('error');
            setMessage('Las contraseñas no coinciden.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await axios.post('/api/reset-password', {
                email,
                password,
                password_confirmation: passwordConfirmation,
                token
            });
            setStatus('success');
            setMessage('Contraseña restablecida correctamente.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Error al restablecer contraseña.');
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
                    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#d1fae5' }}>
                        <KeyIcon sx={{ fontSize: 40, color: '#10b981' }} />
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight="bold" gutterBottom color="#1e293b">
                    Nueva Contraseña
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Establece tu nueva contraseña segura.
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
                        disabled
                    />
                    <TextField
                        fullWidth
                        label="Nueva Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        type="password"
                        disabled={status === 'loading' || status === 'success'}
                    />
                    <TextField
                        fullWidth
                        label="Confirmar Contraseña"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        margin="normal"
                        required
                        type="password"
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
                            background: 'linear-gradient(45deg, #10b981 30%, #34d399 90%)',
                            height: 48
                        }}
                    >
                        {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Restablecer Contraseña'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
