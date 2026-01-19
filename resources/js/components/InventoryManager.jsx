import React, { useState } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Box } from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`inventory-tabpanel-${index}`}
            aria-labelledby={`inventory-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function InventoryManager() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>Inventory & Resources</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="inventory tabs">
                    <Tab label="Pharmacy / Medicines" />
                    <Tab label="General Resources" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Button variant="contained" sx={{ mb: 2 }}>Add Medicine</Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow><TableCell colSpan={5} align="center">Inventory empty</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography>Resource List (Vehicles, Devices, etc.)</Typography>
            </TabPanel>
        </Box>
    );
}
