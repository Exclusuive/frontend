import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthProtectedRouter({ children }: { children: React.ReactNode }) {
  const { veginUserIsLogin } = useAuthStore();
  const location = useLocation();

  if (veginUserIsLogin) {
    return <Navigate to={location.pathname} replace />;
  }

  return children;
}
