import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import CampaignCard from "@/components/ui/CampaignCard";
import Spinner from "@/components/ui/Spinner";
import { useCampaignStore } from "@/store/useCampaignStore";
import { getUserType } from "@/lib/auth";
import Pagination from "@/components/ui/Pagination";
import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import { ParticipationStatusFilter } from "@/types/Filters";
import Modal from "@/components/ui/Modal";
import MuxPlayer from "@mux/mux-player-react";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/vitrine-de-campanhas/"
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({ to: "/login" });
    } else if (userType !== "Influencers") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    fetchAllCampaigns,
    campaignGoalFilter,
    searchTerm,
    channelFilter,
    nicheFilter,
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
    fetchAllCampaigns();
  }, [
    fetchAllCampaigns,
    campaignGoalFilter,
    searchTerm,
    channelFilter,
    nicheFilter,
    page,
  ]);

  const playbackId = "b2lSswNJbalguc1RtbKfQIm7MlvrTPaO6B38T3e69xA";

  return (
    <div className="mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Vitrine de Campanhas</h1>

        {/* Botão de vídeo */}
        <button
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#10438F] rounded-md hover:bg-[#093474] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10438F]"
          onClick={() => setIsModalOpen(true)}
        >
          Como se Candidatar em Campanhas
        </button>
      </div>
      <p className="text-gray-700 mb-6">
        Explore todas as campanhas disponíveis e inscreva-se nas que mais
        combinam com o seu perfil.
      </p>

      {/* Modal com vídeo */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Como se Candidatar em Campanhas
          </h2>
          <div className="flex justify-center items-center">
            <MuxPlayer
              streamType="on-demand"
              playbackId={playbackId}
              metadataVideoTitle="Como Funciona"
              style={{
                width: "100%",
                maxHeight: "500px",
                borderRadius: "10px",
              }}
            />
          </div>
        </Modal>
      )}

      {/* Filtro de campanhas */}
      <BrandCampaignFilter
        showSearch={true}
        showCampaignGoal={true}
        showStatus={false}
        showNiche={true}
        showChannel={true}
      />

      {/* Loading e estados de erro */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-10">
          <Spinner />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center my-10">
          <p className="text-center text-red-600">
            Erro ao carregar campanhas: {error}
          </p>
        </div>
      ) : (
        <>
          {/* Renderização de campanhas ou mensagem de ausência */}
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-10">
              <p className="text-center text-gray-700 text-base">
                Não há campanhas disponíveis no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                return (
                  <CampaignCard
                    key={campaign.id}
                    campaignData={campaign}
                    participationStatus={ParticipationStatusFilter.All}
                    fromMyCampaigns={false}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Paginação */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default Page;
