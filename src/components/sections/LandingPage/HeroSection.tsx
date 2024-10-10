import React from "react";

import { Button } from "@/components/ui/button";

import heroImage from "@/assets/hero-image.svg";

export const HeroSection: React.FC = () => {
  return (
    <section className="py-16 flex flex-col md:flex-row items-center justify-between bg-white">
      <div className="flex-1 space-y-4">
        <h1 className="text-4xl font-bold">
          Conexão digital entre marcas e influenciadores
        </h1>
        <p className="text-lg text-gray-700">
          ConectePubli é a plataforma ideal para conectar marcas e
          influenciadores em parcerias estratégicas, impulsionando campanhas
          digitais e gerando resultados reais de forma simples e eficiente.
        </p>
        <div className="flex gap-4">
          <Button
            variant="orange"
            onClick={() => console.log("Acessar Minha Conta clicado")}
          >
            Acessar Minha Conta
          </Button>
          <Button
            variant="blue"
            onClick={() => console.log("Cadastrar-se e Comece clicado")}
          >
            Cadastrar-se e Comece
          </Button>
        </div>
      </div>

      <div className="flex justify-end flex-1 mt-8 md:mt-0 md:ml-0">
        <img
          src={heroImage}
          alt="Pessoa gravando um podcast"
          className="rounded-lg shadow-lg max-w-full"
        />
      </div>
    </section>
  );
};
