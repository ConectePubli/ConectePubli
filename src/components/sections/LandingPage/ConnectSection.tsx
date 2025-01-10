import React from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import connect1 from "@/assets/connect1.webp";
import connect2 from "@/assets/connect2.jpeg";
import Translator from "@/components/i18n/Translator";

export const ConnectSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 w-full mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <img
          src={connect1}
          alt="Influencer 1"
          className="rounded-lg shadow-lg w-[300px] xl:w-[400px] hidden lg:block h-auto object-cover"
        />
        <img
          src={connect2}
          alt="Influencer 2"
          className="rounded-lg shadow-lg w-[300px] xl:w-[400px] hidden lg:block h-auto object-cover"
        />

        <div className="w-full">
          <h2 className="text-3xl font-bold mb-4">
            <Translator path="Conecte-se" />
          </h2>
          <p className="text-gray-700 mb-4">
            <Translator path="Nossa plataforma está oficialmente disponível para você ampliar seu alcance e maximizar seu impacto digital. Cadastre-se agora e aproveite todos os benefícios, sem taxa de adesão!" />
          </p>
          <div className="flex flex-col lg:flex-row gap-4 justify-center lg:justify-start">
            <Button
              variant="orange"
              size="lg"
              onClick={() => navigate({ to: "/login" })}
            >
              <Translator path="Fazer Login" />
            </Button>
            <Button
              variant="blue"
              className="w-fit"
              size="lg"
              onClick={() => navigate({ to: "/cadastro" })}
            >
              <Translator path="Fazer Cadastro" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
