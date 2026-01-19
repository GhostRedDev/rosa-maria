import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, LinearProgress, Avatar } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MapComponent from './MapComponent';
import axios from 'axios';

// Premium Card Component
const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.2, transform: 'rotate(15deg)' }}>
            {React.cloneElement(icon, { sx: { fontSize: 120 } })}
        </Box>
        <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                    {icon}
                </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 2, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, marginRight: 4 }}>+12%</span> {subtitle}
            </Typography>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const [stats, setStats] = useState({
        patients: 0,
        active_cases: 0,
        facilities: 0,
        consultations_today: 0
    });

    useEffect(() => {
        axios.get('/api/dashboard-stats')
            .then(response => {
                setStats(response.data);
            })
            .catch(error => console.error("Error fetching stats:", error));
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                    Dashboard General
                </Typography>
                <Typography variant="h6" sx={{ color: '#6b7280', fontWeight: 400 }}>
                    Bienvenido al sistema de reporte médico
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pacientes Totales"
                        value={stats.patients}
                        subtitle="registrados"
                        icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                        color={['#3b82f6', '#2563eb']}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Casos Activos"
                        value={stats.active_cases}
                        subtitle="requieren atención"
                        icon={<HealingIcon sx={{ fontSize: 32 }} />}
                        color={['#ec4899', '#db2777']}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Instalaciones"
                        value={stats.facilities}
                        subtitle="operativas"
                        icon={<LocalHospitalIcon sx={{ fontSize: 32 }} />}
                        color={['#10b981', '#059669']}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Consultas Hoy"
                        value={stats.consultations_today}
                        subtitle="estimadas"
                        icon={<AssignmentIcon sx={{ fontSize: 32 }} />}
                        color={['#f59e0b', '#d97706']}
                    />
                </Grid>

                {/* Main Content Area */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Actividad Reciente</Typography>
                        <Box sx={{ mt: 2 }}>
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                                    <Avatar sx={{ bgcolor: i === 1 ? '#e0f2fe' : i === 2 ? '#fce7f3' : '#dcfce7', color: i === 1 ? '#0369a1' : i === 2 ? '#be185d' : '#15803d', mr: 2 }}>
                                        {i === 1 ? 'JP' : i === 2 ? 'MR' : 'JS'}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Nueva consulta registrada</Typography>
                                        <Typography variant="body2" color="text.secondary">Dr. Martinez atendió a un paciente.</Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">hace {i * 15} min</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={12}>
                    <MapComponent />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%', bgcolor: '#111827', color: 'white' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Estado de Ambulancias</Typography>
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Unidad A-01</Typography>
                                    <Typography variant="body2" sx={{ color: '#4ade80' }}>Disponible</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#4ade80' } }} />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Unidad B-02</Typography>
                                    <Typography variant="body2" sx={{ color: '#fbbf24' }}>En Misión</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#fbbf24' } }} />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Unidad C-03</Typography>
                                    <Typography variant="body2" sx={{ color: '#ef4444' }}>Mantenimiento</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={10} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
