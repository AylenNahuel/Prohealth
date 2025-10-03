import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InsuranceDialog from '../components/InsuranceDialog';
import ConfirmDelete from '../components/ConfirmDelete';
import useInsurances from '../hooks/useInsurances';

const AdminInsurances = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { insurances, addInsurance, updateInsurance, removeInsurance } = useInsurances();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredInsurances = useMemo(() => {
    if (!search.trim()) {
      return insurances;
    }
    const query = search.trim().toLowerCase();
    return insurances.filter(
      (insurance) =>
        insurance.nombre.toLowerCase().includes(query) || insurance.id.toLowerCase().includes(query)
    );
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

  const handleDeleteConfirm = () => {
    const toDelete = insurances.find((item) => item.id === confirmId);
    removeInsurance(confirmId);
    setConfirmId(null);
    setSnackbar({ open: true, message: `Obra social "${toDelete?.nombre}" eliminada.`, severity: 'success' });
  };

  const handleDialogSubmit = (insurance) => {
    if (editingInsurance) {
      updateInsurance(editingInsurance.id, { nombre: insurance.nombre });
      setSnackbar({ open: true, message: 'Obra social actualizada.', severity: 'success' });
    } else {
      addInsurance(insurance);
      setSnackbar({ open: true, message: 'Obra social creada.', severity: 'success' });
    }
    handleCloseDialog();
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const existingIds = useMemo(() => insurances.map((item) => item.id), [insurances]);

  const noResults = filteredInsurances.length === 0;
  const noData = insurances.length === 0;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ flexGrow: 1 }}>
              Obras Sociales
            </Typography>
            <Button onClick={handleCreate} variant="contained" color="primary" sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}>
              Nueva obra social
            </Button>
          </Box>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o ID"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 320 }}
          />
        </Box>

        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          {noResults ? (
            <Alert severity={noData ? 'warning' : 'info'}>
              {noData ? 'No hay obras sociales cargadas. Creá la primera.' : 'No encontramos obras sociales con ese criterio.'}
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
                            <IconButton
                              aria-label={`Editar ${insurance.nombre}`}
                              onClick={() => handleEdit(insurance)}
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              aria-label={`Eliminar ${insurance.nombre}`}
                              onClick={() => handleDeleteRequest(insurance.id)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button variant="outlined" size="small" onClick={() => handleEdit(insurance)}>
                              Editar
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteRequest(insurance.id)}
                            >
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
      </Container>

      <InsuranceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        initialData={editingInsurance}
        existingIds={editingInsurance ? existingIds.filter((id) => id !== editingInsurance.id) : existingIds}
      />

      <ConfirmDelete
        open={Boolean(confirmId)}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar obra social"
        description={`¿Eliminar obra social "${insurances.find((item) => item.id === confirmId)?.nombre || ''}"?`}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminInsurances;
