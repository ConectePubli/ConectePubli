import { useEffect, useState } from "react";
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
import Modal from "@/components/ui/Modal";
import MuxPlayer from "@mux/mux-player-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const playbackId = "xJse18KqR2Lg4P2guixklKkaW84UTwCqs5FnU87QJvU";

  return (
    <div className="p-4">
      <h1 className="font-bold">{t("Minhas Campanhas")}</h1>
      <p className="mt-2">
        {t("Visualize todas as suas campanhas ou crie uma.")}
      </p>

      <div className="w-full flex items-center justify-between gap-4 flex-wrap max-sm:flex-col max-sm:items-stretch max-sm:gap-2">
        <div className="flex items-center gap-4 max-sm:flex-col max-sm:w-full">
          <Button
            className="mt-4 max-sm:w-full"
            variant={"blue"}
            onClick={() => {
              navigate({ to: "/dashboard-marca/criar-campanha/" });
            }}
          >
            <Plus className="mr-2" />
            {t("Criar Campanha")}
          </Button>
          <Button
            className="mt-4 max-sm:w-full"
            variant={"blue"}
            onClick={() => setIsModalOpen(true)}
          >
            {t("Como Criar Campanha")}
          </Button>
        </div>
        {/* Modal */}
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {t("Como Criar Campanha")}
            </h2>
            <div className="flex justify-center items-center">
              {/* Player do Mux */}
              <MuxPlayer
                streamType="on-demand"
                playbackId={playbackId}
                metadataVideoTitle="Como Criar Campanha"
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  borderRadius: "10px",
                }}
              />
            </div>
          </Modal>
        )}
        <Button
          variant={"orange"}
          className="mt-4 ml-auto max-sm:w-full"
          onClick={() => {
            navigate({ to: "/dashboard-marca/rascunhos/" });
          }}
        >
          <File className="w-5 h-5 mr-2" weight="bold" />
          {t("Rascunhos Salvos")}
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
