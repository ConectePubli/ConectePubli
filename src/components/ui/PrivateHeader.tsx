import { AlignJustify, Bell, User } from "lucide-react";
import logo from "@/assets/logo.svg";

export const PrivateHeader = () => {
  return (
    <header className="bg-white h-[65px] flex items-center">
      <div className="w-64 p-4 flex items-center justify-start">
        <button className="focus:outline-none p-2">
          <AlignJustify size={25} />
        </button>
      </div>

      <div className="flex-1 flex justify-between items-center px-4">
        <div>
          <img src={logo} alt="ConectePubli" className="h-10" />
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6 cursor-pointer hover:text-gray-600 transition duration-200" />
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center bg-gray-300">
            <User size={20} color="#fff" />
          </div>
        </div>
      </div>
    </header>
  );
};
