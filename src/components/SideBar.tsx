import { useState } from "react";
import { Home, Table, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, link: "#" },
    { name: "Tables", icon: <Table size={20} />, link: "#" },
    { name: "Billing", icon: <CreditCard size={20} />, link: "#" },
  ];

  return (
    <aside className="fixed flex h-screen w-64 flex-col justify-between bg-white p-4 shadow-lg">
      {/* 상단 로고 및 제목 */}
      <div>
        <h1 className="text-center text-lg font-bold text-gray-700">Exclusuive Dashboard</h1>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex w-full cursor-pointer items-center rounded-lg px-4 py-3 text-left ${
                active === item.name ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 도움말 섹션 */}
      <div className="rounded-lg bg-blue-100 p-4">
        <div className="flex items-center">
          <HelpCircle size={24} className="text-blue-500" />
          <p className="ml-3 text-sm text-gray-700">Need Help?</p>
        </div>
        <p className="mt-1 text-xs text-gray-500">Please check our docs</p>
        <Button className="mt-3 w-full bg-blue-500 text-white">DOCUMENTATION</Button>
      </div>
    </aside>
  );
};

export default Sidebar;
