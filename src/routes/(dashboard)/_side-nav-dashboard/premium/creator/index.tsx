import {
  createFileRoute,
  redirect,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { t } from "i18next";
import { CaretRight } from "phosphor-react";
import { Info } from "lucide-react";
import "react-toastify/ReactToastify.css";

import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

import { InfluencerPremiumPlan } from "@/types/InfluencerPremiumPlan";
import { PurchasedPremiumPlan } from "@/types/PurchasedPremiumPlan";

import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";
import { formatDateUTC } from "@/utils/formatDateUTC";
import {
  subscribeInfluencerPremium,
  unsubscribeInfluencerPremium,
} from "@/services/influencerPremium";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/premium/creator/"
)({
  component: Page,
  loader: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    }

    if (userType !== "Influencers") {
      throw redirect({
        to: "/dashboard",
      });
    }

    try {
      const plans = await pb.collection("influencers_plans").getFullList();

      const purchasedPlan = await pb
        .collection("purchased_influencers_plans")
        .getFullList({
          filter: `influencer="${pb.authStore?.model?.id}" && active=true`,
        });

      return {
        plansData: plans.slice(0, 2),
        influencerPlan:
          (purchasedPlan && purchasedPlan.length >= 1 && purchasedPlan[0]) ||
          null,
      };
    } catch (e) {
      console.log(`error fetch club premium plan: ${e}`);
    }
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ),
  errorComponent: () => (
    <div className="p-4">
      {t(
        "Aconteceu um erro ao carregar essa página, não se preocupe o erro é do nosso lado e vamos trabalhar para resolve-lo!"
      )}
    </div>
  ),
});

