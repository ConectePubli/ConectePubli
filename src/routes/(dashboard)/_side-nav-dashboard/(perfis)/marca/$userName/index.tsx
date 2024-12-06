import {
  createFileRoute,
  notFound,
  redirect,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";

import CompanyIcon from "@/assets/icons/company.svg";
import LocationPin from "@/assets/icons/location-pin.svg";
import EditIcon from "@/assets/icons/edit.svg";
import { Link } from "lucide-react";
import CampaignSlider from "@/components/ui/CampaignSlider";
import pb from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import SocialNetworks from "@/types/SocialNetworks";
import { Brand } from "@/types/Brand";
import { Campaign } from "@/types/Campaign";
import BackgroundPlaceholder from "@/assets/background-placeholder.webp";
import ProfilePlaceholder from "@/assets/profile-placeholder.webp";
import { CampaignParticipation } from "@/types/Campaign_Participations";
import { formatLocation } from "@/utils/formatLocation";
import { getUserType } from "@/lib/auth";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/marca/$userName/"
)({
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login123new",
      });
    }
  },
  loader: async ({ params: { userName } }) => {
    try {
      const brandData = await pb
        .collection<Brand>("brands")
        .getFirstListItem(`username="${userName}"`, {
          expand: "niche",
        });

      if (!brandData) {
        throw notFound();
      }

      const campaignsData =
        (await pb.collection<Campaign>("campaigns").getFullList({
          filter: `brand="${brandData.id}" && paid=true`,
          expand: "niche, brand",
        })) || [];

      const campaignsParticipationsData =
        (await pb
          .collection("Campaigns_Participations")
          .getFullList<CampaignParticipation>({
            expand: "Campaign,Influencer",
          })) || [];

      return { brandData, campaignsData, campaignsParticipationsData };
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
  component: Page,
  errorComponent: () => (
    <div>
      Aconteceu um erro ao carregar essa página, não se preocupe o erro é do
      nosso lado e vamos trabalhar para resolve-lo!
    </div>
  ),
  notFoundComponent: () => <div>Perfil não encontrado</div>,
});

function Page() {
  const { brandData, campaignsData, campaignsParticipationsData } =
    useLoaderData({ from: Route.id });
  const brand = brandData as Brand;
  const campaigns = campaignsData as Campaign[];
  const campaignParticipations =
    campaignsParticipationsData as CampaignParticipation[];

  const calculateOpenJobs = (
    campaigns: Campaign[],
    participations: CampaignParticipation[]
  ): Campaign[] => {
    const participationCountMap: { [key: string]: number } = {};

    participations.forEach((participation) => {
      const campaignId = participation.campaign;
      if (
        // participation.status === "waiting" || NÃO CONSIDERAR QUANDO TIVER WAITING
        participation.status === "approved" ||
        participation.status === "completed"
      ) {
        if (participationCountMap[campaignId]) {
          participationCountMap[campaignId] += 1;
        } else {
          participationCountMap[campaignId] = 1;
        }
      }
    });

    return campaigns.map((campaign) => {
      const ocupadas = participationCountMap[campaign.id] || 0;
      const vagasRestantes = (campaign.open_jobs || 0) - ocupadas;
      return {
        ...campaign,
        vagasRestantes: vagasRestantes >= 0 ? vagasRestantes : 0,
      };
    });
  };

  const campaignsWithOpenJobs = calculateOpenJobs(
    campaigns,
    campaignParticipations
  );

  const navigate = useNavigate();

  return (
    <div className="flex p-0 flex-col ">
      <img
        src={
          brand.cover_img
            ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${brand.collectionName}/${brand.id}/${brand.cover_img}`
            : BackgroundPlaceholder
        }
        alt="capa"
        className="w-full max-w-full h-64 object-cover mx-auto"
      />

      <div>
        {/* BASIC INFO*/}
        <div className="flex flex-row items-center px-4 mt-4">
          <img
            src={
              brand?.profile_img
                ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${brand.collectionName}/${brand.id}/${brand.profile_img}`
                : ProfilePlaceholder
            }
            alt="avatar"
            draggable={false}
            className="w-20 h-20 rounded-md object-cover"
          />

          <div className="ml-3">
            <p className="text-gray-500 text-sm font-bold flex flex-row items-center">
              <img
                src={CompanyIcon}
                alt="company icon"
                className="w-3 h-3 mr-1"
              />
              Marca
            </p>
            <h1 className="text-xl font-bold break-words break-all">
              {brand?.name || "..."}
            </h1>
          </div>
        </div>

        {/* LOCATION*/}
        <div className="flex flex-row items-center mt-3 px-4">
          <img src={LocationPin} alt="location pin" className="w-5 h-5 mr-1" />
          <p className="text-orange-600 font-bold text-md truncate max-w-xs">
            {formatLocation(brand)}
          </p>
        </div>

        {/* LINK */}
        {brand?.web_site && (
          <div className="mt-2 flex flex-row items-center px-4">
            <Link className="text-black mr-2" size={16} />
            <a
              className="text-[#10438F] font-semibold text-md hover:underline"
              href={brand.web_site}
              target="_blank"
            >
              {brand.web_site}
            </a>
          </div>
        )}

        {/* REDES SOCIAIS*/}
        <div className="flex flex-wrap gap-2 mt-2 px-2 sm-medium:gap-2 sm-medium:px-4">
          {SocialNetworks.map((network) => {
            const url = network.url(brand);
            if (!url) return null;

            return (
              <a
                key={network.name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border border-[#10438F] text-[#10438F] px-2 py-1 text-sm sm-medium:text-base rounded-md font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200 sm-medium:px-3 sm-medium:py-2 sm-medium:text-md"
              >
                <img
                  src={network.icon}
                  alt={`Ícone do ${network.name}`}
                  className="w-4 h-4 mr-1 sm-medium:w-5 sm-medium:h-5 sm-medium:mr-2"
                />
                {network.name}
              </a>
            );
          })}
        </div>

        {brand?.id === pb.authStore.model?.id && (
          <div className="flex px-4 mt-4">
            <button
              className="text-white font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
              onClick={() => navigate({ to: "./editar" })}
            >
              <img
                src={EditIcon}
                alt="company icon"
                className="w-4 h-4 text-white fill-current"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              Editar Perfil
            </button>
          </div>
        )}

        {/* CONTATO*/}

        <div className="border mt-5 mb-4" />

        {/* CAMPANHAS*/}
        <div className="w-full max-w-[99dvw] lg:max-w-[calc(100vw-250px)]">
          <CampaignSlider campaigns={campaignsWithOpenJobs} />
        </div>

        <div className="border mt-5 mb-4" />

        {/* BIOGRAFIA*/}
        <div className="mt-4 px-4">
          <h2 className="text-lg font-bold">Biografia</h2>
          <p className="text-black text-md mt-2 break-all">
            {brand?.bio || "Biografia não informada."}
          </p>
        </div>

        {/* HASHTAGS*/}
        <div className="flex flex-wrap gap-2 mt-3 px-4">
          {brand?.expand?.niche?.map((tag, index) => (
            <button
              key={index}
              className="bg-[#10438F] cursor-default text-white px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200"
              title={tag.niche}
            >
              <span className="">#{tag.niche}</span>{" "}
            </button>
          ))}
        </div>

        <div className="mt-5 mb-6" />
      </div>
    </div>
  );
}
