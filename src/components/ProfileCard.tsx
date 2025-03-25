import { ProfileCardProps } from "@/types/types";
import { FiBox, FiUsers, FiTool } from "react-icons/fi";
import { useWallets, useCurrentAccount, useConnectWallet } from "@mysten/dapp-kit";

const ProfileCard = ({ viewItem, setViewItem }: ProfileCardProps) => {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();

  const menuItems = [
    { name: "All", icon: <FiBox size={20} />, link: "#" },
    { name: "View", icon: <FiUsers size={20} />, link: "#" },
    { name: "Manage", icon: <FiTool size={20} />, link: "#" },
  ];

  if (!account) {
    return (
      <div className="mx-auto -mt-16 flex h-[120px] w-4/5 items-center rounded-lg border-[1.5px] border-white bg-white/80 p-5 shadow-md backdrop-blur-lg">
        {wallets.map((wallet) => (
          <button
            onClick={() => {
              connect(
                { wallet },
                {
                  onSuccess: () => console.log("connected"),
                }
              );
            }}
            className="mx-auto cursor-pointer rounded-lg bg-blue-500 px-6 py-3 text-white shadow-md transition hover:bg-blue-600"
          >
            Connect to {wallet.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-16 flex h-[120px] w-4/5 items-center rounded-lg border-[1.5px] border-white bg-white/80 p-5 shadow-md backdrop-blur-lg">
      <img src="/pamchu.png" alt="profile" className="h-16 w-16 rounded-full" />
      <div className="px-4">
        <h2 className="text-lg font-semibold">DOKPAMI</h2>
        <p className="text-gray-500">{account.address}</p>
      </div>

      <div className="flex flex-1 justify-end space-x-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setViewItem(item.name)}
            className={`flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2 transition-all ${
              viewItem === item.name ? "bg-white text-black shadow-sm" : "text-gray-600"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
