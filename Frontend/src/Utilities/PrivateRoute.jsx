import { Navigate, Outlet, useLocation as useRouterLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Guards routes that require the user to be logged in.
 * Redirects to /login and remembers where they were headed.
 */
const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const routerLocation = useRouterLocation();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-chili-light border-t-chili" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: routerLocation }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
