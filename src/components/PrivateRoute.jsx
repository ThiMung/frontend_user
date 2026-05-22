import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../store/authStore';

const PrivateRoute = () => {
  const token = authStore((state) => state.token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;