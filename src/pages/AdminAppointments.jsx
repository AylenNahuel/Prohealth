import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import useNotifications from '../hooks/useNotifications';
import { APPOINTMENT_MOCKS } from '../mocks/appointments.data';

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'nombre', label: 'Paciente' },
  { id: 'telefono', label: 'Teléfono' },
  { id: 'email', label: 'Email' },
  { id: 'obra', label: 'Obra Social' },
  { id: 'slotISO', label: 'Fecha/Hora', sortable: true },
  { id: 'estado', label: 'Estado' },
];

const rowsPerPageOptions = [10];

const AdminAppointments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showNotification } = useNotifications();

  const [appointments, setAppointments] = useState(APPOINTMENT_MOCKS);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);

  const handleRequestSort = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter(({ nombre, email }) =>
      nombre.toLowerCase().includes(term) || email.toLowerCase().includes(term)
    );
  }, [appointments, search]);

  const sortedAppointments = useMemo(() => {
    const data = [...filteredAppointments].sort((a, b) =>
      dayjs(a.slotISO).diff(dayjs(b.slotISO))
    );
    return order === 'asc' ? data : data.reverse();
  }, [filteredAppointments, order]);

  const rowsPerPage = rowsPerPageOptions[0];
  const paginatedAppointments = useMemo(
    () =>
      sortedAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedAppointments, page, rowsPerPage]
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleConfirm = (id) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, estado: 'CONFIRMADA' } : appointment
      )
    );
    showNotification('Cita confirmada. Se ha enviado correo al paciente.', 'success');
  };

  const formatSlot = (isoDate) => dayjs(isoDate).format('DD/MM/YYYY HH:mm');

  const resultsLabel = `${filteredAppointments.length} resultado${
    filteredAppointments.length === 1 ? '' : 's'
  }`;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Gestión de citas
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <TextField
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Buscar por paciente o email"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 320 } }}
          />
          <Typography variant="subtitle2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            {resultsLabel}
          </Typography>
        </Stack>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* Top controls moved to header bar */}

        <TableContainer>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} sortDirection={column.id === 'slotISO' ? order : false}>
                    {column.id === 'slotISO' ? (
                      <TableSortLabel active direction={order} onClick={handleRequestSort}>
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppointments.map((appointment) => {
                const isSolicitada = appointment.estado === 'SOLICITADA';
                return (
                  <TableRow key={appointment.id} hover>
                    <TableCell>{appointment.id}</TableCell>
                    <TableCell>{appointment.nombre}</TableCell>
                    <TableCell>{appointment.telefono}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{appointment.obra}</TableCell>
                    <TableCell>{formatSlot(appointment.slotISO)}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.estado}
                        size="small"
                        color={isSolicitada ? 'default' : 'success'}
                        variant={isSolicitada ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <IconButton aria-label="Ver detalle" size="small" onClick={() => setDetail(appointment)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {isSolicitada && (
                          isMobile ? (
                            <IconButton aria-label="Confirmar" color="success" size="small" onClick={() => handleConfirm(appointment.id)}>
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleConfirm(appointment.id)}
                            >
                              Confirmar
                            </Button>
                          )
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No encontramos turnos con ese criterio.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedAppointments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Paper>

      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle del turno</DialogTitle>
        {detail && (
          <DialogContent dividers>
            <Typography variant="subtitle2">Paciente</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {detail.nombre}
            </Typography>

            <Typography variant="subtitle2">Contacto</Typography>
            <Typography variant="body2" color="text.secondary">
              Teléfono: {detail.telefono}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Email: {detail.email}
            </Typography>

            <Typography variant="subtitle2">Turno</Typography>
            <Typography variant="body2" color="text.secondary">
              Obra social: {detail.obra}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fecha y hora: {formatSlot(detail.slotISO)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estado: {detail.estado}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAppointments;
