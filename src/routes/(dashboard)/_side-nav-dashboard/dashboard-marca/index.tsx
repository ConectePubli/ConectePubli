import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import FilterSection from "@/components/ui/FilterSectionCampaign";
import CampaignsTable from "@/components/ui/CampaignsTable";
import { useCampaignStore } from "@/store/useCampaignStore";
import { getUserType } from "@/lib/auth";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/"
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
  const {
    fetchCampaigns,
    statusFilter,
    campaignGoalFilter,
    searchTerm,
    page,
    totalPages,
    setPage,
  } = useCampaignStore();

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
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
          console.log("IR PARA TELA DE CRIAR CAMPANHA");
        }}
      >
        <Plus className="mr-2" /> Criar Campanha
      </Button>

      <FilterSection />

      <div className="mt-6 w-full overflow-x-auto max-w-[90dvw]">
        <CampaignsTable />
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1 || page === 0}
          className={`flex items-center px-4 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-[#10438F] text-white"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>
        <div className="flex items-center flex-row gap-1">
          <p className="hidden sm-plus:block">Página </p>
          <span>
            {totalPages === 0 ? 0 : page} de {totalPages}
          </span>
        </div>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages || page === 0 || totalPages === 0}
          className={`flex items-center px-4 py-2 rounded-lg ${
            page === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-[#10438F] text-white"
          }`}
        >
          Próxima
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
