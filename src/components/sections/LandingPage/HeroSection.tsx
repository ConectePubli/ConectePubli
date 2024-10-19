import React from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import heroImage from "@/assets/hero-image.svg";

//import adImage from "@/assets/ad_example.jpg";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

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
          {/* <Button variant="orange" onClick={() => navigate({ to: "/login123new" })}>
            Acessar Minha Conta
          </Button> */}
          <Button variant="blue" onClick={() => navigate({ to: "/cadastro" })}>
            Faça seu Pré Cadastro
          </Button>
        </div>

        {/* <div className="relative mt-8 border border-gray-300 rounded-lg overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-gray-500 text-white text-xs px-2 py-1">
            Publicidade
          </div>
          <a
            href="https://www.exemplo-anunciante.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={adImage}
              alt="Publicidade de exemplo"
              className="w-full h-20 object-cover object-center"
            />
          </a>
        </div> */}
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
