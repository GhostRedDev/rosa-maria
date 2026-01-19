import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Box, Divider, IconButton, Avatar, Card, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart'; // Using Inventory icon
import AccountCircle from '@mui/icons-material/AccountCircle';

const drawerWidth = 260; // Slightly wider for better breathing room

export default function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Comunidades', icon: <HomeIcon />, path: '/communities' }, // Translated to Spanish
        { text: 'Estadísticas', icon: <BarChartIcon />, path: '/statistics' },
        { text: 'Instalaciones', icon: <LocalHospitalIcon />, path: '/facilities' },
        { text: 'Roles y Permisos', icon: <SecurityIcon />, path: '/roles' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e293b', color: 'white' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <LocalHospitalIcon sx={{ mr: 1, color: '#60a5fa', fontSize: 30 }} />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                    MEDSYST
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ px: 2, pt: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? 'white' : 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ mt: 'auto', p: 2 }}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, pb: '16px !important' }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, mr: 1.5 }}>A</Avatar>
                        <Box>
                            <Typography variant="subtitle2">Admin User</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Jefe Médico</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {/* Dynamic Title could go here */}
                    </Typography>
                    <IconButton>
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: 'background.default' }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}


