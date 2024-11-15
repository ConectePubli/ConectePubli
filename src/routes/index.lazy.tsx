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

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      <HeroSection />

      {/*  <BrandsSection /> */}

      <HowItWorksSection />

      <SectionInfo
        imageSrc={brand}
        title="Para Marcas"
        description={
          <div className="space-y-1">
            <p>
              <strong>Sem taxa no pagamento para influenciadores</strong> -
              Realize campanhas e pague os influenciadores sem custo adicional
              por transações, maximizando o retorno sobre o investimento.
            </p>
            <p>
              <strong>Anúncios de Campanhas</strong> - Publique suas campanhas
              na plataforma para que influenciadores se candidatem a
              oportunidades alinhadas ao seu negócio.
            </p>
            <p>
              <strong>Criadores Alinhados com sua Marca</strong> - Encontre
              influenciadores de acordo com os objetivos, estilo e público da
              sua marca, garantindo parcerias estratégicas e eficazes.
            </p>
            <p>
              <strong>Pagamento Facilitado </strong> - Com o ConectePay
              integrado, realize pagamentos de forma rápida e segura diretamente
              pela plataforma.
            </p>
          </div>
        }
        buttonLabel="Pré Cadastro de Marcas"
        buttonVariant="blue"
        buttonOnClick={() => navigate({ to: "/cadastro/marca" })}
      />

      <SectionInfo
        imageSrc={influencers}
        title="Para Influenciadores"
        description={
          <div className="space-y-2">
            <p>
              <strong>Plataforma de Oportunidades</strong> - Descubra uma
              variedade de jobs exclusivos para monetizar seu conteúdo, com
              entregáveis e pagamentos claros.
            </p>
            <p>
              <strong>Campanhas</strong> - Candidate-se a quantas campanhas
              publicitárias quiser, encontrando parcerias alinhadas ao seu
              estilo e público.
            </p>
            <p>
              <strong>Recebimento facilitado</strong> - Com o ConectePay
              integrado, receba seus pagamentos de forma fácil e segura, sem
              complicações.
            </p>
          </div>
        }
        buttonLabel="Pré Cadastro de Influenciadores"
        buttonVariant="orange"
        buttonOnClick={() => navigate({ to: "/cadastro/influenciador" })}
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
