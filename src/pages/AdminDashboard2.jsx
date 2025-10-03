import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import TodayIcon from '@mui/icons-material/TodayOutlined';
import { APPOINTMENT_MOCKS } from '../mocks/appointments.data';
import { useTheme } from '@mui/material/styles';

const iconMap = {
  solicitadas: CalendarMonthIcon,
  confirmadas: CheckCircleIcon,
  proximas: TodayIcon,
};

const computeMetrics = () => {
  const now = dayjs();
  const weekLimit = now.add(7, 'day').endOf('day');

  const solicitadasSemana = APPOINTMENT_MOCKS.filter(({ estado, slotISO }) => {
    const slot = dayjs(slotISO);
    return estado === 'SOLICITADA' && slot.isSameOrAfter(now) && slot.isBefore(weekLimit);
  }).length;

  const confirmadasSemana = APPOINTMENT_MOCKS.filter(({ estado, slotISO }) => {
    const slot = dayjs(slotISO);
    return estado === 'CONFIRMADA' && slot.isSameOrAfter(now) && slot.isBefore(weekLimit);
  }).length;

  const proximasHoy = APPOINTMENT_MOCKS.filter(({ slotISO }) => dayjs(slotISO).isSame(now, 'day')).length;

  const proximas = APPOINTMENT_MOCKS.filter(({ slotISO }) => dayjs(slotISO).isSameOrAfter(now))
    .sort((a, b) => dayjs(a.slotISO).diff(dayjs(b.slotISO)))
    .slice(0, 5);

  return { solicitadasSemana, confirmadasSemana, proximasHoy, proximas };
};

const AdminDashboard2 = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // xs

  const { solicitadasSemana, confirmadasSemana, proximasHoy, proximas } = useMemo(() => computeMetrics(), []);

  const stats = [
    { key: 'solicitadas', label: 'Solicitadas (semana)', value: solicitadasSemana, color: 'primary' },
    { key: 'confirmadas', label: 'Confirmadas (semana)', value: confirmadasSemana, color: 'secondary' },
    { key: 'proximas', label: 'Próximas (hoy)', value: proximasHoy, color: 'warning' },
  ];

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Resumen operativo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Datos actualizados de tus turnos para tomar acción rápidamente.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button fullWidth variant="outlined" onClick={() => navigate('/admin/appointments')}>
            Gestionar citas
          </Button>
          <Button fullWidth variant="contained" onClick={() => navigate('/admin/insurances')}>
            Obras sociales
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map(({ key, label, value, color }) => {
          const Icon = iconMap[key];
          return (
            <Grid key={key} item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: (t) => alpha(t.palette[color].main, 0.12),
                        color: (t) => t.palette[color].main,
                        width: 64,
                        height: 64,
                      }}
                    >
                      <Icon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight={700}>
                        {value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Próximos turnos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los próximos turnos ordenados por fecha.
            </Typography>
          </Box>
          <Button variant="text" onClick={() => navigate('/admin/appointments')}>
            Ver todas
          </Button>
        </Stack>

        {/* XS: lista compacta / SM+: tabla */}
        {isMobile ? (
          <Stack spacing={1}>
            {proximas.map((a) => (
              <Card key={a.id} elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {a.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(a.slotISO).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                  <Chip
                    sx={{ mt: 1 }}
                    label={a.estado}
                    size="small"
                    color={a.estado === 'CONFIRMADA' ? 'success' : 'default'}
                    variant={a.estado === 'CONFIRMADA' ? 'filled' : 'outlined'}
                  />
                </CardContent>
              </Card>
            ))}
            {proximas.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                No hay turnos próximos programados.
              </Typography>
            )}
          </Stack>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Obra social</TableCell>
                  <TableCell>Fecha/Hora</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proximas.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>{a.nombre}</TableCell>
                    <TableCell>{a.obra}</TableCell>
                    <TableCell>{dayjs(a.slotISO).format('DD/MM/YYYY HH:mm')}</TableCell>
                    <TableCell>
                      <Chip
                        label={a.estado}
                        size="small"
                        color={a.estado === 'CONFIRMADA' ? 'success' : 'default'}
                        variant={a.estado === 'CONFIRMADA' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {proximas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No hay turnos próximos programados.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard2;
