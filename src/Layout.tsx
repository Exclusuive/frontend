import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <Sidebar />
      <Header></Header>
      <div className="flex h-full flex-col pt-16 pl-64">
        <Outlet />
      </div>
    </div>
  );
}
