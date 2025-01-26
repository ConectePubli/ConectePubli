import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Plus, Workflow } from "lucide-react";
import { File } from "phosphor-react";
import { useTranslation } from "react-i18next";

import ProfilePlaceholder from "@/assets/profile-placeholder.webp";

import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import CampaignsTable from "@/components/ui/CampaignsTable";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

import { Deliverables } from "@/types/Deliverables";

import { useCampaignStore } from "@/store/useCampaignStore";
import { getUserType } from "@/lib/auth";
import { getBrandDeliverables, returnStatus } from "@/services/deliverables";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";

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
  const playbackId = "OtAqjPz6J5oR7lVldgjVhBmlmxWIHiomTc0100mfUMGSc";

  const [isModalDeliverableOpen, setModalDeliverableOpen] = useState(false);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
  const [deliverables, setDeliverables] = useState<Deliverables[]>([]);

  const openDeliverableModal = async () => {
    setModalDeliverableOpen(true);

    try {
      const data = await getBrandDeliverables(setLoadingDeliverables);
      setDeliverables(data);
    } catch (e) {
      console.log(`error processing modal deliverable info: ${e}`);
    }
  };

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
        <div className="space-x-3 max-sm:space-x-0">
          <Button
            variant={"orange"}
            className="mt-4 ml-auto max-sm:w-full "
            onClick={() => {
              openDeliverableModal();
            }}
          >
            <Workflow className="w-5 h-5 mr-2 max-sm:mr-0" />
            {t("Visualizar Entregáveis")}
          </Button>

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

      {isModalDeliverableOpen && (
        <Modal onClose={() => setModalDeliverableOpen(false)}>
          <div className="p-6 max-sm:p-1">
            <h2 className="text-xl font-bold mb-2">{t("Seus Entregáveis")}</h2>
            <p className="text-gray-700 mb-6">
              {t("Aqui estão todos os entregáveis que foram criados por você")}:
            </p>

            {loadingDeliverables && (
              <div className="flex items-center justify-center mt-10 w-full">
                <Spinner />
              </div>
            )}

            {!loadingDeliverables && (
              <>
                {deliverables.length === 0 && (
                  <div className="text-center text-gray-700">
                    <p>
                      {t(
                        "Nenhuma proposta de entregavéis foi criada até o momento"
                      )}
                    </p>

                    <div className="w-full flex justify-center mt-5">
                      <Button
                        variant={"blue"}
                        onClick={() => {
                          navigate({ to: "/vitrine-de-creators" });
                        }}
                      >
                        {t("Vitrine de Creators")}
                      </Button>
                    </div>
                  </div>
                )}

                {deliverables.length >= 1 &&
                  deliverables.map((deliverable) => {
                    return (
                      <div className="border border-gray-300 rounded-lg p-4 mb-5">
                        <div className="flex items-center mb-1">
                          <img
                            src={
                              deliverable.expand.influencer.profile_img
                                ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${deliverable.expand.influencer.collectionName}/${deliverable.expand.influencer.id}/${deliverable.expand.influencer.profile_img}`
                                : ProfilePlaceholder
                            }
                            alt="avatar"
                            draggable={false}
                            className="w-10 h-10 mr-2 rounded-md object-cover"
                          />

                          <h3 className="font-semibold text-lg">
                            {deliverable.expand.influencer.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between max-sm:flex-col">
                          <span className="text-blue-500 font-semibold">
                            {formatCentsToCurrency(deliverable.total_price)}
                          </span>
                          <span className="text-gray-500 max-sm:flex max-sm:w-full max-sm:align-start">
                            Status:{" "}
                            <span className="font-semibold max-sm:ml-2">
                              {returnStatus(
                                deliverable.status,
                                deliverable.paid,
                                true
                              )}
                            </span>
                          </span>
                        </div>

                        <Button
                          variant="blue"
                          className="mt-4"
                          onClick={() => {
                            navigate({ to: `/entregaveis/${deliverable.id}` });
                          }}
                        >
                          {t("Visualizar")}
                        </Button>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
