import React from "react";
import image1 from "@/assets/how-it-works1.png";
import image2 from "@/assets/how-it-works2.png";
import image3 from "@/assets/how-it-works3.png";
import image4 from "@/assets/how-it-works4.png";

import { FeatureCard } from "@/components/LandingPage/FeaturesCard/FeaturesCard";
import Translator from "@/components/i18n/Translator";
import { useTranslation } from "react-i18next";

export const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-[#354280] relative">
      <div className="container mx-auto text-left max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl px-4">
        <h2 className="text-3xl font-bold text-left text-white mb-8">
          <Translator path="Como funciona" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FeatureCard
            imageSrc={image1}
            title={t("1. Cadastre-se e Configure")}
            descriptionBrand={t(
              "Crie sua conta, configure o perfil da sua marca e publique campanhas rapidamente."
            )}
            descriptionCreator={t(
              "Cadastre-se, crie seu portfólio e explore oportunidades alinhadas ao seu estilo."
            )}
          />
          <FeatureCard
            imageSrc={image2}
            title={t("2. Publique ou Candidate-se")}
            descriptionBrand={t(
              "Descreva os detalhes da sua campanha e receba propostas de criadores qualificados."
            )}
            descriptionCreator={t(
              "Escolha campanhas, envie propostas e apresente seu diferencial."
            )}
          />
          <FeatureCard
            imageSrc={image3}
            title={t("3. Produza e Aprove")}
            descriptionBrand={t(
              "Analise propostas, selecione os criadores ideais e aprove os conteúdos diretamente na plataforma."
            )}
            descriptionCreator={t(
              "Produza conteúdos alinhados ao escopo e entregue no prazo combinado."
            )}
          />
          <FeatureCard
            imageSrc={image4}
            title={t("4. Pagamento seguro com Conecte Pay")}
            descriptionBrand={t(
              "O pagamento só é liberado após a entrega aprovada, garantindo segurança total."
            )}
            descriptionCreator={t(
              "Receba de forma rápida, simples e protegida com o Conecte Pay."
            )}
          />
        </div>
      </div>
    </section>
  );
};
