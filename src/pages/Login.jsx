import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Link,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';

const CREDENTIALS = {
  email: 'admin@demo.com',
  password: 'Admin123!',
};

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('auth') === 'true') {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.email.trim()) {
      newErrors.email = 'Ingresá tu email.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formValues.email.trim())) {
      newErrors.email = 'Email inválido.';
    }

    if (!formValues.password.trim()) {
      newErrors.password = 'Ingresa tu contraseña.';
    } else if (formValues.password.trim().length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const email = formValues.email.trim();
    const password = formValues.password;

    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      localStorage.setItem('auth', 'true');
      const redirectPath = location.state?.from?.pathname || '/admin';
      navigate(redirectPath, { replace: true });
      return;
    }

    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) => theme.palette.background.default,
        px: 2,
        py: 6,
      }}
    >
      <AuthCard
        title="Acceso profesional"
        subtitle="Ingresá con tus credenciales para administrar turnos y obras sociales."
      >
        <Stack component="form" spacing={3} onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            value={formValues.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            fullWidth
            required
            value={formValues.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" color="primary" size="large">
            Ingresar
          </Button>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Link component={RouterLink} to="/" underline="hover" color="primary">
              Volver al inicio
            </Link>
            <Link component="button" type="button" underline="hover" color="text.secondary" sx={{ cursor: 'pointer' }}>
              Olvidé mi contraseña
            </Link>
          </Stack>
        </Stack>
      </AuthCard>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={handleSnackbarClose}>
          Credenciales inválidas.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
