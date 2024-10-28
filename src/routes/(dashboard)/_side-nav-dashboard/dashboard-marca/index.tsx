import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import FilterSection from "@/components/ui/FilterSectionCampaign";
import CampaignsTable from "@/components/ui/CampaignsTable";
import { useCampaignStore } from "@/store/useCampaignStore";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/"
)({
  component: Page,
});

function Page() {
  const { fetchCampaigns, statusFilter, campaignGoalFilter, searchTerm, page } =
    useCampaignStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns, statusFilter, campaignGoalFilter, searchTerm, page]);

  return (
    <div>
      <h1 className="font-bold">Minhas Campanhas</h1>
      <p className="mt-2">Visualize todas as suas campanhas ou crie uma.</p>

      <Button
        className="mt-4"
        variant={"blue"}
        onClick={() => {
          console.log("IR PARA TELA DE CRIAR CAMPANHA");
        }}
      >
        <Plus className="mr-2" /> Criar Campanha
      </Button>

      <FilterSection />

      <div className="mt-6 w-full overflow-x-auto max-w-[90dvw]">
        <CampaignsTable />
      </div>
    </div>
  );
}
