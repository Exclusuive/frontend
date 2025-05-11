import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex-grow overflow-hidden">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
