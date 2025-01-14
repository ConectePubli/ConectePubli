import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { WhatsappLogo } from "phosphor-react";

import { HeroSection } from "@/components/sections/LandingPage/HeroSection";
import { HowItWorksSection } from "@/components/sections/LandingPage/HowItWorksSection";
import { SectionInfo } from "@/components/sections/LandingPage/SectionInfo";
import { ConnectSection } from "@/components/sections/LandingPage/ConnectSection";
import TestimonialSection from "@/components/sections/LandingPage/TestimonialSection";

import { Footer } from "@/components/sections/LandingPage/Footer";
import brand from "@/assets/brand.webp";
import influencers from "@/assets/influencers.webp";
import { ConnectBrandsSection } from "@/components/sections/LandingPage/ConnectBrandsSection";
import SponsorBanner from "@/components/ui/SponsorBanner";
import LogosCarousel from "@/components/ui/LogosCarousel";
import TopCreatorsCarousel from "@/components/ui/TopCreatorsCarousel";
import Translator from "@/components/i18n/Translator";
import { t } from "i18next";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      <SponsorBanner />

      <HeroSection />

      {/* <BrandsSection /> */}

      <ConnectBrandsSection />
      <p className="text-left text-3xl font-bold mt-12 mb-6 px-4 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Translator path="Marcas Conectadas" />
        <LogosCarousel />
      </p>
      <HowItWorksSection />

      <div className="py-12">
        <SectionInfo
          imageSrc={brand}
          title={t("Para Marcas e Agências")}
          description={
            <div className="space-y-4">
              <p>
                <strong>{t("Criadores Qualificados:")}</strong>{" "}
                {t(
                  "Encontre criadores ideais para qualquer nicho e campanha com filtros detalhados."
                )}
              </p>
              <p>
                <strong>{t("Custo-Benefício:")}</strong>{" "}
                {t(
                  "Sem taxas ocultas, campanhas acessíveis para todos os orçamentos."
                )}
              </p>
              <p>
                <strong>{t("Resultados Reais:")}</strong>{" "}
                {t(
                  "Conteúdos criativos que geram engajamento, confiança e retorno."
                )}
              </p>
              <p>
                <strong>{t("Pagamentos Seguros:")}</strong>{" "}
                {t("Com o Conecte Pay, só pague após aprovar o conteúdo.")}
              </p>

              <p>
                <strong>{t("Segurança Jurídica:")}</strong>{" "}
                {t(
                  "Contratos integrados garantem transparência e zero burocracia."
                )}
              </p>
            </div>
          }
          buttonLabel={t("Cadastro Marcas ou Agências")}
          buttonVariant="purple"
          buttonOnClick={() => navigate({ to: "/cadastro/marca" })}
        />

        <SectionInfo
          imageSrc={influencers}
          title={t("Para creators")}
          description={
            <div className="space-y-4">
              <p>
                <strong>{t("Oportunidades para Todos:")}</strong>{" "}
                {t(
                  "De UGC Creators a influenciadores, encontre campanhas ideais para você."
                )}
              </p>
              <p>
                <strong>{t("Processo Simples:")}</strong>{" "}
                {t("Candidate-se, entregue e acompanhe tudo em um só lugar.")}
              </p>
              <p>
                <strong>{t("Cresça na Creator Economy:")}</strong>{" "}
                {t(
                  "Construa portfólio, receba avaliações e fortaleça sua reputação."
                )}
              </p>
              <p>
                <strong>{t("Pagamentos Garantidos:")}</strong>{" "}
                {t(
                  "Com Conecte Pay, o valor é reservado antes do início e liberado na conclusão do trabalho."
                )}
              </p>
              <p>
                <strong>{t("Contratos Protegidos:")}</strong>{" "}
                {t(
                  "Termos claros e contratos integrados protegem seu trabalho e garantem segurança profissional."
                )}
              </p>
            </div>
          }
          buttonLabel={t("Cadastro Creators")}
          buttonVariant="orange"
          buttonOnClick={() => navigate({ to: "/cadastro/creator" })}
          reverse
        />
      </div>

      <div className="text-left text-3xl font-bold mt-12 mb-6 px-4 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-xl">
        <h2 className="mb-4">{t("Confira Nossos Top Creators")}</h2>
        <TopCreatorsCarousel />
      </div>

      <div className="text-left text-3xl mt-12 mb-6 px-4 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-xl">
        <h2 className="mb-4 font-bold">
          {t("O que estão falando sobre a Conecte Publi")}
        </h2>
        <TestimonialSection />
      </div>

      <ConnectSection />
      <Footer />

      <a
        href="https://api.whatsapp.com/send?phone=5511913185849"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all"
        style={{ zIndex: 1000 }}
      >
        <WhatsappLogo size={30} color="#fff" />
      </a>
    </div>
  );
}

export default Index;
