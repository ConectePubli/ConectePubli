import { createFileRoute, notFound, useLoaderData, redirect } from '@tanstack/react-router';
import { CampaignForm } from '@/components/ui/CampaignForm';
import pb from '@/lib/pb'; // assuming you have PocketBase set up here
import { ClientResponseError } from 'pocketbase';

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/editar',
)({
  loader: async ({ params: { campaignId } }) => {
    try {
      // Fetch campaign data by campaignId from PocketBase
      const campaignData = await pb.collection('campaigns').getFirstListItem(`id="${campaignId}"`);

      // Fetch the authenticated user's brand ID
      const currentBrandId = pb.authStore.model?.id;
      if (!currentBrandId) {
        throw redirect({ to: '/login123new' }); // Redirect if not authenticated
      }

      // If no campaign data is found, throw a 404 error
      if (!campaignData) {
        throw notFound();
      }

      // Check if the current brand owns this campaign
      if (campaignData.brand !== currentBrandId) {
        throw redirect({ to: '/dashboard' }); // Redirect if brand ID doesn't match
      }

      return { campaignData };
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return { error: 'not_found' };
      }
      console.error('Error fetching campaign data:', error);
      throw error;
    }
  },
  component: () => {
    // Use data loaded from the loader function
    const { campaignData, error } = useLoaderData({ from: Route.id });

    // If there's a not_found error, show a not found message
    if (error === 'not_found') {
      return <div>Campanha não encontrada</div>;
    }

    // Render the CampaignForm component, passing the `isEditMode` flag
    return (
      <div>
         <CampaignForm
           campaignId={campaignData.id}
           initialCampaignData={campaignData}
           isEditMode={true}
         />
      </div>
    );
  },
  errorComponent: () => (
    <div>
      Ocorreu um erro ao carregar essa página. Não se preocupe, estamos trabalhando para resolvê-lo!
    </div>
  ),
  notFoundComponent: () => <div>Campanha não encontrada</div>,
});
