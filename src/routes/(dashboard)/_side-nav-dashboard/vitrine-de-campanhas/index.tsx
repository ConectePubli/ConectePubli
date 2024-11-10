import { useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import CampaignCard from "@/components/ui/CampaignCard";
import Spinner from "@/components/ui/Spinner";
import { useCampaignStore } from "@/store/useCampaignStore";
import { getUserType } from "@/lib/auth";
import Pagination from "@/components/ui/Pagination";
import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import { ParticipationStatusFilter } from "@/types/Filters";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/vitrine-de-campanhas/"
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({ to: "/login123new" });
    } else if (userType !== "Influencers") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function Page() {
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
  } = useCampaignStore();

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

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">Vitrine de Campanhas</h1>
      <p className="text-gray-700 mb-6">
        Explore todas as campanhas disponíveis e inscreva-se nas que mais
        combinam com o seu perfil.
      </p>

      <BrandCampaignFilter
        showSearch={true}
        showCampaignGoal={true}
        showStatus={false}
        showNiche={true}
        showChannel={true}
      />

      {/* Loading and error states */}
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
          {/* Render filtered campaigns or a message if none are available */}
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-10">
              <p className="text-center text-gray-700 text-base">
                Não há campanhas disponíveis no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  participationStatus={ParticipationStatusFilter.All}
                  fromMyCampaigns={false}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default Page;
