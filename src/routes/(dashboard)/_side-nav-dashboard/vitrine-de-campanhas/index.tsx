import { useEffect, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import CampaignCard from '@/components/ui/CampaignCard';
import Spinner from '@/components/ui/Spinner';
import MultiCampaignFilter from '@/components/ui/MultiCampaignFilter';
import { useCampaignStore } from '@/store/useCampaignStore';
import { getUserType } from '@/lib/auth';
import Pagination from "@/components/ui/Pagination";

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/vitrine-de-campanhas/',
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({ to: '/login123new' });
    } else if (userType !== 'Influencers') {
      throw redirect({ to: '/dashboard' });
    }
  },
});

function Page() {
  const {
    fetchAllCampaigns,
    campaigns,
    isLoading,
    error,
    page,
    totalPages,
    setPage,
  } = useCampaignStore();

  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);

  // Fetch campaigns on load and when `page` changes
  useEffect(() => {
    fetchAllCampaigns();
  }, [fetchAllCampaigns, page]);

  // Update filteredCampaigns whenever campaigns change
  useEffect(() => {
    setFilteredCampaigns(campaigns);
  }, [campaigns]);

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">Vitrine de Campanhas</h1>
      <p className="text-gray-700 mb-6">
        Explore todas as campanhas disponíveis e inscreva-se nas que mais combinam com o seu perfil.
      </p>

      {/* MultiCampaignFilter receives campaigns and updates filteredCampaigns */}
      <MultiCampaignFilter
        campaigns={campaigns}
        onFilter={setFilteredCampaigns}
        showStatusFilter={false}
        showNichoFilter={true}
        showCanalFilter={true}
      />

      {/* Loading and error states */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-10">
          <Spinner />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center my-10">
          <p className="text-center text-red-600">Erro ao carregar campanhas: {error}</p>
        </div>
      ) : (
        <>
          {/* Render filtered campaigns or a message if none are available */}
          {filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-10">
              <p className="text-center text-gray-700 text-base">Não há campanhas disponíveis no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
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
