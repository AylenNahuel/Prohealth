import { Avatar, Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const DoctorBio = () => (
  <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              alt="Dr. Juan Pérez"
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80"
              sx={{ width: 160, height: 160, mx: 'auto', mb: 2 }}
            />
            <CardContent>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Dr. Juan Pérez
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Especialista en Medicina Interna
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            <Typography variant="h4" component="h2" fontWeight={700}>
              Sobre el médico
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Con más de 15 años de experiencia en medicina interna, el Dr. Pérez acompaña a sus pacientes con un enfoque humano y basado en evidencia. Ha liderado equipos interdisciplinarios en clínicas privadas y hospitales públicos de la región.
            </Typography>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Formación
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Médico egresado de la Universidad de Buenos Aires (UBA)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Residencia completa en Clínica Médica – Hospital Italiano
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Fellow en Medicina Interna Avanzada – Mayo Clinic
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                      Matrícula
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      MN 123456 · MP 654321
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                      Experiencia
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      15 años atendiendo pacientes en consultorio y guardias
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default DoctorBio;
