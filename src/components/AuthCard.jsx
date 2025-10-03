import PropTypes from 'prop-types';
import { Paper, Stack, Typography } from '@mui/material';

const AuthCard = ({ title, subtitle, children }) => (
  <Paper
    elevation={8}
    sx={{
      width: '100%',
      maxWidth: 420,
      p: { xs: 4, sm: 6 },
      borderRadius: 3,
      boxShadow: '0px 18px 40px rgba(13, 110, 253, 0.12)',
    }}
  >
    <Stack spacing={4}>
      {(title || subtitle) && (
        <Stack spacing={1} textAlign="center">
          {title && (
            <Typography variant="h4" component="h1" fontWeight={700}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      )}
      {children}
    </Stack>
  </Paper>
);

AuthCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

AuthCard.defaultProps = {
  title: '',
  subtitle: '',
};

export default AuthCard;
