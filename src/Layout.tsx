import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div className="h-screen w-screen">
      <Sidebar></Sidebar>
      <div className="pl-64">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
