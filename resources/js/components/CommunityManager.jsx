import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Paper, Button, Grid, Card, CardContent, CardActions, Breadcrumbs, Link as MuiLink, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Fab, Autocomplete } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


// Location Picker Component
function LocationPicker({ onLocationSelect }) {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function CommunityManager() {
    const [searchParams, setSearchParams] = useSearchParams();

    // State derived from URL
    const currentView = searchParams.get('view') || 'communities';
    const parentId = searchParams.get('parentId');

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [parent, setParent] = useState(null);

    // Modal State
    const [openModal, setOpenModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');

    // Map & Location State
    const [mapLocation, setMapLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Fetch Data Effect
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (parentId) {
                    const parentType = getParentType(currentView);
                    const parentRes = await axios.get(`/api/${parentType}s/${parentId}`);
                    setParent(parentRes.data.data || parentRes.data);
                } else {
                    setParent(null);
                }

                let url = `/api/${currentView}`;
                const response = await axios.get(url);
                let data = response.data.data || response.data;

                if (parentId) {
                    const pid = parseInt(parentId);
                    if (currentView === 'sectors') data = data.filter(i => i.community_id === pid);
                    if (currentView === 'streets') data = data.filter(i => i.sector_id === pid);
                    if (currentView === 'houses') data = data.filter(i => i.street_id === pid);
                    if (currentView === 'families') data = data.filter(i => i.house_id === pid);
                    if (currentView === 'patients') data = data.filter(i => i.family_id === pid);
                }

                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentView, parentId]);

    const handleCreate = async () => {
        if (!newItemName) {
            alert("Por favor, ingresa un nombre o selecciona una ubicación en el mapa.");
            return;
        }
        try {
            let url = `/api/${currentView}`;
            let payload = { name: newItemName };

            if (parentId) {
                const pid = parseInt(parentId);
                if (currentView === 'sectors') payload.community_id = pid;
                if (currentView === 'streets') payload.sector_id = pid;
                if (currentView === 'houses') { payload = { number: newItemName, street_id: pid }; url = '/api/houses'; }
                if (currentView === 'families') payload.house_id = pid;
                if (currentView === 'patients') {
                    payload = { first_name: newItemName, last_name: '.', date_of_birth: '2000-01-01', gender: 'M', family_id: pid };
                }
            }

            console.log("Creating item:", url, payload);
            await axios.post(url, payload);

            setOpenModal(false);
            setNewItemName('');
            setMapLocation(null);
            // Refresh logic: simple reload for robustness
            window.location.reload();
        } catch (error) {
            console.error("Error creating item:", error.response || error);
            const msg = error.response?.data?.message || "Error al guardar. Verifica la consola.";
            alert(`Error: ${msg}`);
        }
    };

    const handleLocationSelect = async (latlng) => {
        setMapLocation(latlng);
        setLoadingLocation(true);
        console.log("Fetching location for:", latlng);
        try {
            // Reverse Geocoding via Nominatim
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
            console.log("Nominatim Response:", res.data);
            const address = res.data.address;

            let suggestion = '';
            // Suggest based on context - Adapted for Venezuela/Guacara
            if (currentView === 'communities') {
                // Communities often map to suburbs, neighbourhoods, or villages
                suggestion = address.suburb || address.neighbourhood || address.quarter || address.village || address.town || '';
            } else if (currentView === 'sectors') {
                // Sectors are often smaller neighbourhoods or specific residential areas
                suggestion = address.neighbourhood || address.residential || address.suburb || '';
            } else if (currentView === 'streets') {
                suggestion = address.road || address.pedestrian || '';
            } else if (currentView === 'houses') {
                suggestion = address.house_number || '';
            }

            if (suggestion) {
                setNewItemName(suggestion);
            } else {
                // Fallback to a broader name if specific one is missing, or just a generic marker
                const fallback = address.road || address.suburb || address.city_district || "Ubicación Marcada";
                setNewItemName(fallback);
            }

        } catch (error) {
            console.error("Geocoding error:", error);
            alert("No se pudo obtener la dirección. Verifica tu conexión a internet.");
        } finally {
            setLoadingLocation(false);
        }
    };

    const handleNavigate = (item, nextView) => {
        setSearchParams({ view: nextView, parentId: item.id });
    };

    const renderIcon = (type) => {
        switch (type) {
            case 'community': return <LocationCityIcon color="primary" fontSize="large" />;
            case 'sector': return <FolderIcon color="secondary" fontSize="large" />;
            case 'street': return <HomeIcon color="action" fontSize="large" />;
            case 'house': return <HomeIcon color="disabled" fontSize="large" />;
            case 'family': return <PeopleIcon color="primary" fontSize="large" />;
            default: return <FolderIcon />;
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Explorador Comunitario</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                    Nueva {currentView.slice(0, -1)}
                </Button>
            </Box>

            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <MuiLink underline="hover" color="inherit" onClick={() => setSearchParams({ view: 'communities' })} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Inicio
                </MuiLink>
                {parent && (
                    <MuiLink underline="hover" color="inherit" sx={{ cursor: 'default' }}>
                        {parent.name || parent.number}
                    </MuiLink>
                )}
                <Typography color="text.primary">{currentView}</Typography>
            </Breadcrumbs>

            {loading ? <CircularProgress /> : (
                <>
                    {currentView === 'patients' ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Acción</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {items.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.first_name} {p.last_name}</TableCell>
                                            <TableCell><Button size="small">Ver Caso</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Grid container spacing={3}>
                            {items.length === 0 && <Typography sx={{ m: 2 }}>No hay elementos.</Typography>}
                            {items.map((item) => {
                                let next = 'sectors';
                                if (currentView === 'sectors') next = 'streets';
                                if (currentView === 'streets') next = 'houses';
                                if (currentView === 'houses') next = 'families';
                                if (currentView === 'families') next = 'patients';

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                                        <Card elevation={3} sx={{ ':hover': { boxShadow: 6, cursor: 'pointer' } }} onClick={() => handleNavigate(item, next)}>
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {renderIcon(currentView.slice(0, -1))}
                                                <Typography variant="h6">{item.name || item.number}</Typography>
                                            </CardContent>
                                            <CardActions><Button size="small">Explorar</Button></CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    )}
                </>
            )}

            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Agregar con Mapa</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Toca el mapa para obtener una sugerencia automática según la ubicación.
                            </Typography>
                            <Box sx={{ height: 300, width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                                <MapContainer center={[10.2289, -67.8767]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                </MapContainer>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                freeSolo
                                options={
                                    currentView === 'communities'
                                        ? ['Ciudad Alianza', 'Yagua', 'El Samán', 'Aragüita', 'Casco Central', 'Vigirima', 'Loma Linda', 'Malavé Villalba']
                                        : (currentView === 'sectors' ? ['1ra Etapa', '2da Etapa', '3ra Etapa', 'Sector A', 'Sector B', 'Casco Norte', 'Casco Sur'] : [])
                                }
                                value={newItemName}
                                onInputChange={(event, newInputValue) => {
                                    if (event && event.type === 'click' && newInputValue === '') return;
                                    setNewItemName(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        autoFocus
                                        margin="dense"
                                        label={loadingLocation ? "Obteniendo ubicación del mapa..." : "Nombre / Identificador (Escribe o toca el mapa)"}
                                        fullWidth
                                        disabled={loadingLocation}
                                        helperText="Selecciona de la lista, escribe uno nuevo, o toca el mapa."
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button onClick={handleCreate} variant="contained" disabled={loadingLocation}>Crear</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
