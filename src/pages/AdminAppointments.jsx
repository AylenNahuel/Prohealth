import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import useNotifications from '../hooks/useNotifications';

const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    paciente: 'Juan Pérez',
    telefono: '1122334455',
    email: 'juanp@example.com',
    obra: 'OSDE',
    slot: '2025-10-10T10:30:00.000Z',
    estado: 'SOLICITADA',
  },
  {
    id: 2,
    paciente: 'María López',
    telefono: '1199887766',
    email: 'maria@example.com',
    obra: 'Swiss Medical',
    slot: '2025-10-11T14:00:00.000Z',
    estado: 'CONFIRMADA',
  },
  {
    id: 3,
    paciente: 'Carlos Rodríguez',
    telefono: '1133557799',
    email: 'carlosr@example.com',
    obra: 'Galeno',
    slot: '2025-10-12T09:00:00.000Z',
    estado: 'SOLICITADA',
  },
];

const AdminAppointments = () => {
  const { showNotification } = useNotifications();
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [search, setSearch] = useState('');

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter(
      (appointment) =>
        appointment.paciente.toLowerCase().includes(term) ||
        appointment.email.toLowerCase().includes(term)
    );
  }, [appointments, search]);

  const handleConfirm = (id) => {
    const target = appointments.find((appointment) => appointment.id === id);
    if (!target || target.estado === 'CONFIRMADA') {
      return;
    }

    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, estado: 'CONFIRMADA' } : appointment
      )
    );

    showNotification('Cita confirmada.', 'success');
  };

  const formatSlot = (isoDate) => dayjs(isoDate).format('DD/MM/YYYY HH:mm');

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Gestión de citas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Filtrá las solicitudes y confirmá los turnos de tus pacientes.
          </Typography>
        </Box>
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar paciente o email"
          size="small"
          sx={{ width: { xs: '100%', sm: 280 } }}
        />
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: 6 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Obra social</TableCell>
                <TableCell>Fecha / hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => {
                const isSolicitada = appointment.estado === 'SOLICITADA';
                return (
                  <TableRow key={appointment.id} hover>
                    <TableCell>{appointment.id}</TableCell>
                    <TableCell>{appointment.paciente}</TableCell>
                    <TableCell>{appointment.telefono}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{appointment.obra}</TableCell>
                    <TableCell>{formatSlot(appointment.slot)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={isSolicitada ? 'warning.main' : 'success.main'}
                        fontWeight={600}
                      >
                        {appointment.estado}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {isSolicitada ? (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleConfirm(appointment.id)}
                        >
                          Confirmar
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Confirmada
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No encontramos turnos con ese criterio.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminAppointments;
