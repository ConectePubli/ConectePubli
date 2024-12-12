import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import TopCreatorBadge from "@/components/ui/top-creator-badge";
import DownloadIcon from "@/assets/icons/dowload-icon.svg";
import RegulamentoPdf from "@/assets/pdfs/regulamento-selo-top-creator-conecte-publi.pdf";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/top-creator/"
)({
  component: TopCreator,
});

function TopCreator() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      number: "1",
      title: "Faça o download do Regulamento",
      description:
        "Clique no botão e um arquivo PDF será baixado automaticamente no seu dispositivo. Esse arquivo contém: Os requisitos necessários para se tornar um Top Creator. Um formulário para assinatura.",
    },
    {
      number: "2",
      title: "Leia o documento e prepare os requisitos",
      description:
        "Abra o PDF baixado e leia com atenção todas as informações e requisitos. Certifique-se de atender a todos os critérios solicitados antes de prosseguir.",
    },
    {
      number: "3",
      title: "Envie o formulário preenchido",
      description: (
        <>
          Reúna os documentos necessários, assine e envie para{" "}
          <a
            href="mailto:creators@conectepubli.com"
            className="text-blue-600 hover:underline"
          >
            creators@conectepubli.com
          </a>
          . Após aprovação, seu perfil será atualizado com o selo de Top
          Creator, destacando sua posição na plataforma.
        </>
      ),
    },
  ];

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      {/* Badge e Título empilhados */}
      <div className="flex flex-col items-start gap-2 mb-6">
        <TopCreatorBadge status={true} />
        <h1 className="text-2xl font-bold text-gray-900">
          Descubra Como Funciona
        </h1>
      </div>

      {/* Botão de Download do Regulamento com Ícone */}
      <div className="mb-8">
        <a
          href={RegulamentoPdf}
          download
          className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md shadow transition-colors"
        >
          <img
            src={DownloadIcon}
            alt="Ícone de Download"
            className="w-4 h-4 mr-2"
          />
          Baixar Regulamento
        </a>
      </div>

      {/* Steps */}
      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
        {/* Linha horizontal fina e cinza (apenas desktop) */}
        <div className="hidden sm:block absolute top-4 sm:top-4 left-8 sm:left-8 w-full border-t border-gray-300" />

        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-start sm:flex-1 sm:max-w-[300px] relative z-10"
          >
            {/* Número */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.number === "2" ? "bg-orange-500" : "bg-blue-900"
              } text-white font-bold mb-2`}
            >
              {step.number}
            </div>

            {/* Título */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {step.title}
            </h2>

            {/* Descrição */}
            <p className="text-gray-700 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCreator;
