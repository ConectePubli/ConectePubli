import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import logo from "@/assets/logo.svg";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import Flag from "../i18n/Flag";
import BrasilFlag from "@/assets/icons/br-flag.png";
import EuaFlag from "@/assets/icons/us-flag.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { AlignJustifyIcon } from "lucide-react";

export const PublicHeader = () => {
  const navigate = useNavigate();

  //Configurações de idioma
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language;

  interface HandleChangeLanguage {
    (language: string): void;
  }

  const handleChangeLanguage: HandleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 bg-white border-b-[1px] z-50">
      <div
        className="flex justify-between items-center mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl
+                  px-6 py-2"
      >
        <div className="flex items-center gap-4">
          <div className="flex lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AlignJustifyIcon className="h-6 w-6 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-8">
                <DropdownMenuItem asChild>
                  <a href="#how-it-works" className="flex items-center w-full">
                    {t("Como Funciona")}
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a href="#top-creators" className="flex items-center w-full">
                    {t("Top Creators")}
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a href="#benefits" className="flex items-center w-full">
                    {t("Benefícios")}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link to="/">
            <img src={logo} alt="ConectePubli" className="h-10 max-sm:h-8" />
          </Link>
        </div>

        <div className="items-center gap-4 hidden lg:flex">
          <a
            href="#how-it-works"
            className="text-sm font-semibold hover:underline"
          >
            {t("Como Funciona")}
          </a>
          <a
            href="#top-creators"
            className="text-sm font-semibold hover:underline"
          >
            {t("Top Creators")}
          </a>
          <a href="#benefits" className="text-sm font-semibold hover:underline">
            {t("Benefícios")}
          </a>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="ghost"
            className="font-semibold text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2"
            size="default"
            onClick={() => navigate({ to: "/login" })}
          >
            {t("Entrar")}
          </Button>
          <Button
            variant="orange"
            size="default"
            className="text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2"
            onClick={() => navigate({ to: "/cadastro" })}
          >
            {t("Cadastrar")}
          </Button>
          <Button
            variant="ghost"
            className="text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2"
          >
            <div className={`flex w-7 h-7 items-center`}>
              <div
                className={`${selectedLanguage === "pt-BR" ? "hidden" : ""}`}
              >
                <Flag
                  image={BrasilFlag}
                  isSelected={selectedLanguage === "en-US"}
                  onClick={() => handleChangeLanguage("pt-BR")}
                />
              </div>
              <div
                className={`${selectedLanguage === "en-US" ? "hidden" : ""}`}
              >
                <Flag
                  image={EuaFlag}
                  isSelected={selectedLanguage === "pt-BR"}
                  onClick={() => handleChangeLanguage("en-US")}
                />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
};
