import { useAuthStore } from "@/stores/useAuthStore";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Navigate } from "react-router-dom";

export default function UserProtectedRouter({ children }: { children: React.ReactNode }) {
  const account = useCurrentAccount();
  const { user } = useAuthStore();

  if (!account || user?.address !== account.address || user?.role !== "member") {
    return <Navigate to="/" />;
  }

  return children;
}
