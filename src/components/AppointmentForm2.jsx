import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Turnera from './Turnera';
import useInsurances from '../hooks/useInsurances';
import useNotifications from '../hooks/useNotifications';
import { OCCUPIED_APPOINTMENTS } from '../mocks/appointments.data';

const initialValues = {
  patientName: '',
  phone: '',
  email: '',
  insurance: '',
};

const AppointmentForm2 = () => {
  const { insurances } = useInsurances();
  const { showNotification } = useNotifications();
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [selectedSlot, setSelectedSlot] = useState('');
  const [occupiedSlots] = useState(() => OCCUPIED_APPOINTMENTS);

  useEffect(() => {
    if (formValues.insurance && !insurances.some((i) => i.id === formValues.insurance)) {
      setFormValues((prev) => ({ ...prev, insurance: '' }));
    }
  }, [insurances, formValues.insurance]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    const name = formValues.patientName.trim();
    if (!name || name.length < 3) next.patientName = 'Ingresá un nombre válido (mínimo 3 caracteres).';
    const phone = formValues.phone.trim();
    if (!phone) next.phone = 'Ingresá un teléfono válido.';
    else if (!/^[0-9+]+$/.test(phone) || phone.replace(/\D/g, '').length < 8) next.phone = 'Solo números (o +) y mínimo 8 dígitos.';
    const email = formValues.email.trim();
    if (!email) next.email = 'Ingresá un email.';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(email)) next.email = 'Ingresá un email válido.';
    if (!formValues.insurance) next.insurance = 'Seleccioná una obra social.';
    if (!selectedSlot) next.slot = 'Seleccioná un horario disponible.';
    else {
      const slotDate = dayjs(selectedSlot);
      if (!slotDate.isValid() || slotDate.valueOf() < dayjs().valueOf()) next.slot = 'El turno seleccionado ya no está disponible.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const selectedSlotLabel = useMemo(
    () => (selectedSlot ? dayjs(selectedSlot).format('DD/MM/YYYY HH:mm') : ''),
    [selectedSlot]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    showNotification('Turno solicitado. Recibirás un correo de confirmación.', 'success');
    setFormValues(initialValues);
    setSelectedSlot('');
  };

  const hasInsurances = insurances.length > 0;

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 0 } }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            Reservar turno
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Elegí el día y horario disponibles, completá tus datos y nos comunicaremos para confirmar el turno.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Turnera value={selectedSlot} onPick={setSelectedSlot} occupiedSlots={occupiedSlots} />
          {errors.slot && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.slot}
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Nombre y apellido"
              name="patientName"
              value={formValues.patientName}
              onChange={handleChange}
              error={Boolean(errors.patientName)}
              helperText={errors.patientName}
              inputProps={{ 'aria-label': 'Nombre y apellido del paciente' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Teléfono"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              inputProps={{ inputMode: 'tel', 'aria-label': 'Teléfono de contacto' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Correo electrónico"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              inputProps={{ 'aria-label': 'Correo electrónico' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={Boolean(errors.insurance)}>
              <InputLabel id="appointment-insurance-label">Obra social</InputLabel>
              <Select
                labelId="appointment-insurance-label"
                label="Obra social"
                name="insurance"
                value={formValues.insurance}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Obra social' }}
                disabled={!hasInsurances}
              >
                {insurances.map((insurance) => (
                  <MenuItem key={insurance.id} value={insurance.id}>
                    {insurance.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.insurance && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.insurance}
                </Typography>
              )}
            </FormControl>
            {!hasInsurances && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                No hay obras sociales cargadas.
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Horario elegido" value={selectedSlotLabel} InputProps={{ readOnly: true }} placeholder="Seleccioná un horario en la turnera" />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={!hasInsurances}>
              Reservar turno
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AppointmentForm2;
