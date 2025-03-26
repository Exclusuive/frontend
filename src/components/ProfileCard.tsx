import { ProfileCardProps } from "@/types/types";
import { FiBox, FiUsers, FiTool } from "react-icons/fi";
import { useState } from "react";

const ProfileCard = ({ viewItem, setViewItem }: ProfileCardProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  const menuItems = [
    { name: "All", icon: <FiBox size={20} />, link: "#" },
    { name: "View", icon: <FiUsers size={20} />, link: "#" },
    { name: "Manage", icon: <FiTool size={20} />, link: "#" },
  ];

  if (!isLoggedIn) {
    return (
      <div className="mx-auto -mt-16 flex h-[120px] w-4/5 items-center rounded-lg border-[1.5px] border-white bg-white/80 p-5 shadow-md backdrop-blur-lg">
        <button
          onClick={() => setIsLoggedIn(true)}
          className="mx-auto cursor-pointer rounded-lg bg-blue-500 px-6 py-3 text-white shadow-md transition hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto h-[120px] w-4/5 flex flex-col items-center justify-center p-5">
      <img src="/pamchu.png" alt="profile" className="h-30 w-auto rounded-full" />
      <div className="px-4 text-center">
        <h2 className="text-lg font-semibold">PAMI</h2>
        <p className="text-gray-500">dokpami@gmail.com</p>
      </div>

    </div>
  );
};

export default ProfileCard;
