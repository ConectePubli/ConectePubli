import {
  createFileRoute,
  notFound,
  redirect,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { ClientResponseError } from "pocketbase";
import GoBack from "@/assets/icons/go-back.svg";
import CampaignRequirements from "@/components/ui/CampaignRequirements";
import CampaignVideoCharacteristics from "@/components/ui/CampaignVideoCharacteristics";
import CampaignDetails from "@/components/ui/CampaignDetails";
import CampaignBrandProfile from "@/components/ui/CampaignBrandProfile";
import { getUserType } from "@/lib/auth";
import useIndividualCampaignStore from "@/store/useIndividualCampaignStore";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/"
)({
  component: CampaignPage,
  errorComponent: () => (
    <div>
      Ocorreu um erro ao carregar a página. Por favor, tente novamente mais
      tarde.
    </div>
  ),
  notFoundComponent: () => (
    <div className="px-4 py-4 h-full min-w-100 flex items-center justify-center text-center">
      <p>
        A campanha que você estava procurando ainda não iniciou, foi encerrada
        ou removida.
      </p>
    </div>
  ),
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login123new",
      });
    }
  },
  loader: async ({ params: { campaignId } }) => {
    try {
      const campaignData = await pb
        .collection<Campaign>("campaigns")
        .getFirstListItem<Campaign>(
          `unique_name="${campaignId}" && paid=true`,
          {
            expand: "niche, brand",
          }
        );

      if (!campaignData) {
        throw notFound();
      }

      const campaignParticipationsData = await pb
        .collection<CampaignParticipation>("Campaigns_Participations")
        .getFullList({
          filter: `campaign="${campaignData.id}"`,
          expand: "Campaign,Influencer",
        });

      return { campaignData, campaignParticipationsData };
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        throw notFound();
      }
      console.error("Error fetching data:", error);
      throw error;
    }
  },
});

function CampaignPage() {
  const loaderData = useLoaderData({
    from: Route.id,
  }) as {
    campaignData: Campaign;
    campaignParticipationsData: CampaignParticipation[];
  };
  const { campaignData, campaignParticipationsData } = loaderData;

  const navigate = useNavigate();
  const {
    campaign = campaignData,
    setCampaign,
    setCampaignParticipations,
    calculateOpenJobs,
  } = useIndividualCampaignStore();

  useEffect(() => {
    setCampaign(campaignData);
    setCampaignParticipations(campaignParticipationsData);
    calculateOpenJobs();
  }, [
    calculateOpenJobs,
    campaignData,
    campaignParticipationsData,
    setCampaign,
    setCampaignParticipations,
  ]);

  return (
    <div className="container mx-auto p-4 ">
      <div
        className="flex items-center gap-1"
        onClick={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            navigate({ to: "/dashboard" });
          }
        }}
      >
        <button className="bg-white p-2 rounded-full">
          <img src={GoBack} alt="Go Back" className="w-5 h-5" />
        </button>
        <button className="text-black/75 font-semibold">Voltar</button>
      </div>
      <div className="text-center xl:text-left">
        <h1 className="text-lg xl:text-2xl font-bold">{campaign?.name}</h1>
      </div>

      <div className="grid xl:grid-cols-2 xl:gap-4 mt-4">
        {/* Coluna esquerda - Tipo e Inscrição */}
        <div className="space-y-4">
          <CampaignDetails />

          {/* Informações da Marca - Desktop */}
          <div className="hidden xl:block mt-4">
            <CampaignBrandProfile />
          </div>
        </div>

        {/* Coluna direita - Detalhes, Requisitos e Características */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-lg border max-xl:mt-4">
            <h2 className="font-bold mt-2">Briefing da Campanha</h2>
            <p className="text-black break-words">{campaign?.briefing}</p>

            <h2 className="font-bold mt-2">Entregavéis obrigatórios</h2>
            <p className="text-black break-words">
              {campaign?.mandatory_deliverables}
            </p>

            <h2 className="font-bold mt-2 ">Envio de Produtos ou Serviços</h2>
            <p className="text-black break-words">
              {campaign?.sending_products_or_services}
            </p>

            <h2 className="font-bold mt-2">
              Ações Esperadas do Creator (Do's)
            </h2>
            <p className="text-black break-words">
              {campaign?.expected_actions}
            </p>

            <h2 className="font-bold mt-2">Ações a Serem Evitadas (Don'ts)</h2>
            <p className="text-black break-words">{campaign?.avoid_actions}</p>

            <h2 className="font-bold mt-2">Informações adicionais</h2>
            <p className="text-black break-words">
              {campaign?.additional_information}
            </p>

            {campaign?.itinerary_suggestion && (
              <>
                <h2 className="font-bold mt-2">Sugestão de roteiro</h2>
                <p className="text-black break-words">
                  {campaign?.itinerary_suggestion}
                </p>
              </>
            )}

            {/* External Link */}
            {campaign?.product_url && (
              <p className="mt-4 flex flex-wrap gap-2 font-medium">
                Link Relevante da Campanha:
                <a
                  href={campaign?.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {campaign?.product_url}
                </a>
              </p>
            )}

            {/* Warning Message */}
            <p className="text-yellow-600 font-semibold mt-4">
              Atenção: Todas as interações e pagamentos desta campanha estão
              protegidos pelo nosso sistema de garantia. Evite contato fora da
              plataforma para garantir sua segurança e o pagamento integral.
            </p>
          </div>

          <CampaignRequirements />

          <CampaignVideoCharacteristics />

          <div className="bg-white p-4 rounded-lg shadow-lg border max-xl:mt-4">
            {/* Compartilhamento nas redes sociais */}
            <h2 className="font-bold mb-2">Trafego da Campanha</h2>

            {!campaign?.paid_traffic && (
              <p className="text-black">
                Compartilhado nas redes sociais da marca de forma orgânica
              </p>
            )}

            {campaign?.paid_traffic && (
              <p className="text-black">
                Compartilhado nas redes sociais da marca com tráfego pago
              </p>
            )}
          </div>

          <div className="xl:hidden mt-4">
            <CampaignBrandProfile />
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

export default CampaignPage;
