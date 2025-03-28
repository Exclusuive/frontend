import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div className="h-screen w-screen">
      <Sidebar />
      <Header></Header>
      <div className="pt-16 pl-64">
        <Outlet />
      </div>
    </div>
  );
}
