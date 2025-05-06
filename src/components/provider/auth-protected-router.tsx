import { paths } from "@/config/paths";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRouter({ children }: { children: React.ReactNode }) {
  const { veginUserIsLogin } = useAuthStore();

  if (veginUserIsLogin) {
    return <Navigate to={paths.home.path} replace />;
  }

  return children;
}
