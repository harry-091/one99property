import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRoute = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;

