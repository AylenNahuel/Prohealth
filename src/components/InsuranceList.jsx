import { useMemo } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import useInsurances from '../hooks/useInsurances';
import osdeLogo from '../assets/osde.png';
import iomaLogo from '../assets/ioma.png';
import galenoLogo from '../assets/galeno.jpg';
import medifeLogo from '../assets/medife.jpeg';
import omintLogo from '../assets/omint.png';
import swissLogo from '../assets/swiss medical.png';

const LOGO_MAP = {
  osde: osdeLogo,
  ioma: iomaLogo,
  galeno: galenoLogo,
  medife: medifeLogo,
  omint: omintLogo,
  swiss: swissLogo,
};

const BRAND_DETAILS = {
  osde: {
    description: 'Cobertura nacional y cartilla integral para empresas.',
    segment: 'Plan Premium',
  },
  ioma: {
    description: 'Obra social provincial con amplia red en Buenos Aires.',
    segment: 'Provincia BA',
  },
  galeno: {
    description: 'Planes corporativos y medicina prepaga personalizada.',
    segment: 'Prepaga',
  },
  medife: {
    description: 'Planes jóvenes y familiares con red propia.',
    segment: 'Familias',
  },
  omint: {
    description: 'Cobertura internacional y cartilla premium.',
    segment: 'Internacional',
  },
  swiss: {
    description: 'Planes corporativos y medicina privada de alta complejidad.',
    segment: 'Corporativo',
  },
};

const getBrandMeta = (insurance) => {
  const slug = insurance.id?.toLowerCase?.() || '';
  const brand = BRAND_DETAILS[slug];
  return {
    description: brand?.description || 'Atención integral y amplia cartilla.',
    segment: brand?.segment || 'Cobertura integral',
    logo: LOGO_MAP[slug] || null,
  };
};

const CARD_MIN_HEIGHT = 320;

const InsuranceList = () => {
  const { insurances, loading, error } = useInsurances();
  const hasData = insurances.length > 0;
  const theme = useTheme();
  const accentColor = theme.palette.primary.main;

  const cards = useMemo(
    () =>
      insurances.map((insurance) => {
        const brand = getBrandMeta(insurance);
        return { ...insurance, brand };
      }),
    [insurances]
  );

  return (
    <Box
      component="section"
      id="obras-sociales"
      sx={{
        py: { xs: 8, md: 10 },
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${theme.palette.background.default} 60%)`,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" fontWeight={700} textAlign="center" gutterBottom>
          Obras Sociales
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 560, mx: 'auto', mb: 4 }}>
          Trabajo con las principales obras sociales y prepagas para que puedas acceder a tu consulta sin complicaciones.
        </Typography>
        {error && (
          <Typography variant="body2" color="error" textAlign="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {loading && !hasData && (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        )}
        {!loading && !hasData && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Aún no hay obras sociales cargadas.
          </Typography>
        )}
        {hasData && (
          <Grid container spacing={3} alignItems="stretch">
            {cards.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    minHeight: CARD_MIN_HEIGHT,
                    width: '100%',
                    height: '100%',
                    border: `1px solid ${alpha(accentColor, 0.15)}`,
                    backgroundColor: alpha(accentColor, 0.02),
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${alpha(accentColor, 0.12)}`,
                        overflow: 'hidden',
                      }}
                    >
                      {item.brand.logo ? (
                        <Box
                          component="img"
                          src={item.brand.logo}
                          alt={`Logo de ${item.nombre}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '160px',
                            objectFit: 'contain',
                            filter: 'grayscale(10%) contrast(1.05)',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            bgcolor: alpha(accentColor, 0.1),
                            color: accentColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '1.3rem',
                          }}
                        >
                          {item.nombre.slice(0, 2).toUpperCase()}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ minHeight: 92, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ minHeight: 28 }}>
                        {item.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 44 }}>
                        {item.brand.description}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      justifyContent="center"
                      sx={{ width: '100%', mt: 'auto' }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 999,
                          bgcolor: alpha(accentColor, 0.1),
                          color: accentColor,
                          fontWeight: 600,
                        }}
                      >
                        {item.brand.segment}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 999,
                          bgcolor: alpha(theme.palette.text.secondary, 0.08),
                          color: theme.palette.text.secondary,
                          fontWeight: 600,
                        }}
                      >
                        Atención presencial
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {hasData && (
          <Box textAlign="center" sx={{ mt: 5 }}>
            <Button href="/appointments" variant="contained" color="primary" size="large">
              Reservar turno con mi cobertura
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default InsuranceList;
