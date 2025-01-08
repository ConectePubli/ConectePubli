import { useTranslation } from "react-i18next";
// useTranslation é um hook
// que devolve uma função de tradução (t) e a instância do i18n

import BrasilFlag from "../../assets/brasil-flag.svg";
import EuaFlag from "../../assets/eua-flag.svg";
import Flag from "./Flag";

const I18n = () => {
  const { i18n } = useTranslation();
  // Instância do i18n

  interface HandleChangeLanguage {
    (language: string): void;
  }

  const handleChangeLanguage: HandleChangeLanguage = (language) => {
    // Trocando o idioma na chamada da função
    i18n.changeLanguage(language);
  };

  const selectedLanguage = i18n.language; // Idioma selecionado
  return (
    <div className="flex gap-2 w-11 h-11">
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
