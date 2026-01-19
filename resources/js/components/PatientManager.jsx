import React, { useState } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Box } from '@mui/material';

export default function PatientManager() {
    const [search, setSearch] = useState('');

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>Patient Management</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button variant="contained" color="primary">Register New Patient</Button>
                <TextField
                    label="Search Patient"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Community</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow><TableCell colSpan={6} align="center">No patients found</TableCell></TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
