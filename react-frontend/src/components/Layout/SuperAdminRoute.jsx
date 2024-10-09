import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const SuperAdminRoute = ({ children }) => {
  const isLoggedIn = useAuth();

  return isLoggedIn === 'super_admin' ? children : <Navigate to="/" />;
};

SuperAdminRoute.propTypes = {
  children: PropTypes.node,
};
export default SuperAdminRoute;
