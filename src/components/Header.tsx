import { Settings, Bell } from "lucide-react";

export default function Header() {
  return (
    <div className="fixed h-16 w-full border-b border-[#A2A2A2] pl-64">
      <div className="flex h-full items-center justify-between space-x-4 px-4 font-semibold text-black">
        <div></div>
        <div className="flex items-center space-x-5">
          <Settings size={20} className="cursor-pointer" />
          <Bell size={20} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
