import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/services' },
  { label: 'Obras Sociales', to: '/insurances' },
  { label: 'Contacto', to: '/contact' },
  { label: 'Reservar turno', to: '/appointments' },
];

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const renderNavLinks = (onClick) => (
    <Stack direction={isDesktop ? 'row' : 'column'} spacing={isDesktop ? 2 : 1} component="nav">
      {navItems.map((item) => (
        <Button
          key={item.to}
          color={location.pathname === item.to ? 'primary' : 'inherit'}
          component={RouterLink}
          to={item.to}
          onClick={onClick}
          sx={{ fontWeight: 500 }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={{ py: 2 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: 1,
          }}
        >
          <Box component="img" src={logo} alt="ProHealth" sx={{ width: 40, height: 40 }} />
          <Typography variant="h6" fontWeight={700}>
            ProHealth
          </Typography>
        </Box>

        <Box flexGrow={1} />

        {isDesktop ? (
          <Stack direction="row" spacing={2} alignItems="center">
            {renderNavLinks()}
            <Button component={RouterLink} to="/login" variant="contained" color="primary">
              Login
            </Button>
          </Stack>
        ) : (
          <IconButton onClick={toggleDrawer(true)} aria-label="Abrir menú de navegación">
            <MenuIcon />
          </IconButton>
        )}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ width: 280 }} role="presentation">
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Menú
              </Typography>
              <IconButton onClick={toggleDrawer(false)} aria-label="Cerrar menú de navegación">
                <CloseIcon />
              </IconButton>
            </Stack>
            <Divider />
            <List>
              {navItems.map((item) => (
                <ListItemButton
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  selected={location.pathname === item.to}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
              <ListItemButton component={RouterLink} to="/login" onClick={toggleDrawer(false)}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
