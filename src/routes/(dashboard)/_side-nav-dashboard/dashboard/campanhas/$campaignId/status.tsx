import {
  createFileRoute,
  notFound,
  redirect,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { t } from "i18next";
import { Clock, Check, X } from "phosphor-react";
import { ClientResponseError } from "pocketbase";

import GoBack from "@/assets/icons/go-back.svg";

import pb from "@/lib/pb";

import { Campaign } from "@/types/Campaign";

import Spinner from "@/components/ui/Spinner";
import CampaignSpotlight from "@/components/ui/CampaignSpotlight";
import { useState } from "react";

interface SpotlightCampaign {
  state: boolean;
  campaign: Campaign | null;
}

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/status"
)({
  loader: async ({ params: { campaignId } }) => {
    try {
      const currentBrandId = pb.authStore.model?.id;

      if (!currentBrandId) {
        throw redirect({ to: "/login" });
      }

      const campaignData = await pb
        .collection("Campaigns")
        .getFirstListItem<Campaign>(`id="${campaignId}"`);

      if (!campaignData) {
        throw notFound();
      }

      if (
        campaignData.brand !== currentBrandId ||
        campaignData.status === "draft"
      ) {
        throw redirect({ to: "/dashboard" });
      }

      return { campaignData };
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return {
          error: "not_found",
          campaignData: null,
          campaignParticipations: [],
        };
      }
      throw error;
    }
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ),
  component: Page,
  errorComponent: () => (
    <div className="px-4 py-4 h-full min-w-100 flex items-center justify-center text-center">
      {t(
        "Ocorreu um erro ao carregar essa página. Não se preocupe, estamos trabalhando para resolvê-lo!"
      )}
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-10">{t("Campanha não encontrada")}</div>
  ),
});

function Page() {
  const navigate = useNavigate();

  const { campaignData } = useLoaderData({ from: Route.id });

  const campaign = campaignData as Campaign;

  const [spotlightCampaignPlans, setSpotlightCampaignPlans] =
    useState<SpotlightCampaign>({
      state: false,
      campaign: null,
    });

  return (
    <div className="w-full p-6 max-sm:p-2 bg-white text-gray-700 flex flex-col">
      {spotlightCampaignPlans.state === false && (
        <>
          <header className="w-full flex justify-between items-center p-4">
            <div>
              <div className="flex items-center gap-1 mb-2">
                <button
                  className="bg-white pr-1 rounded-full"
                  onClick={() => {
                    navigate({ to: "/dashboard" });
                  }}
                >
                  <img src={GoBack} alt="Go Back" className="w-5 h-5" />
                </button>
                <button
                  className="text-black/75 font-semibold translate-y-0.4"
                  onClick={() => {
                    navigate({ to: "/dashboard" });
                  }}
                >
                  {t("Voltar")}
                </button>
              </div>

              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {campaign.name}
              </h1>
            </div>

            {campaign.status === "analyzing" && (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md text-sm md:text-base"
                onClick={() => {
                  navigate({
                    to: `/dashboard/campanhas/${campaign.id}/editar`,
                  });
                }}
              >
                {t("Editar Campanha")}
              </button>
            )}
          </header>

          <main className="flex flex-col items-center justify-center flex-1 p-4 md:p-8">
            <div className="flex items-center space-x-8 md:space-x-16 mb-8">
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center 
                ${
                  campaign.status === "analyzing" ||
                  campaign.status === "ready" ||
                  campaign.status === "rejected"
                    ? "bg-[#10438F] text-white"
                    : "bg-gray-300 text-gray-600"
                }
              `}
                >
                  <Clock size={40} weight="fill" />
                </div>
                <span className="mt-2 text-center text-sm md:text-base font-semibold">
                  {t("Campanha está em análise")}
                </span>
              </div>

              <div className="w-40 md:w-16 h-[2px] bg-gray-300" />

              <div className="flex flex-col items-center">
                {campaign.status === "ready" ? (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white bg-[#008000]">
                    <Check size={32} weight="fill" />
                  </div>
                ) : campaign.status === "rejected" ? (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white bg-red-500">
                    <X size={32} weight="fill" />
                  </div>
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    <Check size={32} />
                  </div>
                )}
                <span className="mt-2 text-center text-sm md:text-base font-semibold">
                  {campaign.status === "rejected"
                    ? t("Campanha Reprovada")
                    : t("Campanha Aprovada e Liberada na Vitrine")}
                </span>
              </div>
            </div>

            <div
              className={`max-w-3xl text-left space-y-4 text-sm md:text-base mt-10 border  rounded-md p-5 ${campaign.status == "ready" ? "border-[#008000]" : `${campaign.status === "rejected" ? "border-[#EF4444]" : `${campaign.status === "analyzing" ? "border-[#10438F]" : ""}`}`}`}
            >
              {campaign.status === "analyzing" && (
                <>
                  <p>
                    {t(
                      "Sua campanha foi criada com sucesso! Agora, a equipe da Conecte está analisando os detalhes para garantir que tudo esteja perfeito."
                    )}
                  </p>
                  <p>
                    {t(
                      "O prazo para aprovação é de até 48 horas. Assim que sua campanha for aprovada, você receberá uma notificação e poderá começar a receber inscrições dos creators!"
                    )}
                  </p>
                  <p>
                    {t(
                      "Enquanto isso, você pode fazer qualquer alteração na campanha, se precisar!"
                    )}
                  </p>
                </>
              )}

              {campaign.status === "ready" && (
                <>
                  <p>
                    {t(
                      "Sua campanha foi aprovada e já se encontra na Vitrine de Campanhas para os creators se candidatarem!"
                    )}
                  </p>
                  <div className="flex justify-center w-full">
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                      onClick={() => {
                        setSpotlightCampaignPlans({
                          ...spotlightCampaignPlans,
                          state: true,
                          campaign: campaign,
                        });
                      }}
                    >
                      {t("Comprar Destaque para a Campanha")}
                    </button>
                  </div>
                </>
              )}

              {campaign.status === "rejected" && (
                <>
                  <p>
                    {t(
                      "Sua campanha foi reprovada pela equipe da Conecte Publi. Para mais informações, entre em contato com nosso suporte."
                    )}
                  </p>
                </>
              )}
            </div>
          </main>
        </>
      )}

      {spotlightCampaignPlans.state === true &&
        spotlightCampaignPlans.campaign && (
          <main className="flex flex-col items-center justify-center flex-1 p-4 md:p-8">
            <CampaignSpotlight
              campaign={spotlightCampaignPlans.campaign as Campaign}
              setSpotlightCampaignPlans={setSpotlightCampaignPlans}
              spotlightCampaignPlans={spotlightCampaignPlans}
            />
          </main>
        )}
    </div>
  );
}

export default Page;
