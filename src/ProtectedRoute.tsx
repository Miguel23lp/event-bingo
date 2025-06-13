import { Navigate, useLocation } from "react-router";
import { User } from "./App.tsx";

interface ProtectedRouteProps {
    user: User | null;
    onlyAdmin?: boolean;
    onlyUser?: boolean;
    children: React.ReactNode;
}

function ProtectedRoute({ user, onlyAdmin: onlyAdmin, onlyUser: onlyUser, children }: ProtectedRouteProps) {
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (onlyAdmin && user.role !== "admin") {
        return <p>Sem permissão para aceder a esta página.</p>;
    }
    if (onlyUser && user.role !== "user") {
        return <p>Sem permissão para aceder a esta página.</p>;
    }
    return <>{children}</>;
}

export default ProtectedRoute;
