import { useState, useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import CampaignCard from "@/components/ui/CampaignCard";
import Spinner from "@/components/ui/Spinner";
import BrandCampaignFilter from "@/components/ui/BrandCampaignFilter";
import { getUserType } from "@/lib/auth";
import Pagination from "@/components/ui/Pagination";
import { useCampaignStore } from "@/store/useCampaignStore";

// Route creation
export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-influenciador/",
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login123new",
      });
    } else if (userType !== "Influencers") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function Page() {
  const {
    fetchParticipatingCampaigns,
    campaignGoalFilter,
    searchTerm,
    campaigns,
    isLoading,
    error,
    page,
    totalPages,
    setPage,
  } = useCampaignStore();

  useEffect(() => {
    fetchParticipatingCampaigns();
  }, [fetchParticipatingCampaigns, campaignGoalFilter, searchTerm, page]);

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">Minhas Participações</h1>
      <p className="text-gray-700 mb-6">
        Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas
        participações.
      </p>

      <BrandCampaignFilter
        showSearch={true}
        showCampaignGoal={true}
        showStatus={false}
        showNiche={false}
        showChannel={false}
      />

      {/* Conditional rendering based on loading and campaign length */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-10">
          <Spinner />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : error ? (
          <p className="text-red-500">
            {error}
          </p>
      ) : (
        <>
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-10">
              <p className="text-center text-gray-700 text-base">
                Você ainda não se inscreveu em nenhuma campanha. Navegue pelas
                campanhas disponíveis e comece a participar agora mesmo!
              </p>
              <button
                onClick={() => {
                  console.log("to do");
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Explorar Campanhas
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} participationStatus={campaign.participantStatus} fromMyCampaigns={true} />
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
