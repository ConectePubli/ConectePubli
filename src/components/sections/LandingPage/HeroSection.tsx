import React from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import Translator from "@/components/i18n/Translator";
import { useTranslation } from "react-i18next";
import MuxPlayer from "@mux/mux-player-react";

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-16 flex flex-col xl:flex-row gap-12 items-center justify-center mx-auto max-w-screen-xl px-4  xl:text-left">
      {/* Texto e Botões */}
      <div className="flex-1 space-y-6 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <h1 className="text-4xl font-bold leading-tight">
          {t("Conexão digital direta entre")}{" "}
          <span className="text-[#FE622A]">{t("Marcas")}</span>{" "}
          <span>{t("e")}</span>{" "}
          <span className="text-[#354280]">{t("Creators")}</span>
        </h1>
        <p className="text-lg text-gray-700">
          <Translator path="Somos uma plataforma inovadora que conecta diretamente marcas e criadores de conteúdo digital. Com alta tecnologia, simplificamos todo o processo para ambos os lados, proporcionando parcerias mais eficientes e resultados reais. Somos a revolução no marketing de influência e conteúdo!" />
        </p>

        <div className="flex gap-4 justify-start">
          <Button
            variant="orange"
            onClick={() => navigate({ to: "/cadastro/marca" })}
            className="font-bold"
          >
            <Translator path="Sou Marca" />
          </Button>
          <Button
            variant="blue"
            onClick={() => navigate({ to: "/cadastro/creator" })}
            className="font-bold"
          >
            <Translator path="Sou Creator" />
          </Button>
        </div>
      </div>

      {/* Vídeo */}
      <div className="flex justify-center items-center flex-1 ">
        <div className="overflow-hidden rounded-xl max-h-[550px] w-auto aspect-[9/16] max-w-full">
          <MuxPlayer
            streamType="on-demand"
            playbackId={"601k1sRDgYoKjH9DiQSEghCFmnDggI6iymfZuKSSkUp8"}
            metadataVideoTitle="Introdução"
            autoPlay={true}
            muted={true}
            loop={true}
          />
        </div>
      </div>
    </section>
  );
};
