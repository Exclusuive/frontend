import { paths } from "@/config/paths";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";

export default function ServiceProtectedRouter({ children }: { children: React.ReactNode }) {
  const { veginUserIsLogin } = useAuthStore();

  const location = useLocation();

  if (!veginUserIsLogin) {
    return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />;
  }

  return children;
}
