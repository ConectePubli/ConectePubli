import React from "react";
import logo from "@/assets/logo.svg";
import { t } from "i18next";
import { Link } from "@tanstack/react-router";

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 border-t bg-white">
      <div className="justify-center flex">
        <div className="items-center gap-8 hidden lg:flex">
          <a
            href="#how-it-works"
            className="text-sm font-semibold underline underline-offset-4 decoration-orange-600 decoration-2"
          >
            {t("Como Funciona")}
          </a>
          <a
            href="#top-creators"
            className="text-sm font-semibold underline underline-offset-4 decoration-orange-600 decoration-2"
          >
            {t("Top Creators")}
          </a>
          <a
            href="#benefits"
            className="text-sm font-semibold underline underline-offset-4 decoration-orange-600 decoration-2"
          >
            {t("Benefícios")}
          </a>
        </div>
      </div>
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
          <Link to="/termos" className="text-sm font-semibold hover:underline">
            {t("Termos de Uso")}
          </Link>
          <span className="mx-2">|</span>
          <Link
            to="/privacidade"
            className="text-sm font-semibold hover:underline"
          >
            {t("Política de Privacidade")}
          </Link>
        </div>
      </div>
    </footer>
  );
};
