import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const isLoggedIn = useAuth();

  return !isLoggedIn ? children : <Navigate to="/dashboard" />;
};

PublicRoute.propTypes = {
  children: PropTypes.node,
};

export default PublicRoute;
