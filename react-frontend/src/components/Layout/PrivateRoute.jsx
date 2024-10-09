import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuth();

  return isLoggedIn ? children : <Navigate to="/" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};
export default PrivateRoute;
