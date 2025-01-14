import React from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import connect2 from "@/assets/connect2.jpeg";
import Translator from "@/components/i18n/Translator";

export const ConnectSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 w-full mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xlpx-4">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <img
          src={connect2}
          alt="Influencer 2"
          className="rounded-lg shadow-lg w-[300px] xl:w-[700px] xl:h-[400px] hidden lg:block object-cover"
        />

        <div className="px-4">
          <h2 className="text-4xl font-bold mb-4">
            <Translator path="Conecte-se" />
          </h2>
          <p className="text-gray-700 mb-4">
            <Translator path="Nossa plataforma está oficialmente disponível para você ampliar seu alcance e maximizar seu impacto digital. Cadastre-se agora e aproveite todos os benefícios que oferecemos, incluindo ferramentas avançadas de análise e suporte dedicado, tudo isso sem taxa de adesão!" />
          </p>
          <div className="flex flex-row gap-4 justify-start">
            <Button
              variant="purple"
              onClick={() => navigate({ to: "/cadastro/marca" })}
              className="font-bold w-fit"
            >
              <Translator path="Sou Marca" />
            </Button>
            <Button
              variant="orange"
              onClick={() => navigate({ to: "/cadastro/creator" })}
              className="font-bold w-fit"
            >
              <Translator path="Sou Creator" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
