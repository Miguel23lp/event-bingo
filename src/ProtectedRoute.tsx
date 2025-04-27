import { Navigate, useLocation } from "react-router";
import { User } from "./App.tsx";

interface ProtectedRouteProps {
    user: User | null;
    role: 'user' | 'admin' | null;
    children: React.ReactNode;
}

function ProtectedRoute({ user, role, children }: ProtectedRouteProps) {
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (role && user.role !== role) {
        return <p>Sem permissão para aceder a esta página.</p>;
    }
    return <>{children}</>;
}

export default ProtectedRoute;
