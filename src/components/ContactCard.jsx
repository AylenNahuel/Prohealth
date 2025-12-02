import { Box, Card, CardContent, Container, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const ContactCard = () => (
  <Box component="section" id="contacto" sx={{ py: { xs: 8, md: 10 }, backgroundColor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
                Contacto
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Agendá tu consulta o envianos tus estudios para una segunda opinión. Estamos para ayudarte.
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Consultorio Central
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Av. Santa Fe 1234, CABA
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <WhatsAppIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      WhatsApp
                    </Typography>
                    <Link href="https://wa.me/5491122223333" color="text.primary" underline="hover">
                      +54 9 11 2222-3333
                    </Link>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Email
                    </Typography>
                    <Link href="mailto:turnos@prohealth.com" color="text.primary" underline="hover">
                      turnos@prohealth.com
                    </Link>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            component="iframe"
            title="Ubicación del consultorio"
            src="https://maps.google.com/maps?q=obelisco%20buenos%20aires&t=&z=13&ie=UTF8&iwloc=&output=embed"
            sx={{
              border: 0,
              width: '100%',
              height: { xs: 320, md: '100%' },
              minHeight: 320,
              borderRadius: 3,
              boxShadow: 3,
            }}
            loading="lazy"
            allowFullScreen
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default ContactCard;
