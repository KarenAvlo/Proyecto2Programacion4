import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function PrivateRoute({ requiredRole }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.tipo !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}