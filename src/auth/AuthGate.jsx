import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthGate({ children }) {
  const auth = useAuth();
  const location = useLocation();
  const loginRequired = !!(globalThis.CONFIG?.loginRequired);

  if (auth.isLoading) return null;

  const isLogged = auth.isAuthenticated && !auth.user?.expired;
  const path = location.pathname;

  const isPublic = path === "/login";

  if (!loginRequired) {
    return children;
  }

  if (!isLogged && !isPublic) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (isLogged && path === "/login") {
    const to = location.state?.from?.pathname || sessionStorage.getItem("returnTo") || "/";
    return <Navigate to={to} replace />;
  }
  return children;
}