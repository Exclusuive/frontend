import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar";

export default function Layout() {
  return (
    <div className="h-screen w-screen">
      <Sidebar></Sidebar>
      <div className="pl-64">
        <Outlet />
      </div>
    </div>
  );
}
