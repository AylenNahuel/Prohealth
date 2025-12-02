import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import ScienceIcon from '@mui/icons-material/Science';
import VaccinesIcon from '@mui/icons-material/Vaccines';

const services = [
  {
    title: 'Consultas integrales',
    description: 'Evaluación clínica completa, seguimiento de enfermedades crónicas y chequeos preventivos.',
    icon: MedicalServicesIcon,
  },
  {
    title: 'Diagnóstico temprano',
    description: 'Interpretación de estudios, análisis de laboratorio y coordinación conmigo.',
    icon: ScienceIcon,
  },
  {
    title: 'Tratamientos personalizados',
    description: 'Planes terapéuticos adaptados a cada paciente con enfoque multidisciplinario.',
    icon: HealingIcon,
  },
  {
    title: 'Vacunación y prevención',
    title: 'Prevención de enfermedades',
    description: 'Calendario de vacunas adultos, control de factores de riesgo y educación sanitaria.',
    icon: VaccinesIcon,
  },
];

const Services = () => (
  <Box component="section" id="servicios" sx={{ py: { xs: 8, md: 10 }, backgroundColor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" fontWeight={700} textAlign="center" gutterBottom>
        Servicios
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
        Te brindo una atención integral, cercana y basada en evidencia para acompañarte en todas las etapas de tu cuidado.
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={service.title}>
              <Card sx={{ height: '100%', boxShadow: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRadius: 3,
                      p: 1.5,
                      mb: 2,
                    }}
                  >
                    <Icon fontSize="large" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  </Box>
);

export default Services;
