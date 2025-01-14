/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, redirect, useMatch } from "@tanstack/react-router";
import { CampaignForm } from "@/components/ui/CampaignForm";

import { getUserType } from "@/lib/auth";

import { useEffect, useState } from "react";

import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import Spinner from "@/components/ui/Spinner";
import { t } from "i18next";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/criar-campanha/"
)({
  component: function CampaignRouteComponent() {
    const match = useMatch(Route.id as any);
    const campaignIdFromURL = match.search?.campaign_id || null;
    const isDraftFromURL = match.search?.is_draft === true;

    const [campaignData, setCampaignData] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchCampaign = async () => {
        if (!campaignIdFromURL) {
          setCampaignData(null);
          setIsLoading(false);
          return;
        }

        try {
          const record = await pb
            .collection("Campaigns")
            .getOne(campaignIdFromURL as string);

          if (isDraftFromURL && record.status !== "draft") {
            throw new Error(t("A campanha não está marcada como rascunho."));
          }

          if (!isDraftFromURL && record.status === "draft") {
            throw new Error(t("A campanha está marcada como rascunho."));
          }

          setCampaignData(record as unknown as Campaign);

          if (isDraftFromURL) {
            const url = new URL(window.location.href);
            url.searchParams.delete("campaign_id");
            url.searchParams.delete("is_draft");
            window.history.replaceState(
              {},
              "",
              url.pathname + url.search + url.hash
            );
          }

          setError(null);
        } catch (err: any) {
          console.error(err);
          setError(err.message || t("Erro ao buscar a campanha."));
          setCampaignData(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCampaign();
    }, [campaignIdFromURL, isDraftFromURL]);

    if (isLoading) {
      return (
        <div className="p-10 flex flex-col items-center justify-center w-full">
          <Spinner />
          <p className="text-center mt-2">{t("Carregando dados da campanha...")}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-10 flex flex-col items-center justify-center w-full">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      );
    }

    return (
      <CampaignForm
        initialCampaignData={campaignData as Campaign}
        campaignIdDraft={campaignData?.id}
      />
    );
  },

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
});
