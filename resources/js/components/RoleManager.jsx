import React from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function RoleManager() {
    // Mock data for display until API is connected
    const roles = [
        { id: 1, name: 'Admin', permissions: 'All' },
        { id: 2, name: 'MedicalChief', permissions: 'All' },
        { id: 3, name: 'Doctor', permissions: 'Manage Patients, Manage Cases' },
        { id: 4, name: 'Staff', permissions: 'View Patients, View Inventory' },
    ];

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Role Management
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                Create New Role
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Role Name</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell>{role.id}</TableCell>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.permissions}</TableCell>
                                <TableCell>
                                    <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                                    <Button size="small" variant="outlined" color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
