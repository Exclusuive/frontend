import { FiSearch, FiSettings, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="fixed justify-between top-0 left-0 w-full h-[11%] bg-white flex items-center border-b-[1px] border-gray-300 z-50">
      <div className="ml-10">
        <Link to="/" className="w-full text-lg font-bold text-gray-700">
          <p className="mx-auto text-center">Exclusive</p>
        </Link>
      </div>
      <div className="flex items-center mr-8 space-x-6 font-semibold text-[#595959] text-xl">
        <FiSearch className="cursor-pointer" />
        <FiSettings className="cursor-pointer" />
        <FiBell className="cursor-pointer" />
      </div>

      </div>
  );
}
