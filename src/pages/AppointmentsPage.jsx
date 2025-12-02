import { Box, Container, Typography } from '@mui/material';
import AppointmentForm from '../components/AppointmentForm2';

const AppointmentsPage = () => (
  <Box sx={{ py: { xs: 4, md: 6 } }}>
    <Container maxWidth="lg">
      <AppointmentForm />
    </Container>
  </Box>
);

export default AppointmentsPage;
