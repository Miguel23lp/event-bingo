import { Navigate, useLocation } from "react-router";
import { User } from "./App.tsx";

interface ProtectedRouteProps {
    user: User | null;
    admin?: boolean;
    children: React.ReactNode;
}

function ProtectedRoute({ user, admin, children }: ProtectedRouteProps) {
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (admin && user.role !== "admin") {
        return <p>Sem permissão para aceder a esta página.</p>;
    }
    return <>{children}</>;
}

export default ProtectedRoute;
