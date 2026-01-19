import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Paper, Typography, Box } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Guacara Coordinates
const center = [10.2289, -67.8767];

const facilities = [
    { id: 1, name: 'ASIC Guacara Centro', type: 'ASIC', position: [10.2290, -67.8770] },
    { id: 2, name: 'CDI Yagua', type: 'CDI', position: [10.2500, -67.8900] },
    { id: 3, name: 'Ambulatorio Ciudad Alianza', type: 'Ambulatorio', position: [10.2100, -67.8500] },
    { id: 4, name: 'NAPI El Samán', type: 'NAPI', position: [10.2350, -67.8650] },
];

export default function MapComponent() {
    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 4, height: 500, overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Mapa de Instalaciones - Guacara
            </Typography>
            <Box sx={{ height: '100%', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {facilities.map((fac) => (
                        <Marker key={fac.id} position={fac.position}>
                            <Popup>
                                <strong>{fac.name}</strong> <br />
                                Tipo: {fac.type}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Box>
        </Paper>
    );
}
