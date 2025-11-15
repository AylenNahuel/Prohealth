import { useMemo } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Button, Card, CardContent, Container, Grid, Skeleton, Typography } from '@mui/material';
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
    segment: 'Plan premium',
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
    description: 'Planes jovenes y familiares con red propia.',
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
    description: brand?.description || 'Cobertura integral y amplia cartilla.',
    segment: brand?.segment || 'Cobertura integral',
    logo: LOGO_MAP[slug] || null,
  };
};

const CARD_HEIGHT = 340;

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
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" fontWeight={700} textAlign="center" gutterBottom>
          Obras Sociales
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 560, mx: 'auto', mb: 4 }}
        >
          Trabajo con las principales obras sociales y prepagas para que puedas acceder a tu consulta sin
          complicaciones.
        </Typography>

        {error && (
          <Typography variant="body2" color="error" textAlign="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading && !hasData && (
          <Grid container spacing={3} alignItems="stretch">
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    height: CARD_HEIGHT,
                    borderRadius: 4,
                    boxShadow: 3,
                  }}
                >
                  <CardContent />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !hasData && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Aun no hay obras sociales cargadas.
          </Typography>
        )}

        {hasData && (
          <Grid container spacing={3} alignItems="stretch">
            {cards.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                <Card
                  elevation={3}
                  sx={{
                    height: CARD_HEIGHT,
                    borderRadius: 4,
                    boxShadow: 3,
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
                      py: 4,
                    }}
                  >
                    <Box
                      sx={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        bgcolor: theme.palette.background.paper,
                        boxShadow: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                        overflow: 'hidden',
                      }}
                    >
                      {item.brand.logo ? (
                        <Box
                          component="img"
                          src={item.brand.logo}
                          alt={`Logo ${item.nombre}`}
                          sx={{
                            width: '80%',
                            height: '80%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: accentColor }}
                        >
                          {item.nombre.slice(0, 2).toUpperCase()}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {item.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.brand.description}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2.5,
                          py: 0.75,
                          borderRadius: 999,
                          bgcolor: alpha(accentColor, 0.1),
                          color: accentColor,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {item.brand.segment}
                      </Box>
                    </Box>
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
