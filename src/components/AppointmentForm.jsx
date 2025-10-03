import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import useInsurances from '../hooks/useInsurances';
import useNotifications from '../hooks/useNotifications';
import Turnera from './Turnera';
import { OCCUPIED_APPOINTMENTS } from '../mocks/appointments';

const initialValues = {
  patientName: '',
  phone: '',
  email: '',
  insurance: '',
};

const AppointmentForm = ({ onBooked }) => {
  const { insurances } = useInsurances();
  const { showNotification } = useNotifications();
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [emailInfo, setEmailInfo] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [occupiedSlots] = useState(() => OCCUPIED_APPOINTMENTS);

  useEffect(() => {
    if (formValues.insurance && !insurances.some((insurance) => insurance.id === formValues.insurance)) {
      setFormValues((prev) => ({ ...prev, insurance: '' }));
    }
  }, [insurances, formValues.insurance]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const trimmedName = formValues.patientName.trim();
    if (!trimmedName || trimmedName.length < 3) {
      newErrors.patientName = 'Ingrese un nombre válido (mínimo 3 caracteres).';
    }

    if (!formValues.phone.trim()) {
      newErrors.phone = 'Ingrese un teléfono válido.';
    } else if (!/^[0-9+]+$/.test(formValues.phone.trim()) || formValues.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Solo números (o +) y mínimo 8 dígitos.';
    }

    if (!formValues.email.trim()) {
      newErrors.email = 'Ingrese un email.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formValues.email.trim())) {
      newErrors.email = 'Ingrese un email válido.';
    }

    if (!formValues.insurance) {
      newErrors.insurance = 'Seleccione una obra social.';
    }

    if (!selectedSlot) {
      newErrors.slot = 'Seleccione un horario disponible.';
    } else {
      const slotDate = dayjs(selectedSlot);
      if (!slotDate.isValid() || slotDate.valueOf() < dayjs().valueOf()) {
        newErrors.slot = 'El turno seleccionado ya no está disponible.';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const patientEmail = formValues.email.trim();
    showNotification('Turno solicitado. Recibirás un correo de confirmación.', 'success');
    setEmailInfo(`Email enviado a ${patientEmail}`);
    onBooked?.({
      ...formValues,
      slotISO: selectedSlot,
    });
    setFormValues(initialValues);
    setSelectedSlot('');
  };

  const hasInsurances = insurances.length > 0;
  const selectedSlotLabel = useMemo(
    () => (selectedSlot ? dayjs(selectedSlot).format('DD/MM/YYYY HH:mm') : ''),
    [selectedSlot]
  );

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          maxWidth: 720,
          mx: 'auto',
          px: { xs: 2, sm: 0 },
        }}
      >
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
          <Grid size={12}>
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
          <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Horario elegido"
              value={selectedSlotLabel}
              InputProps={{ readOnly: true }}
              placeholder="Seleccione un horario en la turnera"
            />
          </Grid>
          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!hasInsurances}
            >
              Reservar turno
            </Button>
          </Grid>
        </Grid>

        {emailInfo && (
          <Alert severity="info" sx={{ mt: 3 }}>
            {emailInfo}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

AppointmentForm.propTypes = {
  onBooked: PropTypes.func,
};

AppointmentForm.defaultProps = {
  onBooked: undefined,
};

export default AppointmentForm;
