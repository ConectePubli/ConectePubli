import { AlignJustify, Bell } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useSheetStore } from "@/store/useDashSheetStore";
import { UserMenu } from "./UserMenu";

export const PrivateHeader = () => {
  const { openSheet } = useSheetStore();

  return (
    <header className="bg-white h-[65px] flex items-center border-b-[1px]">
      <div className="p-2 md:p-4 md:hidden flex items-center justify-start">
        <button className="focus:outline-none p-2" onClick={openSheet}>
          <AlignJustify size={25} />
        </button>
      </div>

      <div className="flex items-center justify-end px-2 md:px-4 w-full">
        {/* Logo (aparece após 340px de width)*/}
        <div className="hidden min-[340px]:block flex-grow">
          <img src={logo} alt="ConectePubli" className="h-8 md:h-10" />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Bell className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-600 transition duration-200" />
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border flex items-center justify-center bg-gray-300">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
