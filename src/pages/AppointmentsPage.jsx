import { Box, Container, Typography } from '@mui/material';
import AppointmentForm from '../components/AppointmentForm';

const AppointmentsPage = () => (
  <Box sx={{ py: { xs: 6, md: 8 } }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" fontWeight={700} textAlign="center" sx={{ mb: 4 }}>
        Solicitar un turno
      </Typography>
    </Container>
    <AppointmentForm />
  </Box>
);

export default AppointmentsPage;
