import { ProfileCardProps } from "@/types/types";
import { FiBox, FiUsers, FiTool } from "react-icons/fi";

const ProfileCard = ({ viewItem, setViewItem }: ProfileCardProps) => {
  const menuItems = [
    { name: "All", icon: <FiBox size={20} />, link: "#" },
    { name: "View", icon: <FiUsers size={20} />, link: "#" },
    { name: "Manage", icon: <FiTool size={20} />, link: "#" },
  ];

  return (
    <div className="mx-auto -mt-16 flex w-4/5 items-center rounded-lg border-[1.5px] border-white bg-white/80 p-5 shadow-md backdrop-blur-lg">
      <img src="/pamchu.png" alt="profile" className="h-16 w-16 rounded-full" />
      <div className="px-4">
        <h2 className="text-lg font-semibold">Esthera Jackson</h2>
        <p className="text-gray-500">esthera@simmmple.com</p>
      </div>

      <div className="flex flex-1 justify-end space-x-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setViewItem(item.name)}
            className={`flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2 transition-all ${viewItem === item.name ? "bg-white text-black shadow-sm" : "text-gray-600"}`}
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
