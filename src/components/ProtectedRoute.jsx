import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ redirectTo }) => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  redirectTo: '/login',
};

export default ProtectedRoute;
