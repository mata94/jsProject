import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
  const auth = getAuth();
  const isAuthenticated = auth.currentUser != null;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
