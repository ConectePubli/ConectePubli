import { useEffect } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import CampaignCard from "@/components/ui/CampaignCard";
import Spinner from "@/components/ui/Spinner";
import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import { getUserType } from "@/lib/auth";
import Pagination from "@/components/ui/Pagination";
import { useCampaignStore } from "@/store/useCampaignStore";
import { ParticipationStatusFilter } from "@/types/Filters";
import { t } from "i18next";

// Route creation
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

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">{t("Minhas Participações")}</h1>
      <p className="text-gray-700 mb-6">
        {t(
          "Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas participações."
        )}
      </p>

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
    </div>
  );
}

export default Page;
