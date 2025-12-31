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
      background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <LogoIcon sx={{ fontSize: 40, color: '#F7CD82', mr: 1 }} />
        </motion.div>
        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          HSS ADMIN
        </Typography>
      </Toolbar>

      <Box sx={{ px: 2, mb: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'rgba(255,255,255,0.2)',
            margin: '0 auto',
            mb: 1,
            border: '2px solid rgba(255,255,255,0.3)'
          }}
        >
          {user?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
          Super Admin
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  bgcolor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateX(5px)'
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? '#F7CD82' : 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'white' : 'rgba(255,255,255,0.9)'
                  }}
                />
                {isSelected && (
                  <motion.div layoutId="active-pill" style={{ width: 4, height: 24, background: '#F7CD82', borderRadius: 2 }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            color: '#ffcdd2',
            '&:hover': { bgcolor: 'rgba(255, 235, 238, 0.1)' }
          }}>
          <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />

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

      <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', position: 'relative' }}>
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
