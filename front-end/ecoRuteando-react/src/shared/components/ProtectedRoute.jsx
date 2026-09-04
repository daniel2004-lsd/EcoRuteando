import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, userRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
