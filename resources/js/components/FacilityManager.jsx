import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, CardActions, Button, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ onLocationSelect }) {
    const [position, setPosition] = useState(null);
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng);
        },
    });
    return position ? <Marker position={position} /> : null;
}

export default function FacilityManager() {
    const [facilities, setFacilities] = useState([]);
    const [facilityTypes, setFacilityTypes] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    // Create Modal
    const [openModal, setOpenModal] = useState(false);
    const [newFacility, setNewFacility] = useState({
        name: '',
        medical_facility_type_id: '',
        parent_id: '',
        latitude: '',
        longitude: '',
        community_ids: [],
        create_user: false,
        user_email: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [facRes, typesRes, commRes] = await Promise.all([
                axios.get('/api/facilities'),
                axios.get('/api/medical-facility-types'),
                axios.get('/api/communities')
            ]);
            setFacilities(Array.isArray(facRes.data.data) ? facRes.data.data : []);
            setFacilityTypes(Array.isArray(typesRes.data.data) ? typesRes.data.data : []);
            setCommunities(Array.isArray(commRes.data.data) ? commRes.data.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post('/api/facilities', newFacility);
            setOpenModal(false);
            fetchData();
            setNewFacility({ name: '', medical_facility_type_id: '', parent_id: '', latitude: '', longitude: '', community_ids: [], create_user: false, user_email: '' });
        } catch (error) {
            console.error("Error creating facility:", error);
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    // Derived state for parent selection (e.g. show if type is NOT ASIC, or always show?)
    // User requested "Assign Ambulatorios to ASIC". 
    // Usually ASIC is the top level. So if creating Ambulatorio (or others), allow selecting an ASIC parent.
    const parentOptions = facilities.filter(f => f.type?.name === 'ASIC'); // Assuming type relation loaded

    const handleSelectFacility = (facility) => {
        setSelectedFacility(facility);
        setTabValue(0);
    };

    const handleLocationSelect = (latlng) => {
        setNewFacility(prev => ({ ...prev, latitude: latlng.lat, longitude: latlng.lng }));
    };

    // Sub-renderers for details (Mock for now, waiting for real endpoints)
    const renderPersonnel = () => (
        <TableContainer>
            <Table>
                <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Rol</TableCell></TableRow></TableHead>
                <TableBody>
                    <TableRow><TableCell>Sin datos</TableCell><TableCell>-</TableCell></TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (selectedFacility) {
        return (
            <Box>
                <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedFacility(null)} sx={{ mb: 2 }}>
                    Volver
                </Button>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4">{selectedFacility.name}</Typography>
                    <Typography color="textSecondary">{selectedFacility.type?.name || 'Centro de Salud'}</Typography>
                    {selectedFacility.parent && (
                        <Typography variant="subtitle2" color="primary">Pertenece a: {selectedFacility.parent.name}</Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Comunidades Atendidas:</Typography>
                        {selectedFacility.communities?.map(c => <Chip key={c.id} label={c.name} sx={{ mr: 1 }} size="small" />)}
                        {(!selectedFacility.communities || selectedFacility.communities.length === 0) && <Typography variant="caption">Ninguna asignada</Typography>}
                    </Box>
                </Paper>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                    <Tab label="Personal" />
                    <Tab label="Farmacia" />
                    <Tab label="Casos" />
                </Tabs>
                {tabValue === 0 && <TableContainer><Table><TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Rol</TableCell></TableRow></TableHead><TableBody><TableRow><TableCell>Sin datos</TableCell><TableCell>-</TableCell></TableRow></TableBody></Table></TableContainer>}
                {tabValue === 1 && <Typography sx={{ p: 2 }}>Módulo de Farmacia en desarrollo...</Typography>}
                {tabValue === 2 && <Typography sx={{ p: 2 }}>Módulo de Casos en desarrollo...</Typography>}
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Instalaciones Médicas</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>Nueva Instalación</Button>
            </Box>

            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {facilities.map((fac) => (
                        <Grid item xs={12} sm={6} md={4} key={fac.id}>
                            <Card sx={{ cursor: 'pointer', ':hover': { boxShadow: 6 } }} onClick={() => handleSelectFacility(fac)}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <LocalHospitalIcon fontSize="large" color="primary" />
                                    <Typography variant="h6">{fac.name}</Typography>
                                    <Chip label={fac.type?.name || 'N/A'} size="small" />
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button size="small">Administrar</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                    {facilities.length === 0 && <Typography sx={{ p: 2 }}>No hay instalaciones registradas.</Typography>}
                </Grid>
            )}

            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Nueva Instalación Médica</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Nombre" value={newFacility.name} onChange={e => setNewFacility({ ...newFacility, name: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Modelo / Tipo"
                                value={newFacility.medical_facility_type_id}
                                onChange={e => setNewFacility({ ...newFacility, medical_facility_type_id: e.target.value })}
                                SelectProps={{ native: true }}
                            >
                                <option value="">Seleccione...</option>
                                {facilityTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Logic to show Parent Selection if not ASIC, or always? Let's show always but filter. */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Asignar a ASIC (Opcional)"
                                value={newFacility.parent_id}
                                onChange={e => setNewFacility({ ...newFacility, parent_id: e.target.value })}
                                SelectProps={{ native: true }}
                                helperText="Ej: Un Ambulatorio pertenece a un ASIC."
                            >
                                <option value="">Ninguno (Es cabecera)</option>
                                {parentOptions.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={communities}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => {
                                    setNewFacility({ ...newFacility, community_ids: newValue.map(c => c.id) });
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Asignar Comunidades" placeholder="Selecciona..." />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Ubicación</Typography>
                            <Box sx={{ height: 250, width: '100%', mb: 1, border: '1px solid #ddd' }}>
                                <MapContainer center={[10.2289, -67.8767]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                </MapContainer>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Latitud" value={newFacility.latitude} onChange={e => setNewFacility({ ...newFacility, latitude: e.target.value })} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Longitud" value={newFacility.longitude} onChange={e => setNewFacility({ ...newFacility, longitude: e.target.value })} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={newFacility.create_user} onChange={e => setNewFacility({ ...newFacility, create_user: e.target.checked })} />}
                                label="Crear usuario administrador auto-asignado"
                            />
                        </Grid>
                        {newFacility.create_user && (
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email del Encargado" type="email" value={newFacility.user_email} onChange={e => setNewFacility({ ...newFacility, user_email: e.target.value })} />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button onClick={handleCreate} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
