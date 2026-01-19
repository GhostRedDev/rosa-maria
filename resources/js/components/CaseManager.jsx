import React, { useState } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box } from '@mui/material';

export default function CaseManager() {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>Medical Case Management</Typography>
            <Button variant="contained" color="secondary" sx={{ mb: 2 }}>Create New Case</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Case ID</TableCell>
                            <TableCell>Patient</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>101</TableCell>
                            <TableCell>John Doe</TableCell>
                            <TableCell>Hypertension Follow-up</TableCell>
                            <TableCell><Chip label="Active" color="warning" /></TableCell>
                            <TableCell>
                                <Button size="small">View Details</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