function Page() {
  const navigate = useNavigate();
  const { plansData, influencerPlan } = useLoaderData({ from: Route.id });

  const plans = plansData as InfluencerPremiumPlan[];
  const currentPlan = influencerPlan as PurchasedPremiumPlan;

  const [loadingPayment, setLoadingPayment] = useState({
    monthly: false,
    year: false,
  });

  const [seeModalCancel, setSeeModalCancel] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  return (
    <div className="w-full p-4 md:p-8">
      {seeModalCancel && (
        <Modal onClose={() => setSeeModalCancel(false)}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">
              Tem certeza que deseja cancelar a assinatura?
            </h2>

            <p className="text-gray-700">
              O cancelamento impedirá futuras cobranças, mas o acesso aos
              benefícios permanecerá ativo até o termino do período (mensal ou
              anual)
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSeeModalCancel(false)}
                className="text-gray-600 hover:underline"
              >
                Fechar
              </button>
              <button
                className={`bg-[#942A2A] text-white px-4 py-2 rounded hover:bg-red-700 transition hover:cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                  loadingCancel && "opacity-30 cursor-not-allowed"
                }`}
                onClick={() => {
                  unsubscribeInfluencerPremium(
                    setLoadingCancel,
                    currentPlan.subscription_stripe_id,
                    toast
                  );
                }}
              >
                {loadingCancel ? "Aguarde..." : "Cancelar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="max-w-4xl mx-auto text-left">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
          {t("Assinatura Premium para Creators: Eleve Seu Potencial!")}
        </h1>
        <p className="mt-3 text-gray-700">
          {t(
            "Desbloqueie vantagens exclusivas como destaque nas campanhas, acesso a conteúdos e ferramentas indispensáveis, e torne-se o Creator preferido das marcas. Escolha o plano que mais combina com seu sucesso!"
          )}
        </p>
      </div>

      {currentPlan && (
        <div className="max-w-4xl mx-auto text-left mt-4">
          <p
            className="border-2 border-[#10438F] w-[200px] px-3 py-1 flex items-center justify-center rounded-md hover:bg-[#10438F] hover:text-white cursor-pointer transition-colors"
            onClick={() => navigate({ to: "/premium/creator/conteudos" })}
          >
            {t("Acessar conteúdos")} <CaretRight />
          </p>
        </div>
      )}

      {currentPlan && currentPlan.cancel_at && (
        <div className="max-w-4xl mx-auto text-left mt-4 bg-red-200 py-2 px-4 rounded-md">
          <p className="flex items-center">
            <Info className="w-4 h-4 min-w-[1rem] mr-2" />{" "}
            {t("Sua assinatura foi cancelada, ela continuará ativa até o dia")}{" "}
            {formatDateUTC(currentPlan.cancel_at)}
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6 max-xl:mt-0 md:w-[80%]">
        <div
          className={`relative bg-white shadow ${currentPlan && !currentPlan.cancel_at ? "h-[815px]" : "h-[770px]"} rounded-md flex flex-col justify-between border-2 border-[#FF7A49] translate-y-[45px] order-2 xl:order-1 max-xl:translate-y-0 py-6`}
        >
          <div className="flex-1 px-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-left">
              {t("Plano Mensal")}
            </h2>

            <p className="mt-2 text-left text-[#FF7A49] text-2xl md:text-3xl font-bold">
              R$ 89,90
              <span className="text-base md:text-lg font-medium text-gray-700">
                {" "}
                {t("/mês")}
              </span>
            </p>

            <ul className="mt-4 space-y-2 text-sm md:text-base">
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Prioridade nas campanhas")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Destaque na Vitrine de Creators por 5 dias ao mês")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Aula Tutorial: Edição de Conteúdo no CapCut para Creators! Edite Seus Próprios Vídeos Como um Profissional!"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Aula Tutorial: Como Criar Seu Mídia Kit + Transformá-lo em Site + Gerar um Link Profissional + Acessar Mais de 10 Modelos Gratuitos para Editar e Personalizar!"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Kit Completo: Contratos Prontos + Tutorial de Edição")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Guia de Precificação UGC e IGC")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Ebook: Como Criar Roteiros - Técnicas Práticas e Prompts Estratégicos com IA e ChatGPT"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Ebook: Como Criar Conteúdo - Ferramentas, Dicas e Prompts Estratégicos com ChatGPT"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Dicionário completo da Creators Economy")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("E-book: Guia Prático para Emitir Nota Fiscal como Creator")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "E-book Creator Economy 360°: O Guia completo para Criadores de Conteúdo Digital"
                )}
              </li>
            </ul>
          </div>

          {currentPlan && currentPlan.plan.includes(plans[0].id) ? (
            <div className="w-full flex flex-col justify-center">
              <Button className="mt-6 w-[90%] mx-auto text-white bg-[#00B64C] py-2 px-4 rounded-md text-base cursor-default hover:bg-[#00B64C]">
                {t("Plano atual")}
              </Button>

              {!currentPlan.cancel_at && (
                <p
                  className="mt-4 text-center text-red-600 text-base hover:underline cursor-pointer"
                  onClick={() => setSeeModalCancel(true)}
                >
                  {t("Cancelar o plano")}
                </p>
              )}
            </div>
          ) : (
            <Button
              variant={"blue"}
              className="mt-6 w-[90%] mx-auto text-white py-2 px-4 rounded-md text-base disabled:bg-gray-700"
              onClick={() =>
                subscribeInfluencerPremium(
                  plans[0],
                  toast,
                  loadingPayment,
                  setLoadingPayment,
                  0
                )
              }
              disabled={currentPlan !== null}
            >
              {loadingPayment.monthly ? t("Aguarde...") : t("Escolher Plano")}
            </Button>
          )}
        </div>

        <div
          className={`relative bg-white shadow ${currentPlan && !currentPlan.cancel_at ? "h-[860px]" : "h-[815px]"} rounded-md flex flex-col justify-between border-2 border-[#FF7A49] order-1 xl:order-2 max-xl:mt-[60px]`}
        >
          <div className="bg-[#ff7a49] px-3 h-[45px] flex items-center justify-center text-center font-semibold">
            <p className="text-white">{t("MAIS POPULAR")}</p>
          </div>

          <div className="flex-1 pt-6 px-4">
            <div className="flex flex-col align-top">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-left">
                {t("Plano Anual")}
              </h2>
              <div className="flex items-center mt-2">
                <p className="text-left text-[#FF7A49] text-2xl md:text-3xl font-bold">
                  R$ 14,90
                  <span className="text-base md:text-lg font-medium text-gray-700">
                    {t("/mês")}
                  </span>
                </p>
                <span className="ml-4 translate-y-0.5 bg-[#FF7A49] text-white font-bold text-xs px-2 py-1 rounded">
                  78% OFF
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm md:text-base">
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Prioridade nas campanhas")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Destaque na Vitrine de Creators por 5 dias ao mês")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Aula Tutorial: Edição de Conteúdo no CapCut para Creators! Edite Seus Próprios Vídeos Como um Profissional!"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Aula Tutorial: Como Criar Seu Mídia Kit + Transformá-lo em Site + Gerar um Link Profissional + Acessar Mais de 10 Modelos Gratuitos para Editar e Personalizar!"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Kit Completo: Contratos Prontos + Tutorial de Edição")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Guia de Precificação UGC e IGC")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Ebook: Como Criar Roteiros - Técnicas Práticas e Prompts Estratégicos com IA e ChatGPT"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "Ebook: Como Criar Conteúdo - Ferramentas, Dicas e Prompts Estratégicos com ChatGPT"
                )}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("Dicionário completo da Creators Economy")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t("E-book: Guia Prático para Emitir Nota Fiscal como Creator")}
              </li>
              <li className="flex items-start">
                <span className="text-[#ff7a49] mr-2">✔</span>
                {t(
                  "E-book Creator Economy 360°: O Guia completo para Criadores de Conteúdo Digital"
                )}
              </li>
            </ul>
          </div>

          {currentPlan && currentPlan.plan.includes(plans[1].id) ? (
            <div className="w-full flex flex-col justify-center">
              <Button className="mt-6 w-[90%] mx-auto text-white bg-[#00B64C] py-2 px-4 rounded-md text-base cursor-default hover:bg-[#00B64C]">
                {t("Plano atual")}
              </Button>

              {!currentPlan.cancel_at && (
                <p
                  className="my-4 text-center text-red-600 text-base hover:underline cursor-pointer"
                  onClick={() => setSeeModalCancel(true)}
                >
                  {t("Cancelar o plano")}
                </p>
              )}
            </div>
          ) : (
            <Button
              variant={"blue"}
              className="my-6 w-[90%] mx-auto text-white py-2 px-4 rounded-md text-base disabled:bg-gray-700"
              onClick={() =>
                subscribeInfluencerPremium(
                  plans[1],
                  toast,
                  loadingPayment,
                  setLoadingPayment,
                  1
                )
              }
              disabled={currentPlan !== null}
            >
              {loadingPayment.year ? t("Aguarde...") : t("Escolher Plano")}
            </Button>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Page;
