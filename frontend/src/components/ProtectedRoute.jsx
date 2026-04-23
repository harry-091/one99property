import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-ink">Loading dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

