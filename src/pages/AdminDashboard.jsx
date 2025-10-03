import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import TodayIcon from '@mui/icons-material/TodayOutlined';

const stats = [
  {
    label: 'Turnos solicitados (semana)',
    value: 18,
    icon: CalendarMonthIcon,
    color: 'primary',
  },
  {
    label: 'Turnos confirmados',
    value: 12,
    icon: CheckCircleIcon,
    color: 'secondary',
  },
  {
    label: 'Próximos del día',
    value: 4,
    icon: TodayIcon,
    color: 'warning',
  },
];

const AdminDashboard = () => (
  <Box>
    <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1 }}>
      Bienvenido de nuevo, Dr. Pérez ??
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      Resumen actualizado de tu agenda y gestión de turnos.
    </Typography>

    <Grid container spacing={3}>
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette[stat.color].main, 0.12),
                      color: (theme) => theme.palette[stat.color].main,
                      width: 64,
                      height: 64,
                    }}
                  >
                    <IconComponent fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </Box>
);

export default AdminDashboard;
