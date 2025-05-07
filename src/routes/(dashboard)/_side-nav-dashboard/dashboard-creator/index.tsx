import { useEffect, useState } from "react";
import {
  createFileRoute,
  redirect,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { t } from "i18next";

import ProfilePlaceholder from "@/assets/profile-placeholder.webp";

import { ParticipationStatusFilter } from "@/types/Filters";
import { Deliverables } from "@/types/Deliverables";

import CampaignCard from "@/components/ui/CampaignCard";
import Spinner from "@/components/ui/Spinner";
import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import SponsorBanner from "@/components/ui/SponsorBanner";
import SuccessRegistrationDialog from "@/components/ui/SuccessRegistrationDialog";
import { Button } from "@/components/ui/button";

import { getUserType } from "@/lib/auth";
import { getCreatorDeliverables, returnStatus } from "@/services/deliverables";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";
import { useCampaignStore } from "@/store/useCampaignStore";
import { HandCoins } from "lucide-react";
import pb from "@/lib/pb";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-creator/"
)({
  component: Page,
  loader: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    } else if (userType !== "Influencers") {
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
  const { recentRegister } = useSearch({
    from: "/(dashboard)/_side-nav-dashboard/dashboard-creator/",
  });

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (recentRegister) {
      setIsSuccessDialogOpen(true);
    }
  }, [recentRegister]);

  const {
    fetchParticipatingCampaigns,
    campaignGoalFilter,
    searchTerm,
    participationStatusFilter,
    campaigns,
    isLoading,
    error,
    page,
    totalPages,
    setPage,
    resetFilters,
  } = useCampaignStore();

  useEffect(() => {
    resetFilters(); // Reset filters when the page mounts
  }, [resetFilters]);

  useEffect(() => {
    fetchParticipatingCampaigns();
  }, [
    fetchParticipatingCampaigns,
    campaignGoalFilter,
    searchTerm,
    participationStatusFilter,
    page,
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
  const [deliverables, setDeliverables] = useState<Deliverables[]>([]);

  const openDeliverableModal = async () => {
    setModalOpen(true);

    try {
      const data = await getCreatorDeliverables(setLoadingDeliverables);
      setDeliverables(data);
    } catch (e) {
      console.log(`error processing modal deliverable info: ${e}`);
    }
  };

  return (
    <div>
      <SponsorBanner />

      <SuccessRegistrationDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        redirectPath={`/creator/${pb.authStore.model?.username}/editar`}
      />

      <div className="mx-auto py-6 px-4">
        <div className="flex items-center justify-between w-full max-sm:flex-col">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t("Minhas Participações")}
            </h1>
            <p className="text-gray-700 mb-6">
              {t(
                "Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas participações."
              )}
            </p>
          </div>

          <Button
            variant={"blue"}
            onClick={openDeliverableModal}
            className="max-sm:w-full max-sm:flex max-sm:align-start"
          >
            {t("Ver meus Entregavéis")}
          </Button>
        </div>

        <BrandCampaignFilter
          showSearch={true}
          showCampaignGoal={true}
          showStatus={false}
          showParticipationStatus={true}
          showNiche={false}
          showChannel={false}
        />

        {/* Conditional rendering based on loading and campaign length */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center my-10">
            <Spinner />
            <p className="mt-2 text-gray-600">{t("Carregando...")}</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-10">
                <p className="text-center text-gray-700 text-base">
                  {t(
                    "Você ainda não se inscreveu em nenhuma campanha. Navegue pelas campanhas disponíveis e comece a participar agora mesmo!"
                  )}
                </p>
                <button
                  onClick={() => {
                    navigate({ to: "/vitrine-de-campanhas" });
                  }}
                  className="mt-4 px-4 py-2 bg-[#FF672F] text-white rounded font-semibold"
                >
                  {t("Explorar Campanhas")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaignData={campaign}
                    participationStatus={
                      campaign.participationStatus ??
                      ParticipationStatusFilter.All
                    }
                    hideStatusSubscription={true}
                    fromMyCampaigns={true}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />

        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <div className="p-6 max-sm:p-1">
              <h2 className="text-xl font-bold mb-2">
                {t("Seus Entregáveis")}
              </h2>
              <p className="text-gray-700 mb-6">
                {t(
                  "Aqui estão todos os entregáveis que foram enviados para você"
                )}
                :
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
                      <p>{t("Nenhuma proposta de entregavéis no momento")}</p>
                    </div>
                  )}

                  {deliverables.length >= 1 &&
                    deliverables.map((deliverable) => {
                      return (
                        <div className="border border-gray-300 rounded-lg p-4 shadow-sm mb-4">
                          <div className="flex items-center mb-1">
                            <img
                              src={
                                deliverable.expand.brand.profile_img
                                  ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${deliverable.expand.brand.collectionName}/${deliverable.expand.brand.id}/${deliverable.expand.brand.profile_img}`
                                  : ProfilePlaceholder
                              }
                              alt="avatar"
                              draggable={false}
                              className="w-10 h-10 mr-2 rounded-md object-cover"
                            />

                            <h3 className="font-semibold text-lg">
                              {deliverable.expand.brand.name}
                            </h3>
                          </div>
                          <p className="text-gray-700 mb-4">
                            {deliverable.description &&
                            deliverable.description.length > 200
                              ? `${deliverable.description.slice(0, 200)}...`
                              : deliverable.description}
                          </p>
                          <div className="flex items-center justify-between max-sm:flex-col">
                            <span className="text-blue-500 font-semibold flex items-center">
                              <HandCoins size={20} className="mr-2" />{" "}
                              {formatCentsToCurrency(deliverable.total_price)}
                            </span>
                            <span className="text-gray-500 max-sm:flex max-sm:w-full max-sm:align-start">
                              Status:{" "}
                              <span className="font-semibold max-sm:ml-2">
                                {returnStatus(
                                  deliverable.status,
                                  deliverable.paid
                                )}
                              </span>
                            </span>
                          </div>

                          <Button
                            variant="blue"
                            className="mt-4"
                            onClick={() => {
                              navigate({
                                to: `/entregaveis/${deliverable.id}`,
                              });
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
    </div>
  );
}

export default Page;
