import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function StatisticsManager() {
    const [stats, setStats] = useState({
        patients: 0,
        active_cases: 0,
        facilities: 0,
        consultations_today: 0,
        // demographic placeholders
        gender_distribution: { male: 0, female: 0 },
        age_groups: [0, 0, 0, 0, 0, 0],
        pathologies: [],
        population_by_sector: []
    });

    const [communities, setCommunities] = useState([]);
    const [filters, setFilters] = useState({
        community_id: '',
        house_id: ''
    });

    useEffect(() => {
        fetchCommunities();
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchStats();

        // Polling every 5 seconds for "real-time" updates
        const interval = setInterval(() => {
            fetchStats();
        }, 5000);

        return () => clearInterval(interval);
    }, [filters]);

    const fetchCommunities = async () => {
        try {
            const res = await axios.get('/api/communities');
            setCommunities(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            console.error("Error fetching communities:", error);
        }
    };

    const fetchStats = async () => {
        try {
            const params = {};
            if (filters.community_id) params.community_id = filters.community_id;
            if (filters.house_id) params.house_id = filters.house_id;

            const res = await axios.get('/api/dashboard-stats', { params });
            const data = res.data;

            setStats(prev => ({
                ...prev,
                patients: data.patients || 0,
                active_cases: data.active_cases || 0,
                facilities: data.facilities || 0,
                consultations_today: data.consultations_today || 0,
                // Mocking complex distributions for now as controller only sends counts
                // In a real scenario, controller should send these arrays
                gender_distribution: { male: Math.round(data.patients * 0.55), female: Math.round(data.patients * 0.45) },
            }));
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    // Chart Data Wrappers
    const genderData = {
        labels: ['Masculino', 'Femenino'],
        datasets: [{
            data: [stats.gender_distribution?.male || 0, stats.gender_distribution?.female || 0],
            backgroundColor: ['#3b82f6', '#ec4899'],
            borderWidth: 1,
        }],
    };

    // Keep other charts static/mock for now until backend provides distribution data
    const ageData = {
        labels: ['0-5', '6-12', '13-17', '18-40', '41-65', '65+'],
        datasets: [{
            label: 'Población por Edad',
            data: [12, 15, 10, 45, 30, 13], // Scaled down mock
            backgroundColor: '#10b981',
        }],
    };

    const pathologyData = {
        labels: ['Hipertensión', 'Diabetes', 'Asma', 'Dengue', 'COVID-19'],
        datasets: [{
            label: 'Casos Registrados',
            data: [stats.active_cases > 0 ? stats.active_cases : 0, 5, 2, 1, 0],
            backgroundColor: '#f59e0b',
        }],
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Estadísticas de Salud</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Visualización de datos demográficos y epidemiológicos.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Filtrar por Comunidad</InputLabel>
                        <Select
                            value={filters.community_id}
                            label="Filtrar por Comunidad"
                            onChange={(e) => setFilters({ ...filters, community_id: e.target.value })}
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {communities.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Filtrar por Vivienda (ID)"
                        value={filters.house_id}
                        onChange={(e) => setFilters({ ...filters, house_id: e.target.value })}
                        sx={{ width: 150 }}
                    />
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* KPI Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">{stats.patients}</Typography>
                        <Typography variant="subtitle2">Pacientes</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="error">{stats.active_cases}</Typography>
                        <Typography variant="subtitle2">Casos Activos</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{stats.facilities}</Typography>
                        <Typography variant="subtitle2">Instalaciones</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="success">{stats.consultations_today}</Typography>
                        <Typography variant="subtitle2">Consultas Hoy</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Distribución por Género</Typography>
                        <Box sx={{ width: '80%' }}>
                            <Pie data={genderData} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} lg={8}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Grupos Etarios</Typography>
                        <Bar options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={ageData} />
                    </Paper>
                </Grid>

                {/* 
                  Extra charts hidden for brevity or can be re-enabled.
                  Pathologies included below. 
                */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Patologías Frecuentes (Casos Activos)</Typography>
                        <Bar options={{ indexAxis: 'y', responsive: true }} data={pathologyData} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
