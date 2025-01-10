import { createFileRoute, redirect } from "@tanstack/react-router";

import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";

import ebook1 from "@/assets/ebooks/ebook1.jpeg";
import ebook2 from "@/assets/ebooks/ebook2.jpeg";
import ebook3 from "@/assets/ebooks/ebook3.jpeg";

import download1 from "@/assets/ebooks/downloads/Ebook Creator Economy 360° - Um Guia Completo Para Marcas.pdf";
import download2 from "@/assets/ebooks/downloads/Dicionário da Creator Economy.pdf";
import download3 from "@/assets/ebooks/downloads/GuiaTabela de Precificação UGC e IGC.pdf";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/premium/ebooks/"
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    }

    if (userType !== "Brands") {
      throw redirect({
        to: "/dashboard",
      });
    }

    let purchasedPlan;

    try {
      purchasedPlan = await pb.collection("purchased_brand_plans").getFullList({
        filter: `brand="${pb.authStore?.model?.id}"`,
      });
    } catch (e) {
      console.log(`error fetch club premium plan`);
      console.log(e);
    }

    if (!purchasedPlan || purchasedPlan.length === 0) {
      console.log("redirect");
      throw redirect({
        to: "/premium/marca",
      });
    }
  },
});

function Page() {
  const { t } = useTranslation();
  const [pageTitle, setPageTitle] = useState("Compra realizada com sucesso");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");

    if (redirect === "false") {
      setPageTitle("Ebooks Premium");
    }
  }, []);

  return (
    <div className="w-full p-4 md:p-8">
      <div className="max-w-6xl mx-auto text-left">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
          {pageTitle}
        </h1>
        <p className="mt-3 text-gray-700">
          {t("Faça o download dos produtos abaixo")}
        </p>

        <div className="w-full mt-8 gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <div className="bg-white rounded-md shadow p-4 flex flex-col">
            <img
              src={ebook1}
              alt="Capa do eBook Criador 1"
              className="w-full h-auto object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-[#10438F] mb-1">
              Creator Economy 360°
              <br /> {t("O Guia Completo para Marcas e Negócios")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t(
                "Conecte-se ao Futuro do Marketing de Influência com a Conecte Publi"
              )}
            </p>
            <a
              href={download1}
              className="mt-auto inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold text-center py-2 px-4 rounded-md"
              download
            >
              {t("Baixar")}
            </a>
          </div>

          <div className="bg-white rounded-md shadow p-4 flex flex-col">
            <img
              src={ebook2}
              alt="Capa do eBook Criador 2"
              className="w-full h-auto object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-[#10438F] mb-1">
              Creator Economy 360° Dicionário
            </h2>
            <p className="text-gray-600 mb-4">
              {t(
                "Tenha em mãos todos os termos e conceitos do universo Creator"
              )}
            </p>
            <a
              href={download2}
              className="mt-auto inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold text-center py-2 px-4 rounded-md"
              download
            >
              {t("Baixar")}
            </a>
          </div>

          <div className="bg-white rounded-md shadow p-4 flex flex-col">
            <img
              src={ebook3}
              alt="Capa do eBook Criador 3"
              className="w-full h-auto object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-[#10438F] mb-1">
              {t("Guia de Precificação UGC e IGC")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t(
                "Aprenda a definir o valor do seu conteúdo de forma estratégica"
              )}
            </p>
            <a
              href={download3}
              className="mt-auto inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold text-center py-2 px-4 rounded-md"
              download
            >
              {t("Baixar")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
