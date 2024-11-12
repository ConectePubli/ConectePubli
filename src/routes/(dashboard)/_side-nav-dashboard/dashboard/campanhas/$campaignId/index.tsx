import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import pb from "@/lib/pb";
import { Campaign } from "@/types/Campaign";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { ClientResponseError } from "pocketbase";
import { timeAgo } from "@/utils/timeAgo";
import GoBack from "@/assets/icons/go-back.svg";
import { formatLocation } from "@/utils/formatLocation";
import CampaignRequirements from "@/components/ui/CampaignRequirements";
import CampaignVideoCharacteristics from "@/components/ui/CampaignVideoCharacteristics";
import CampaignDetails from "@/components/ui/CampaignDetails";
import CampaignBrandProfile from "@/components/ui/CampaignBrandProfile";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/"
)({
  component: CampaignPage,
  loader: async ({ params: { campaignId } }) => {
    try {
      const campaignData = await pb
        .collection<Campaign>("campaigns")
        .getFirstListItem<Campaign>(`unique_name="${campaignId}"`, {
          expand: "niche, brand",
        });

      console.log("aaa", campaignData);

      const campaignParticipationsData = await pb
        .collection<CampaignParticipation>("Campaigns_Participations")
        .getFullList({
          filter: `campaign="${campaignData.id}"`,
          expand: "Campaign,Influencer",
        });

      console.log("bbb", campaignParticipationsData);

      return { campaignData, campaignParticipationsData };
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 404) {
          return { error: "not_found" };
        }
      }
      console.error("Error fetching data:", error);
      throw error;
    }
  },
});

function CampaignPage() {
  const { campaignData, campaignParticipationsData } = useLoaderData({
    from: Route.id,
  });
  const navigate = useNavigate();

  if (!campaignData) {
    return <div>Carregando dados da campanha...</div>;
  }

  const campaign = campaignData as Campaign;
  const campaignParticipations =
    campaignParticipationsData as CampaignParticipation[];

  const calculateOpenJobs = (
    campaign: Campaign,
    participations: CampaignParticipation[]
  ): Campaign => {
    let ocupadas = 0;

    participations.forEach((participation) => {
      if (
        participation.status === "waiting" ||
        participation.status === "approved"
      ) {
        ocupadas += 1;
      }
    });

    const vagasRestantes = (campaign.open_jobs || 0) - ocupadas;
    return {
      ...campaign,
      vagasRestantes: vagasRestantes >= 0 ? vagasRestantes : 0,
    };
  };

  const campaignWithOpenJobs = calculateOpenJobs(
    campaign,
    campaignParticipations
  );

  const genderMap = {
    male: "Masculino",
    female: "Feminino",
    non_binary: "Não-binário",
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex items-center gap-1">
        <button className="bg-white p-2 rounded-full">
          <img src={GoBack} alt="Go Back" className="w-5 h-5" />
        </button>
        <button
          className="text-black/75 font-semibold"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate({ to: "/dashboard" });
            }
          }}
        >
          Voltar
        </button>
      </div>
      <div className="text-center xl:text-left">
        <h1 className="text-lg xl:text-2xl font-bold">{campaign.name}</h1>
      </div>

      <div className="grid xl:grid-cols-2 xl:gap-4 mt-4">
        {/* Coluna esquerda - Tipo e Inscrição */}
        <div className="space-y-4">
          <CampaignDetails
            campaign={campaign}
            vagasRestantes={campaignWithOpenJobs.vagasRestantes}
            pb={pb}
            timeAgo={timeAgo}
          />

          {/* Informações da Marca - Desktop */}
          <div className="hidden xl:block mt-4">
            <CampaignBrandProfile
              brand={campaign.expand?.brand}
              formatLocation={formatLocation}
            />
          </div>
        </div>

        {/* Coluna direita - Detalhes, Requisitos e Características */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-lg border max-xl:mt-4">
            <h2 className="font-bold">Detalhes da Campanha</h2>
            <p className="text-black mt-2">{campaign.description}</p>
          </div>

          <CampaignRequirements
            gender={campaign.gender}
            min_age={campaign.min_age}
            max_age={campaign.max_age}
            min_followers={campaign.min_followers}
            niches={campaignWithOpenJobs.expand?.niche}
            genderMap={genderMap}
          />

          <CampaignVideoCharacteristics
            video_type={campaign.video_type}
            min_video_duration={campaign.min_video_duration}
            max_video_duration={campaign.max_video_duration}
          />

          <div className="xl:hidden mt-4">
            <CampaignBrandProfile
              brand={campaign.expand?.brand}
              formatLocation={formatLocation}
            />
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

export default CampaignPage;
