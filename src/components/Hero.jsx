import { alpha } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import consultaImg from '../assets/consulta-medica.jpg';

const Hero = () => (
  <Box
    sx={(theme) => ({
      backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(
        theme.palette.secondary.main,
        0.08
      )})`,
      pt: { xs: 12, md: 16 },
      pb: { xs: 10, md: 14 },
    })}
  >
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
            Atención  médica personalizada
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mt: 2, mb: 3 }}>
            Cuidamos de tu salud con excelencia y cercanía 
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Agendá tu consulta con el Dr. Juan Pérez, especialista en medicina interna con más de 15 años de experiencia.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/appointments"
          >
            Reservar turno
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={consultaImg}
            alt="Consulta médica"
            sx={{
              width: '100%',
              borderRadius: 4,
              boxShadow: 4,
              objectFit: 'cover',
              maxHeight: { xs: 300, md: 420 },
            }}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Hero;

