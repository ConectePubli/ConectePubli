import React from "react";
import image1 from "@/assets/how-it-works1.png";
import image2 from "@/assets/how-it-works2.png";
import image3 from "@/assets/how-it-works3.png";
import image4 from "@/assets/how-it-works4.png";

import { FeatureCard } from "@/components/LandingPage/FeaturesCard/FeaturesCard";

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-8 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
      <h2 className="text-3xl font-bold text-left mb-8">Como funciona</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <FeatureCard
          imageSrc={image1}
          title="1. Cadastre-se"
          descriptionBrand={`Crie sua conta, configure o perfil da sua marca e publique campanhas rapidamente.`}
          descriptionCreator="Cadastre-se, crie seu portfólio e explore oportunidades alinhadas ao seu estilo."
        />
        <FeatureCard
          imageSrc={image2}
          title="2. Publique ou Candidate-se"
          descriptionBrand="Descreva os detalhes da sua campanha e receba propostas de criadores qualificados."
          descriptionCreator="Escolha campanhas, envie propostas e apresente seu diferencial."
        />
        <FeatureCard
          imageSrc={image3}
          title="3. Produza e Aprove"
          descriptionBrand="Analise propostas, selecione os criadores ideais e aprove os conteúdos diretamente na plataforma."
          descriptionCreator="Produza conteúdos alinhados ao escopo e entregue no prazo combinado."
        />
        <FeatureCard
          imageSrc={image4}
          title="4. Pagamento seguro com Conecte Pay"
          descriptionBrand="Para Marcas: O pagamento só é liberado após a entrega aprovada, garantindo segurança total."
          descriptionCreator="Receba de forma rápida, simples e protegida com o Conecte Pay."
        />
      </div>
    </section>
  );
};
