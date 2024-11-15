import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import CampaignsTable from "@/components/ui/CampaignsTable";
import { useCampaignStore } from "@/store/useCampaignStore";
import { getUserType } from "@/lib/auth";
import Pagination from "@/components/ui/Pagination";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/",
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
});

function Page() {
  const navigate = useNavigate();

  const {
    fetchCampaigns,
    statusFilter,
    campaignGoalFilter,
    searchTerm,
    page,
    totalPages,
    setPage,
    resetFilters,
  } = useCampaignStore();

  useEffect(() => {
    resetFilters(); // Reset filters when the page mounts
  }, [resetFilters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns, statusFilter, campaignGoalFilter, searchTerm, page]);

  return (
    <div className="p-4">
      <h1 className="font-bold">Minhas Campanhas</h1>
      <p className="mt-2">Visualize todas as suas campanhas ou crie uma.</p>

      <Button
        className="mt-4"
        variant={"blue"}
        onClick={() => {
          navigate({ to: "/dashboard-marca/criar-campanha/" });
        }}
      >
        <Plus className="mr-2" />Criar Campanha
      </Button>

      <BrandCampaignFilter
        showSearch={true}
        showCampaignGoal={true}
        showStatus={true}
        showNiche={false}
        showChannel={false}
      />

      <div className="mt-6 w-full overflow-x-auto max-w-[90vw] sm-plus:max-w-[calc(90vw)] md:max-w-[calc(90vw-12rem)] lg:max-w-[calc(100dvw)]">
        <CampaignsTable />
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}