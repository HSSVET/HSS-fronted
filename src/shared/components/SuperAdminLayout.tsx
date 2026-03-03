import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  CssBaseline,
  AppBar,
  Toolbar,
  useTheme
} from '@mui/material';
import {
  Business as ClinicIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Pets as LogoIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 260;

const SuperAdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Clinics', icon: <ClinicIcon />, path: '/super-admin/clinics' },
    { text: 'System Settings', icon: <SettingsIcon />, path: '/super-admin/settings' },
  ];

  const drawerContent = (
    <Box sx={{
      height: '100%',
      bgcolor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3, borderBottom: '1px solid #f8fafc' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <LogoIcon sx={{ fontSize: 36, color: '#3b82f6', mr: 1 }} />
        </motion.div>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
          HSS Admin
        </Typography>
      </Toolbar>

      <Box sx={{ px: 3, py: 4, mb: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: '#e0f2fe',
            color: '#0284c7',
            mb: 1.5,
            fontWeight: 700,
            border: '2px solid #bae6fd'
          }}
        >
          {user?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
          Super Admin
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.5 }}>
          {user?.email}
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  transition: 'all 0.2s ease',
                  bgcolor: isSelected ? '#eff6ff' : 'transparent',
                  color: isSelected ? '#2563eb' : '#64748b',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    bgcolor: isSelected ? '#eff6ff' : '#f8fafc',
                    color: isSelected ? '#2563eb' : '#0f172a'
                  },
                  '&.Mui-selected': {
                    bgcolor: '#eff6ff',
                    '&:hover': { bgcolor: '#eff6ff' }
                  }
                }}
              >
                {isSelected && (
                  <motion.div layoutId="active-pill" style={{ width: 4, height: '60%', background: '#3b82f6', borderRadius: 4, position: 'absolute', left: 4 }} />
                )}
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40, ml: 1 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.9rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid #f8fafc' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: '#ef4444',
            '&:hover': { bgcolor: '#fef2f2' },
            py: 1.25
          }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40, ml: 1 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.05)'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', position: 'relative', width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {/* Modern Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            color: 'text.primary'
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

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                {user?.email}
              </Typography>
              <IconButton
                onClick={handleMenu}
                sx={{
                  p: 0.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: 2 }
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Animated Page Content */}
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default SuperAdminLayout;
