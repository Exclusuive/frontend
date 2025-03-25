import { FiSearch, FiUser, FiSettings, FiBell } from "react-icons/fi";

export default function Header() {
  return (
    <div className="absolute w-full h-[11%] bg-white flex items-center border-b border-black">
      <div className="flex space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Type"
            className="w-64 rounded-lg bg-white px-4 py-2 pl-10 text-gray-400 shadow-md focus:outline-none"
          />
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-black" />
        </div>

        {/* Icons and Sign In */}
        <div className="flex items-center space-x-4 font-semibold text-[#595959]">
          <FiSettings className="cursor-pointer" />
          <FiBell className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
