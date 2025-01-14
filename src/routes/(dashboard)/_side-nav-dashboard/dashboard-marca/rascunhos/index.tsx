import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { Campaign } from "@/types/Campaign";
import { ClientResponseError } from "pocketbase";
import { Button } from "@/components/ui/button";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/rascunhos/"
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    } else if (userType !== "Brands") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  errorComponent: () => (
    <div>
      {t("Ocorreu um erro ao carregar essa página. Não se preocupe, estamos trabalhando para resolvê-lo!")}
    </div>
  ),
});

function Page() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getDraftsCampaign = async () => {
    setIsLoading(true);

    try {
      const currentBrandId = pb.authStore.model?.id;

      const campaignsData: Campaign[] = await pb
        .collection("Campaigns")
        .getFullList({
          filter: `brand="${currentBrandId}" && status="draft" && paid=false`,
        });

      setCampaigns(campaignsData);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return {
          error: "not_found",
          campaignData: null,
          campaignParticipations: [],
        };
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDraftsCampaign();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">
        {t("Rascunho de Campanhas")}
      </h2>
      <p className="text-gray-600 mb-6">
        {t(
          "Finalize as suas campanhas para que os creators possam se candidatar"
        )}
      </p>
      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-3 w-full mt-4">
          <Spinner />
          <p className="text-center">{t("Carregando dados...")}</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Tabela para telas maiores */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#10438F]">
                  <th className="border p-2 text-white">{t("Data")}</th>
                  <th className="border p-2 text-white">{t("Nome")}</th>
                  <th className="border p-2 text-white">{"Status"}</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length >= 1 &&
                  campaigns.map((campaign: Campaign) => (
                    <tr key={campaign.id}>
                      <td className="border p-2">
                        {formatDateUTC(campaign.created)}
                      </td>
                      <td className="border p-2">{campaign.name}</td>
                      <td className="border p-2 flex items-center justify-center">
                        <Button
                          variant={"orange"}
                          className="py-2 px-4 rounded"
                          onClick={() => {
                            navigate({
                              to: "/dashboard-marca/criar-campanha",
                              search: {
                                campaign_id: campaign?.id,
                                is_draft: true,
                              },
                              replace: true,
                            });
                          }}
                        >
                          {campaign.status === "draft"
                            ? t("Finalizar campanha")
                            : t("Status desconhecido")}
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {campaigns.length === 0 && (
              <div className="flex items-center justify-center min-h-[100px]">
                <p>
                  {t("Você não salvou nenhuma campanha como rascunho ainda")}
                </p>
              </div>
            )}
          </div>

          {/* Tabela para telas menores */}
          <div className="block lg:hidden overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#10438F]">
                  <th className="border p-2 text-white">{t("Status")}</th>
                  <th className="border p-2 text-white">{t("Nome")}</th>
                  <th className="border p-2 text-white">{t("Data")}</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length >= 1 &&
                  campaigns.map((campaign: Campaign) => (
                    <tr key={campaign.id}>
                      <td className="border p-2 flex items-center justify-center">
                        <Button
                          variant={"orange"}
                          className="py-2 px-4 rounded"
                          onClick={() => {
                            navigate({
                              to: "/dashboard-marca/criar-campanha",
                              search: {
                                campaign_id: campaign?.id,
                                is_draft: true,
                              },
                              replace: true,
                            });
                          }}
                        >
                          {campaign.status === "draft"
                            ? t("Finalizar campanha")
                            : t("Status desconhecido")}
                        </Button>
                      </td>
                      <td className="border p-2">{campaign.name}</td>
                      <td className="border p-2">
                        {formatDateUTC(campaign.created)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {campaigns.length === 0 && (
              <div className="flex items-center justify-center min-h-[100px]">
                <p>
                  {t("Você não salvou nenhuma campanha como rascunho ainda")}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
