import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { Campaign } from "@/types/Campaign";
import { ClientResponseError } from "pocketbase";
import { Button } from "@/components/ui/button";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/rascunhos/"
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login123new",
      });
    } else if (userType !== "Brands") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  errorComponent: () => (
    <div>
      Ocorreu um erro ao carregar essa página. Não se preocupe, estamos
      trabalhando para resolvê-lo!
    </div>
  ),
});

function Page() {
  const navigate = useNavigate();

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
      <h2 className="text-2xl font-semibold mb-4">Rascunho de Campanhas</h2>
      <p className="text-gray-600 mb-6">
        Finalize as suas campanhas para que os creators possam se candidatar
      </p>
      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-3 w-full mt-4">
          <Spinner />
          <p className="text-center">Carregando dados...</p>
        </div>
      )}

      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            {campaigns.length >= 1 && (
              <thead>
                <tr className="bg-[#10438F]">
                  <th className="border p-2 text-white whitespace-nowrap">
                    Data
                  </th>
                  <th className="border p-2 text-white whitespace-nowrap">
                    Nome
                  </th>
                  <th className="border p-2 text-white whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
            )}
            <tbody>
              {campaigns.length >= 1 &&
                campaigns.map((campaign: Campaign) => (
                  <tr key={campaign.id}>
                    <td className="border p-2 whitespace-nowrap">
                      {formatDateUTC(campaign.created)}
                    </td>
                    <td className="border p-2">{campaign.name}</td>
                    <td className="border p-2 flex items-center justify-center whitespace-nowrap">
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
                          ? "Finalizar campanha"
                          : "Status desconhecido"}
                      </Button>
                    </td>
                  </tr>
                ))}

              {campaigns.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="w-full flex items-center justify-center p-10"
                  >
                    <p>Você não salvou nenhuma campanha como rascunho ainda</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}