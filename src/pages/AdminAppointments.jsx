import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import useNotifications from '../hooks/useNotifications';
import { apiClient } from '../services/apiClient';
import ConfirmDelete from '../components/ConfirmDelete';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // xs
  const isTabletUp = useMediaQuery(theme.breakpoints.up('sm')); // sm+
  const { showNotification } = useNotifications();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error('AdminAppointments: error fetching appointments', err);
      setError(err.message || 'No se pudo cargar la lista de turnos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleRequestSort = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter(({ patientName, email }) =>
      patientName.toLowerCase().includes(term) || email.toLowerCase().includes(term)
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

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleConfirm = async (id) => {
    try {
      const updated = await apiClient.patch(`/appointments/${id}/status`, { status: 'CONFIRMADA' });
      setAppointments((prev) => prev.map((appointment) => (appointment.id === id ? updated : appointment)));
      showNotification('Cita confirmada. Se ha enviado correo al paciente.', 'success');
    } catch (err) {
      console.error('AdminAppointments: error confirming appointment', err);
      showNotification(err.message || 'No se pudo confirmar el turno.', 'error');
    }
  };

  const handleCancel = async (id) => {
    try {
      const updated = await apiClient.patch(`/appointments/${id}/status`, { status: 'CANCELADA' });
      setAppointments((prev) =>
        prev.map((appointment) => (appointment.id === id ? updated : appointment))
      );
      showNotification('Turno cancelado.', 'success');
    } catch (err) {
      console.error('AdminAppointments: error cancelling appointment', err);
      showNotification(err.message || 'No se pudo cancelar el turno.', 'error');
    }
  };

  const handleDeleteRequest = (appointment) => {
    setDeleteTarget(appointment);
  };

  const handleDeleteCancel = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/appointments/${deleteTarget.id}`);
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== deleteTarget.id));
      if (detail?.id === deleteTarget.id) {
        setDetail(null);
      }
      showNotification('Turno eliminado.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error('AdminAppointments: error deleting appointment', err);
      showNotification(err.message || 'No se pudo eliminar el turno.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatSlot = (isoDate) => dayjs(isoDate).format('DD/MM/YYYY HH:mm');

  const resultsLabel = loading
    ? 'Cargando turnos...'
    : `${filteredAppointments.length} resultado${filteredAppointments.length === 1 ? '' : 's'}`;

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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
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
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}


      {isMobile && (
        <Stack spacing={1.5}>
          {paginatedAppointments.map((a) => {
            const isSolicitada = a.status === 'SOLICITADA';
            const isCancelada = a.status === 'CANCELADA';
            const chipColor = isSolicitada ? 'default' : isCancelada ? 'error' : 'success';
            return (
              <Card key={a.id} elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" color="text.secondary">
                        {a.id}
                      </Typography>
                      <Chip
                        label={a.status}
                        size="small"
                        color={chipColor}
                        variant={isSolicitada ? 'outlined' : 'filled'}
                      />
                    </Stack>

                    <Typography variant="h6" fontWeight={600}>{a.patientName}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      {a.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {a.email}
                    </Typography>

                    <Divider />

                    <Typography variant="body2" color="text.secondary">
                      Obra social: {a.insuranceName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha/Hora: {formatSlot(a.slotISO)}
                    </Typography>

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton aria-label="Ver detalle" size="small" onClick={() => setDetail(a)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      {isSolicitada && (
                        <IconButton
                          aria-label="Confirmar"
                          color="success"
                          size="small"
                          onClick={() => handleConfirm(a.id)}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      )}
                      {!isCancelada && (
                        <IconButton
                          aria-label="Cancelar"
                          color="warning"
                          size="small"
                          onClick={() => handleCancel(a.id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Eliminar"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteRequest(a)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}

          {loading && paginatedAppointments.length === 0 && (
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Cargando turnos...
              </Typography>
            </Paper>
          )}
          {!loading && paginatedAppointments.length === 0 && (
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No encontramos turnos con ese criterio.
              </Typography>
            </Paper>
          )}


          <Paper elevation={0} sx={{ mt: 1 }}>
            <TablePagination
              component="div"
              count={sortedAppointments.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
            />
          </Paper>
        </Stack>
      )}


      {isTabletUp && (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="medium" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Obra Social</TableCell>
                  <TableCell sortDirection={order}>
                    <TableSortLabel active direction={order} onClick={handleRequestSort}>
                      Fecha/Hora
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((a) => {
                  const isSolicitada = a.status === 'SOLICITADA';
                  const isCancelada = a.status === 'CANCELADA';
                  const chipColor = isSolicitada ? 'default' : isCancelada ? 'error' : 'success';
                  return (
                    <TableRow key={a.id} hover>
                      <TableCell>{a.id}</TableCell>
                      <TableCell sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.patientName}
                      </TableCell>
                      <TableCell>{a.phone}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.insuranceName}</TableCell>
                      <TableCell>{formatSlot(a.slotISO)}</TableCell>
                      <TableCell>
                        <Chip
                          label={a.status}
                          size="small"
                          color={chipColor}
                          variant={isSolicitada ? 'outlined' : 'filled'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                          <IconButton aria-label="Ver detalle" size="small" onClick={() => setDetail(a)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          {isSolicitada && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleConfirm(a.id)}
                            >
                              Confirmar
                            </Button>
                          )}
                          {!isCancelada && (
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              onClick={() => handleCancel(a.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteRequest(a)}
                          >
                            Eliminar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {loading && paginatedAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Cargando turnos...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && paginatedAppointments.length === 0 && (
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

          <TablePagination
            component="div"
            count={sortedAppointments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </Paper>
      )}

      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle del turno</DialogTitle>
        {detail && (
          <DialogContent dividers>
            <Typography variant="subtitle2">Paciente</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {detail.patientName}
            </Typography>

            <Typography variant="subtitle2">Contacto</Typography>
            <Typography variant="body2" color="text.secondary">
              Teléfono: {detail.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Email: {detail.email}
            </Typography>

            <Typography variant="subtitle2">Turno</Typography>
            <Typography variant="body2" color="text.secondary">
              Obra social: {detail.insuranceName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fecha y hora: {formatSlot(detail.slotISO)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estado: {detail.status}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar turno"
        description={
          deleteTarget
            ? `¿Confirmás eliminar el turno de ${deleteTarget.patientName} (${formatSlot(deleteTarget.slotISO)})?`
            : ''
        }
      />
    </Box>
  );
};

export default AdminAppointments;
