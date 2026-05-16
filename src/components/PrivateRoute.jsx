import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../store/authStore';

const PrivateRoute = () => {
    const { token } = authStore();

    // Nếu không có token, đá về trang login
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;