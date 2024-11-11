import React from "react";
import image1 from "@/assets/how-it-works1.svg";
import image2 from "@/assets/how-it-works2.svg";
import image3 from "@/assets/how-it-works3.svg";

import { FeatureCard } from "@/components/LandingPage/FeaturesCard/FeaturesCard";

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-8 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
      <h2 className="text-3xl font-bold text-left mb-8">Como funciona</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        <FeatureCard
          imageSrc={image1}
          title="Conexão estratégica simplificada"
          description="Nossa plataforma conecta marcas e criadores de conteúdo digital de forma simples e direta."
        />
        <FeatureCard
          imageSrc={image2}
          title="Sem taxas para marcas"
          description="Marcas não pagam taxas ao realizar pagamentos para influenciadores, aumentando seus ganhos e simplificando a gestão financeira das campanhas."
        />
        <FeatureCard
          imageSrc={image3}
          title="ConectePay integrado"
          description="Com o ConectePay, pagamentos e recebimentos são realizados diretamente na plataforma, de forma rápida e segura."
        />
      </div>
    </section>
  );
};
