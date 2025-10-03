import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ redirectTo }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('auth') === 'true';

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
