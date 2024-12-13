import {
  createFileRoute,
  notFound,
  redirect,
  useLoaderData,
  useNavigate,
  useSearch,
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
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import RateBrandModal from "@/components/ui/RateBrandModal";
import { Influencer } from "@/types/Influencer";
import { Brand } from "@/types/Brand";
import FormattedText from "@/utils/FormattedText";
import RatePlatformModal from "@/components/ui/RatePlatformModal";
import Spinner from "@/components/ui/Spinner";

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
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
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
          `unique_name="${campaignId}" && status != "draft"`,
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

  const { rateBrand, rateConecte } = useSearch({ from: Route.id });
  const [modalType, setModalType] = useState<string | null>(null);
  const [hasRatedBrand, setHasRatedBrand] = useState(true);
  const [hasRatedPlatform, setHasRatedPlatform] = useState(true);

  useEffect(() => {
    const checkBrandRating = async () => {
      const influencerId = pb.authStore.model?.id;
      if (!influencerId) return;

      const participation = campaignParticipationsData.find(
        (p) => p.influencer === pb.authStore.model?.id
      );

      if (participation?.status !== "completed") {
        return;
      }

      try {
        await pb
          .collection("ratings")
          .getFirstListItem(
            `(from_influencer="${influencerId}" && to_brand="${campaignData.brand}" && campaign="${campaignData.id}")`
          );
        // Caso encontre, o influenciador já avaliou a marca
        setHasRatedBrand(true);
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 404) {
          // Não encontrou avaliação, então o influenciador não avaliou a marca
          setHasRatedBrand(false);
        } else {
          console.error("Erro ao verificar avaliação da marca:", error);
          toast.error("Ocorreu um erro ao verificar sua avaliação da marca.");
        }
      }
    };

    if (rateBrand) {
      checkBrandRating();
    }
  }, [
    rateBrand,
    campaignData.brand,
    campaignParticipationsData,
    campaignData.id,
  ]);

  useEffect(() => {
    if (rateBrand && !hasRatedBrand) {
      setModalType("rateBrand");
    }
  }, [rateBrand, hasRatedBrand]);

  useEffect(() => {
    const checkPlatformRating = async () => {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      try {
        const hasFinishedCampaign = campaignParticipationsData.some(
          (p) => p.influencer === userId && p.status === "completed"
        );
        if (!hasFinishedCampaign) {
          return;
        }
        const hasRating = await pb
          .collection("ratings")
          .getFirstListItem(
            `(from_influencer="${userId}" || from_brand="${userId}") && to_influencer=NULL && to_brand=NULL && campaign="${campaignData.id}"`
          );
        if (hasRating) {
          setHasRatedPlatform(true);
        }
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 404) {
          // Nenhum rating encontrado, o usuário nunca avaliou a plataforma
          setHasRatedPlatform(false);
        } else {
          console.error("Erro ao verificar avaliação da plataforma:", error);
          toast.error(
            "Ocorreu um erro ao verificar sua avaliação da plataforma."
          );
        }
      }
    };

    if (rateConecte && pb.authStore.model?.collectionName !== "Brands") {
      checkPlatformRating();
    }
  }, [campaignData.id, campaignParticipationsData, rateConecte]);

  useEffect(() => {
    if (rateConecte && !hasRatedPlatform) {
      setModalType("ratePlatform");
    }
  }, [rateConecte, hasRatedPlatform]);

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
            <h2 className="font-bold mt-4">Briefing da Campanha</h2>
            <FormattedText text={campaign?.briefing || ""} />

            <h2 className="font-bold mt-4">Entregavéis obrigatórios</h2>
            <FormattedText text={campaign?.mandatory_deliverables || ""} />

            <h2 className="font-bold mt-4">Envio de Produtos ou Serviços</h2>
            <FormattedText
              text={campaign?.sending_products_or_services || ""}
            />

            <h2 className="font-bold mt-4">
              Ações Esperadas do Creator (Do's)
            </h2>
            <FormattedText text={campaign?.expected_actions || ""} />

            <h2 className="font-bold mt-4">Ações a Serem Evitadas (Don'ts)</h2>
            <FormattedText text={campaign?.avoid_actions || ""} />

            <h2 className="font-bold mt-4">Informações adicionais</h2>
            <FormattedText text={campaign?.additional_information || ""} />

            {campaign?.itinerary_suggestion && (
              <>
                <h2 className="font-bold mt-4">Sugestão de roteiro</h2>
                <FormattedText text={campaign?.itinerary_suggestion || ""} />
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
      {modalType === "rateBrand" && (
        <RateBrandModal
          participant={pb.authStore.model as Influencer}
          brand={campaign?.expand?.brand as Brand}
          campaign={campaignData}
          setModalType={setModalType}
        />
      )}
      {modalType === "ratePlatform" && (
        <RatePlatformModal
          setModalType={setModalType}
          campaign={campaignData}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default CampaignPage;
