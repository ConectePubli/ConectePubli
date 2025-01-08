import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { WhatsappLogo } from "phosphor-react";

import { HeroSection } from "@/components/sections/LandingPage/HeroSection";
//import { BrandsSection } from "@/components/sections/LandingPage/BrandSection";
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

      <p className="text-left text-xl font-bold mt-12 mb-6 px-4 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Translator path="Aprovado Por:" />
        <LogosCarousel />
      </p>

      <div
        className="text-left text-xl font-bold mt-12 mb-6 px-4 mx-auto max-w-screen-sm
                  md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl"
      >
        <h2 className="mb-4">Confira Alguns dos Nossos Top Creators:</h2>
        <TopCreatorsCarousel />
      </div>

      <HowItWorksSection />

      <SectionInfo
        imageSrc={brand}
        title="Para marcas"
        description={
          <div className="space-y-1">
            <p>
              <strong>Acesso a criadores qualificados</strong> - Encontre os
              criadores certos para suas campanhas, independentemente do porte
              ou nicho. Selecione por filtros detalhados e conecte-se
              diretamente.
            </p>
            <p>
              <strong>Custo-Benefício Real</strong> - Sem taxas ocultas.
              Campanhas acessíveis para qualquer orçamento, desde pequenas ações
              locais até grandes campanhas de impacto
            </p>
            <p>
              <strong>Resultados autênticos e eficientes</strong> - Receba
              conteúdos criativos e alinhados ao seu público, gerando mais
              engajamento, confiança e retorno para sua marca.
            </p>
            <p>
              <strong>Pagamentos protegidos com Conecte Pay</strong> - Seu
              investimento fica seguro: o pagamento só é liberado após aprovação
              do conteúdo entregue. Sem riscos.
            </p>

            <p>
              <strong>Segurança Jurídica integrada</strong> - Contratos e termos
              padronizados já estão integrados na plataforma, garantindo
              segurança e transparência em todos os acordos. Zero burocracia.
            </p>
          </div>
        }
        buttonLabel="Cadastro Marcas"
        buttonVariant="blue"
        buttonOnClick={() => navigate({ to: "/cadastro/marca" })}
      />

      <SectionInfo
        imageSrc={influencers}
        title="Para creators"
        description={
          <div className="space-y-2">
            <p>
              <strong>Oportunidades para todos os perfis</strong> - Seja UGC
              Creator ou influenciador de qualquer porte, encontre campanhas que
              combinam com você e monetize sua criatividade.
            </p>
            <p>
              <strong>Processo simples e transparente</strong> - Candidate-se ás
              campanhas que fazem sentido para você, entregue com confiança e
              acompanhe tudo em um só lugar.
            </p>
            <p>
              <strong>Construa seu portfólio e cresça</strong> - Trabalhe com
              marcas, receba avaliações positivas e fortaleça sua reputação na
              Creator Economy.
            </p>
            <p>
              <strong>Pagamentos Garantidos e sem complicação</strong> - O
              Conecte Pay assegura que o pagamento esteja reservado antes de
              você começar a produzir. Receba de forma rápida e segura.
            </p>
            <p>
              <strong>Segurança jurídica em todas as entregas</strong> - A
              plataforma inclui contratos e termos claros para proteger seu
              trabalho e garantir relações profissionais com as marcas
            </p>
          </div>
        }
        buttonLabel="Cadastro Creators"
        buttonVariant="orange"
        buttonOnClick={() => navigate({ to: "/cadastro/creator" })}
        reverse
      />

      <ConnectBrandsSection />

      <ConnectSection />

      <TestimonialSection />

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
