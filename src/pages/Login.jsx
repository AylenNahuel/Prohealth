import { useEffect, useState } from 'react';
import { Alert, Box, Button, Snackbar, Stack, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { apiClient } from '../services/apiClient';

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
  const [snackbarMessage, setSnackbarMessage] = useState('Credenciales inválidas.');
  const fallbackPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
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
      newErrors.email = 'Ingrese su email.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formValues.email.trim())) {
      newErrors.email = 'Email inválido.';
    }

    if (!formValues.password.trim()) {
      newErrors.password = 'Ingrese su contraseña.';
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

    apiClient
      .post('/auth/login', { email, password }, { auth: false })
      .then((data) => {
        apiClient.setToken(data.token);
        localStorage.setItem('auth', 'true');
        localStorage.setItem('authUser', JSON.stringify(data.user));
        const redirectPath = location.state?.from?.pathname || '/admin';
        navigate(redirectPath, { replace: true });
      })
      .catch((error) => {
        setSnackbarMessage(error.message || 'Credenciales inválidas.');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleGoHome = () => {
    navigate(fallbackPath, { replace: true });
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
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 460 }}>
        <Button onClick={handleGoHome} startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>
          Volver al inicio
        </Button>
        <AuthCard
          title="Acceso profesional"
          subtitle="Ingrese con sus credenciales para administrar turnos y obras sociales."
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
        </Stack>
        </AuthCard>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
