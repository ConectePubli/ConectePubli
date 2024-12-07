import React from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import heroImage from "@/assets/hero-image.webp";

//import adImage from "@/assets/ad_example.jpg";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 flex flex-col md:flex-row gap-8 items-center justify-between mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
      <div className="flex-1 space-y-4">
        <h1 className="text-4xl font-bold">
          Conexão digital direta entre marcas e creators
        </h1>
        <p className="text-lg text-gray-700">
          Somos uma plataforma inovadora que conecta diretamente marcas e
          criadores de conteúdo digital. Com alta tecnologia, simplificamos todo
          o processo para ambos os lados, proporcionando parcerias mais
          eficientes e resultados reais. Somos a revolução no marketing de
          influência e conteúdo!
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

      <div className="flex justify-end flex-1 mt-8 md:mt-0 md:ml-0 md:hidden xl:flex">
        <img
          src={heroImage}
          alt="Pessoa gravando um podcast"
          className="rounded-lg shadow-lg max-w-full w-full"
        />
      </div>
    </section>
  );
};
