import Translator from "@/components/i18n/Translator";
import React from "react";

export const ConnectBrandsSection: React.FC = () => {
  return (
    <section className="bg-blue-900 py-12 relative">
      <div className="container mx-auto text-left max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-4">
        <h2 className="text-3xl font-bold text-white mb-6">
          <Translator path="Conectamos Marcas" />
        </h2>
        <p className="text-white mx-auto leading-relaxed max-sm:text-left max-sm:max-w-[100%]">
          <Translator path="Somos a conexão estratégica que amplifica a presença das marcas no universo digital, transformando campanhas publicitárias em experiências desejadas pelo público. Com a Conecte Publi, criamos uma sinergia entre a inovação da humanização das marcas e o poder dos creators, alavancando as vendas de produtos e serviços e fortalecendo a presença online, enquanto oferecemos aos criadores de conteúdo oportunidades de monetização e crescimento profissional." />
          <br />
          <br />
          <Translator path="Conecte-se!" />
        </p>
      </div>
    </section>
  );
};
