import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

const INITIAL_STATE = {
  id: '',
  nombre: '',
};

const InsuranceDialog = ({ open, onClose, onSubmit, initialData, existingIds }) => {
  const isEdit = Boolean(initialData);
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(initialData || INITIAL_STATE);
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    const trimmedId = values.id.trim();
    const trimmedName = values.nombre.trim();

    if (!trimmedId) {
      nextErrors.id = 'Completá un identificador.';
    } else if (trimmedId.length < 2) {
      nextErrors.id = 'Mínimo 2 caracteres.';
    } else if (/\s/.test(trimmedId)) {
      nextErrors.id = 'No se permiten espacios.';
    } else if (!isEdit && existingIds.includes(trimmedId)) {
      nextErrors.id = 'Este ID ya existe.';
    }

    if (!trimmedName) {
      nextErrors.nombre = 'Ingresá un nombre.';
    } else if (trimmedName.length < 3) {
      nextErrors.nombre = 'Mínimo 3 caracteres.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    onSubmit({
      id: values.id.trim(),
      nombre: values.nombre.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" component="form" onSubmit={handleSubmit}>
      <DialogTitle>{isEdit ? 'Editar obra social' : 'Nueva obra social'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="ID"
            name="id"
            value={values.id}
            onChange={handleChange}
            error={Boolean(errors.id)}
            helperText={errors.id || 'Ejemplo: osde, galeno'}
            required
            disabled={isEdit}
            inputProps={{ 'aria-label': 'Identificador de la obra social' }}
          />
          <TextField
            label="Nombre"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre}
            required
            inputProps={{ 'aria-label': 'Nombre de la obra social' }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

InsuranceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    nombre: PropTypes.string,
  }),
  existingIds: PropTypes.arrayOf(PropTypes.string),
};

InsuranceDialog.defaultProps = {
  initialData: null,
  existingIds: [],
};

export default InsuranceDialog;
