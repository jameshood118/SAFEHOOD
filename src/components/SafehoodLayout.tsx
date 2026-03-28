import {
  faBars,
  faClipboardList,
  faClockRotateLeft,
  faHouseSignal,
  faMicrochip,
  faUsers,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const navItems = [
  { text: 'Command Center', path: '/', icon: faUserShield },
  { text: 'AI Portal', path: '/ai-portal', icon: faMicrochip },
  { text: 'Human OS', path: '/manifests', icon: faClipboardList },
  { text: 'Work OS', path: '/personnel', icon: faUsers },
  { text: 'Home OS', path: '/home', icon: faHouseSignal },
  { text: 'Temporal Vault', path: '/temporal-logs', icon: faClockRotateLeft },
];

export const SafehoodLayout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // The actual navigation list, cleanly separated
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0a0510' }}>
      <Toolbar sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: 'primary.contrastText', letterSpacing: '1px' }}
        >
          SAFEHOOD
        </Typography>
      </Toolbar>

      {/* Semantic Nav wrapper for Accessibility */}
      <List component="nav" sx={{ px: 2, pt: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)} // Close drawer on mobile tap
                sx={{
                  borderRadius: 1,
                  bgcolor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                  color: isActive ? '#00E5FF' : 'text.secondary',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'primary.contrastText' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <FontAwesomeIcon icon={item.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: 'monospace',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* MOBILE APP BAR (Only visible on small screens) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          display: { sm: 'none' },
          bgcolor: '#0a0510',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
            PROTOCOL ACTIVE
          </Typography>
        </Toolbar>
      </AppBar>

      {/* THE SIDEBAR DRAWER */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        {/* Mobile Temporary Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(255,255,255,0.05)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(255,255,255,0.05)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* MAIN VIEWPORT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: { xs: 2, md: 4 },
          mt: { xs: '56px', sm: 0 },
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
