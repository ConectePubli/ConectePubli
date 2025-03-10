// EditCampaignPage.tsx

import {
  createFileRoute,
  notFound,
  useLoaderData,
  redirect,
} from "@tanstack/react-router";
import { CampaignForm } from "@/components/ui/CampaignForm";
import pb from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import { t } from "i18next";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/editar"
)({
  loader: async ({ params: { campaignId } }) => {
    try {
      const campaignData = await pb
        .collection("Campaigns")
        .getFirstListItem(`id="${campaignId}"`);

      const campaignParticipations = await pb
        .collection("Campaigns_Participations")
        .getFullList({
          filter: `campaign="${campaignId}"`,
        });

      if (campaignParticipations.length >= 1) {
        throw redirect({ to: "/dashboard" });
      }

      const currentBrandId = pb.authStore.model?.id;
      if (!currentBrandId) {
        throw redirect({ to: "/login" });
      }

      if (!campaignData) {
        throw notFound();
      }

      if (campaignData.brand !== currentBrandId) {
        throw redirect({ to: "/dashboard" });
      }

      return { campaignData };
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return { error: "not_found" };
      }
      console.error("Error fetching campaign data:", error);
      throw error;
    }
  },
  component: Page,
  errorComponent: () => (
    <div>
      {t("Ocorreu um erro ao carregar essa página. Não se preocupe, estamos trabalhando para resolvê-lo!")}
    </div>
  ),
  notFoundComponent: () => <div>{t("Campanha não encontrada")}</div>,
});

function Page() {
  const { campaignData, error } = useLoaderData({ from: Route.id });

  if (error === "not_found") {
    return <div>{t("Campanha não encontrada")}</div>;
  }

  return (
    <div>
      <CampaignForm
        campaignId={campaignData.id}
        initialCampaignData={campaignData}
      />
    </div>
  );
}
