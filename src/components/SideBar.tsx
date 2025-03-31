import { useState } from "react";
import { Home, Image, Layers, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useWallets,
  useDisconnectWallet,
  useCurrentAccount,
  useConnectWallet,
} from "@mysten/dapp-kit";

const Sidebar = () => {
  const account = useCurrentAccount();
  const wallets = useWallets();

  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: connect } = useConnectWallet();

  const [active, setActive] = useState("Manage Collection");

  const menuItems = [
    // { name: "Dashboard", icon: <Home size={20} />, link: "#" },
    { name: "Manage Collection", icon: <Layers size={20} />, link: "#" },
    { name: "View NFTs", icon: <Image size={20} />, link: "#" },
  ];

  return (
    <aside className="bg-skyblue fixed z-1 flex h-screen w-64 flex-col justify-between bg-white p-4 shadow-lg">
      {/* 상단 로고 및 제목 */}
      <div>
        <h1 className="text-center text-lg font-bold text-gray-700">Exclusuive Dashboard</h1>
        <img src="/basic.png" alt="profile" className="mx-auto my-4 h-32 w-32" />
        {account ? (
          <div>
            <p className="my-5 text-center text-lg font-bold">{account.label}</p>
            <Button
              className="w-full bg-black text-white hover:bg-white hover:text-black"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="my-10">
            <Button
              className="w-full bg-white text-black hover:text-white"
              onClick={() =>
                connect(
                  { wallet: wallets[0] },
                  {
                    onSuccess: () => console.log("connected"),
                  }
                )
              }
            >
              Connect wallet
            </Button>
          </div>
        )}

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex w-full cursor-pointer items-center rounded-lg px-4 py-3 text-left ${
                active === item.name ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 도움말 섹션 */}
      <div className="bg-darkskyblue rounded-lg p-4">
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
