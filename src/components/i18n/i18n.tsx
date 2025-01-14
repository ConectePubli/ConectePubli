import { useTranslation } from "react-i18next";
// useTranslation é um hook
// que devolve uma função de tradução (t) e a instância do i18nc
import BrasilFlag from "@/assets/icons/br-flag.png";
import EuaFlag from "@/assets/icons/us-flag.png";
import Flag from "./Flag";

interface I18nProps {
  header?: boolean;
}

const I18n = ({ header = false }: I18nProps) => {
  const { i18n } = useTranslation();
  // Instância do i18n

  interface HandleChangeLanguage {
    (language: string): void;
  }

  const handleChangeLanguage: HandleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    window.location.reload();
  };

  const selectedLanguage = i18n.language; // Idioma selecionado
  return (
    <div
      className={`flex gap-2  ${header ? "w-10 h-10" : "w-7 h-7 items-center"}`}
    >
      <Flag
        image={BrasilFlag}
        isSelected={selectedLanguage === "pt-BR"} // Verifica o idioma escolhido
        onClick={() => handleChangeLanguage("pt-BR")} // Troca o idioma para pt-BR
      />
      <Flag
        image={EuaFlag}
        isSelected={selectedLanguage === "en-US"} // Verifica o idioma escolhido
        onClick={() => handleChangeLanguage("en-US")} // Troca o idioma para en-US
      />
    </div>
  );
};

export default I18n;
