import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import { useAuth } from "./hooks/useAuth";
import { dashboardRoutes } from "./lib/roles";

const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const NotFoundPage = lazy(() => import("./pages/common/NotFoundPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));

const RootRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user ? dashboardRoutes[user.role] : "/login"} replace />;
};

const App = () => (
  <Suspense fallback={<div className="grid min-h-screen place-items-center text-ink">Loading...</div>}>
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/admin/users"
          element={
            <RoleRoute roles={["admin"]}>
              <UsersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <RoleRoute roles={["manager", "admin"]}>
              <ReportsPage />
            </RoleRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default App;
