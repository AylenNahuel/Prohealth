import { alpha } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';

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
            Atenci�n m�dica personalizada
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mt: 2, mb: 3 }}>
            Cuidamos de tu salud con excelencia y cercan�a
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Agenda tu consulta con el Dr. Juan P�rez, especialista en medicina interna con m�s de 15 a�os de experiencia.
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
            src="https://images.unsplash.com/photo-1579155273739-e0ad33a6ab29?auto=format&fit=crop&w=900&q=80"
            alt="Consulta m�dica"
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
