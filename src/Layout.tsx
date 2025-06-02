import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSideBar";
import { Outlet } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
export default function Layout() {
  const account = useCurrentAccount();
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex-grow overflow-hidden">
        {account ? (
          <Outlet />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="my-4 text-2xl font-bold">Please connect your wallet to use Exclusuive</p>
            <ConnectButton />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
