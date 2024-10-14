import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { HeroSection } from "@/components/sections/LandingPage/HeroSection";
import { BrandsSection } from "@/components/sections/LandingPage/BrandSection";
import { HowItWorksSection } from "@/components/sections/LandingPage/HowItWorksSection";
import { SectionInfo } from "@/components/sections/LandingPage/SectionInfo";
import { ConnectSection } from "@/components/sections/LandingPage/ConnectSection";

import { Footer } from "@/components/sections/LandingPage/Footer";
import brand from "@/assets/brand.svg";
import influencers from "@/assets/influencers.svg";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <div className="container px-10">
      <HeroSection />

      <BrandsSection />

      <HowItWorksSection />

      <SectionInfo
        imageSrc={brand}
        title="Para Marcas"
        description={
          <>
            <p>
              <strong>Sem taxa no pagamento para influenciadores</strong> -
              Realize campanhas e pague os influenciadores sem custo adicional
              por transações, maximizando o retorno sobre o investimento.
            </p>
            <p>
              <strong>Anúncios de Campanhas</strong> - Publique suas campanhas
              na plataforma, permitindo que influenciadores se candidatem às
              oportunidades mais alinhadas ao seu negócio.
            </p>
          </>
        }
        buttonLabel="Cadastro Marcas"
        buttonVariant="blue"
        buttonOnClick={() => navigate({ to: "/cadastro/marca" })}
      />

      <SectionInfo
        imageSrc={influencers}
        title="Para Influenciadores"
        description={
          <>
            <p>
              <strong>Campanhas</strong> - Candidate-se a quantas campanhas
              publicitárias quiser com entregáveis e pagamentos claros.
            </p>
            <p>
              <strong>Recebimento facilitado</strong> - Com o ConectePay
              integrado, influenciadores recebem seus pagamentos de forma rápida
              e segura, sem complicações.
            </p>
          </>
        }
        buttonLabel="Cadastro Influenciadores"
        buttonVariant="orange"
        buttonOnClick={() => navigate({ to: "/cadastro/influenciador" })}
        reverse
      />

      <ConnectSection />

      <Footer />
    </div>
  );
}

export default Index;
