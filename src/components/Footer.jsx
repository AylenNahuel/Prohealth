import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => (
  <Box component="footer" sx={{ py: 4, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
    <Container maxWidth="lg">
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
        <Typography variant="body2">© {new Date().getFullYear()} ProHealth. Todos los derechos reservados.</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="Facebook" color="inherit" href="https://facebook.com" target="_blank" rel="noopener">
            <FacebookIcon />
          </IconButton>
          <IconButton aria-label="Instagram" color="inherit" href="https://instagram.com" target="_blank" rel="noopener">
            <InstagramIcon />
          </IconButton>
          <IconButton aria-label="LinkedIn" color="inherit" href="https://linkedin.com" target="_blank" rel="noopener">
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
