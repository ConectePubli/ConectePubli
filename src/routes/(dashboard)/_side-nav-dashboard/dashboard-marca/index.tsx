import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import CampaignsTable from "@/components/ui/CampaignsTable";
import { useCampaignStore } from "@/store/useCampaignStore";
import { getUserType } from "@/lib/auth";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import { File } from "phosphor-react";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/"
)({
  component: Page,
  loader: async () => {
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
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ),
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
    resetFilters();
  }, [resetFilters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns, statusFilter, campaignGoalFilter, searchTerm, page]);

  return (
    <div className="p-4">
      <h1 className="font-bold">Minhas Campanhas</h1>
      <p className="mt-2">Visualize todas as suas campanhas ou crie uma.</p>

      <div className="w-full flex items-center justify-between flex-wrap max-sm:flex-col max-sm:items-start max-sm:space-y-3">
        <Button
          className="mt-4"
          variant={"blue"}
          onClick={() => {
            navigate({ to: "/dashboard-marca/criar-campanha/" });
          }}
        >
          <Plus className="mr-2" />
          Criar Campanha
        </Button>

        <Button
          variant={"orange"}
          onClick={() => {
            navigate({ to: "/dashboard-marca/rascunhos/" });
          }}
        >
          <File className="w-5 h-5 mr-2" weight="bold" /> Rascunhos Salvos
        </Button>
      </div>

      <BrandCampaignFilter
        showSearch={true}
        showCampaignGoal={true}
        showStatus={true}
        showNiche={false}
        showChannel={false}
      />

      <div className="mt-6 w-full overflow-x-auto max-w-[90vw] sm-plus:max-w-[calc(95vw)]  lg:max-w-[calc(100dvw)]">
        <CampaignsTable />
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
