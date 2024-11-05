import React from "react";
import logo from "@/assets/logo.svg";

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 border-t bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center">
          <img
            src={logo}
            alt="ConectePubli Logo"
            className="h-8 md:h-10 cursor-pointer"
            onClick={() => window.location.replace("/")}
            draggable={false}
          />
        </div>

        <div className="mt-4 md:mt-0 text-center md:text-right text-gray-600">
          <p>Copyright © ConectePubli | Todos direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
