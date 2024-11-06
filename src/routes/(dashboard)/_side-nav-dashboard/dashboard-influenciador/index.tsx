import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import CampaignCard from '@/components/ui/CampaignCard';
import Spinner from '@/components/ui/Spinner';
import { CampaignParticipation } from '@/types/Campaign_Participations';
import { Campaign } from '@/types/Campaign';
import pb from '@/lib/pb';
import { UserAuth } from '@/types/UserAuth';
import MultiCampaignFilter from '@/components/ui/MultiCampaignFilter';
import { getUserType } from '@/lib/auth';

// Route creation
export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard-influenciador/'
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: '/login123new',
      });
    } else if (userType !== 'Influencers') {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
});

function Page() {
  const [campaigns, setCampaigns] = useState<CampaignParticipation[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignParticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch campaigns from API
  const fetchCampaignParticipations = async () => {
    setIsLoading(true);

    const user: UserAuth = JSON.parse(
      localStorage.getItem('pocketbase_auth') as string
    );

    const records = await pb
      .collection('Campaigns_Participations')
      .getFullList<CampaignParticipation>({
        filter: `Influencer="${user.model.id}"`,
        expand: 'Campaign,Influencer',
      });

    setCampaigns(records);
    setIsLoading(false);
  };

  // Mutation to trigger the fetch function
  const { mutate: getCampaigns } = useMutation({
    mutationFn: async () => {
      await fetchCampaignParticipations();
    },
    onError: () => {
      setCampaigns([]);
      setIsLoading(false);
    },
  });

  // Run the fetch function once on mount
  useEffect(() => {
    getCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize the transformed campaigns array to avoid recreating it on every render
  const transformedCampaigns = useMemo(() => {
    return campaigns.map((participation) => ({
      ...participation.expand.Campaign,
      participantStatus: participation.status, // Add participant status
    }));
  }, [campaigns]);

  // Memoize the onFilter function to avoid recreating it on every render
  const handleFilter = useCallback(
    (filteredCampaigns) => {
      setFilteredCampaigns(
        campaigns.filter((participation) =>
          filteredCampaigns.some((fc) => fc.id === (participation.expand.Campaign as Campaign).id)
        )
      );
    },
    [campaigns]
  );

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">Minhas Participações</h1>
      <p className="text-gray-700 mb-6">
        Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas
        participações.
      </p>

      {/* Pass memoized data and functions to MultiCampaignFilter */}
      <MultiCampaignFilter
        campaigns={transformedCampaigns} // Use memoized campaigns
        onFilter={handleFilter}          // Use memoized onFilter function
        showStatusFilter={true}
        showNichoFilter={false}
        showCanalFilter={false}
      />

      {/* Conditional rendering based on loading and campaign length */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-10">
          <Spinner />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : (
        <>
          {filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-10">
              <p className="text-center text-gray-700 text-base">
                Você ainda não se inscreveu em nenhuma campanha. Navegue pelas
                campanhas disponíveis e comece a participar agora mesmo!
              </p>
              <button
                onClick={() => {
                  console.log('to do');
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Explorar Campanhas
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((participation) => (
                <CampaignCard
                  key={participation.id}
                  campaign={participation.expand.Campaign as Campaign}
                  participationStatus={participation.status}
                  fromMyCampaigns={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
