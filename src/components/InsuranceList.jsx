import { Box, Chip, Container, Stack, Typography } from '@mui/material';

const insurances = [
  'OSDE',
  'Swiss Medical',
  'Galeno',
  'Medifé',
  'Hospital Italiano',
  'OMINT',
  'Sancor Salud',
  'IOMA',
];

const InsuranceList = () => (
  <Box component="section" id="obras-sociales" sx={{ py: { xs: 8, md: 10 } }}>
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" fontWeight={700} textAlign="center" gutterBottom>
        Obras Sociales
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 560, mx: 'auto', mb: 4 }}>
        Trabajamos con las principales obras sociales y prepagas para que puedas acceder a tu consulta sin complicaciones.
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ gap: 2 }}
      >
        {insurances.map((insurance) => (
          <Chip key={insurance} label={insurance} color="secondary" variant="outlined" sx={{ minWidth: 140 }} />
        ))}
      </Stack>
    </Container>
  </Box>
);

export default InsuranceList;
