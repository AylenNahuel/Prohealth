import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import InsuranceDialog from '../components/InsuranceDialog';
import ConfirmDelete from '../components/ConfirmDelete';
import useInsurances from '../hooks/useInsurances';

const AdminInsurances2 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { insurances, loading: insurancesLoading, error: insurancesError, addInsurance, updateInsurance, removeInsurance, existsId } = useInsurances();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredInsurances = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return insurances;
    return insurances.filter(({ nombre, id }) => nombre.toLowerCase().includes(query) || id.toLowerCase().includes(query));
  }, [insurances, search]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingInsurance(null);
  };

  const handleCreate = () => {
    setEditingInsurance(null);
    setDialogOpen(true);
  };

  const handleEdit = (insurance) => {
    setEditingInsurance(insurance);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    const toDelete = insurances.find((item) => item.id === confirmId);
    try {
      await removeInsurance(confirmId);
      setSnackbar({ open: true, message: `Obra social "${toDelete?.nombre}" eliminada.`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'No se pudo eliminar la obra social.', severity: 'error' });
    } finally {
      setConfirmId(null);
    }
  };

  const handleDialogSubmit = async (insurance) => {
    try {
      if (editingInsurance) {
        await updateInsurance(editingInsurance.id, { nombre: insurance.nombre });
        setSnackbar({ open: true, message: 'Obra social actualizada.', severity: 'success' });
      } else {
        if (existsId(insurance.id)) {
          setSnackbar({ open: true, message: 'El ID ingresado ya existe.', severity: 'error' });
          return;
        }
        await addInsurance(insurance);
        setSnackbar({ open: true, message: 'Obra social creada.', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'No se pudo guardar la obra social.', severity: 'error' });
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const noResults = !insurancesLoading && filteredInsurances.length === 0;
  const noData = !insurancesLoading && insurances.length === 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Obras Sociales
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrá los convenios que se mostrarán en la reserva de turnos.
            </Typography>
          </Box>
          <Button onClick={handleCreate} variant="contained" color="primary" sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}>
            Nueva obra social
          </Button>
        </Box>
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o ID"
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
          sx={{ maxWidth: 320 }}
        />
      </Box>

      {insurancesError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {insurancesError}
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {insurancesLoading ? (
          <Typography variant="body2" color="text.secondary">
            Cargando obras sociales...
          </Typography>
        ) : noResults ? (
          <Alert severity={noData ? 'warning' : 'info'}>
            {noData ? 'No hay obras sociales cargadas. Agregá la primera.' : 'No encontramos obras sociales con ese criterio.'}
          </Alert>
        ) : (
          <TableContainer>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInsurances.map((insurance) => (
                  <TableRow key={insurance.id} hover>
                    <TableCell>{insurance.id}</TableCell>
                    <TableCell>{insurance.nombre}</TableCell>
                    <TableCell align="right">
                      {isMobile ? (
                        <Box>
                          <IconButton aria-label={`Editar ${insurance.nombre}`} size="small" onClick={() => handleEdit(insurance)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton aria-label={`Eliminar ${insurance.nombre}`} size="small" color="error" onClick={() => handleDeleteRequest(insurance.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button variant="outlined" size="small" onClick={() => handleEdit(insurance)}>
                            Editar
                          </Button>
                          <Button variant="contained" color="error" size="small" onClick={() => handleDeleteRequest(insurance.id)}>
                            Eliminar
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <InsuranceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        initialData={editingInsurance}
        existingIds={insurances.map((item) => item.id)}
      />

      <ConfirmDelete
        open={Boolean(confirmId)}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar obra social"
        description={`¿Eliminar obra social "${insurances.find((item) => item.id === confirmId)?.nombre || ''}"?`}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminInsurances2;
