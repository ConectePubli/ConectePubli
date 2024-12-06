import React from "react";
import { User } from "lucide-react";
import CalendarIcon from "@/assets/icons/calendar.svg";
import TagIcon from "@/assets/icons/tag.svg";
import CoinsIcon from "@/assets/icons/coins.svg";
import { Campaign } from "@/types/Campaign";
import CoverPlaceholder from "@/assets/background-placeholder.webp";
import SocialNetworks from "@/types/SocialNetworks";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";
import { formatDateUTC } from "@/utils/formatDateUTC";
interface CampaignSliderBannerProps {
  campaign: Campaign;
  isFirst: boolean;
}

const CampaignSliderBanner: React.FC<CampaignSliderBannerProps> = ({
  campaign,
  isFirst,
}) => {
  return (
    <div
      data-campaign-id={campaign.id}
      data-campaign-unique-name={campaign.unique_name}
      className={`flex-shrink-0 w-72 sm-medium:w-80 sm-plus:w-96 sm:w-9/12 mr-4 select-none hover:cursor-pointer bg-white ${
        isFirst ? "ml-4" : ""
      }`}
      id={isFirst ? "first-campaign-banner" : undefined}
    >
      <div className="flex flex-row w-full border border-gray-400 rounded-lg">
        <img
          src={
            campaign.cover_img
              ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${campaign.collectionName}/${campaign.id}/${campaign.cover_img}`
              : CoverPlaceholder
          }
          alt="campaign"
          draggable={false}
          className="w-[375px] h-[292px] object-cover hidden xl:block rounded-l-lg select-none max-sm:h-[320px]"
        />

        <div className="flex flex-col p-4 w-full h-[292px] max-md:h-[320px]">
          <p className="text-[12px] font-bold flex flex-row items-center text-[#052759]">
            <img src={TagIcon} alt="Edit" className="w-3 h-3 mr-1" />
            {campaign.objective}
          </p>
          <h1 className="text-lg font-bold mt-2">{campaign.name}</h1>
          <p
            className="text-sm mt-2 text-gray-500 font-semibold truncate whitespace-nowrap max-w-72 sm-medium:max-w-80 sm-plus:max-w-96 sm:max-w-9/12"
            title={campaign.expand?.niche
              ?.map((niche) => niche.niche)
              .join(", ")}
          >
            {campaign.expand?.niche?.map((niche) => niche.niche).join(", ")}{" "}
          </p>
          <p className="mt-2 text-[15px] leading-[22.5px] line-clamp-3 min-h-[67.5px]">
            {campaign.briefing}
          </p>

          <div className="flex flex-col md:flex-row md:flex-wrap gap-0 md:gap-4 justify-between">
            <div className="flex flex-row items-center mt-3 gap-2">
              <div className="flex flex-wrap gap-2">
                {SocialNetworks.filter((network) =>
                  campaign.channels.includes(network.name)
                ).map((network) => (
                  <img
                    key={network.name}
                    src={network.icon}
                    alt={`Icon for ${network.name}`}
                    className="w-4 h-4"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-row items-center mt-3">
              <img src={CalendarIcon} alt="Calendar" className="w-4 h-4 mr-2" />
              <p className="text-[12px] text-gray-700 font-bold">
                {campaign.beginning ? formatDateUTC(campaign.beginning) : "N/A"}{" "}
                - {campaign.end ? formatDateUTC(campaign.end) : "N/A"}
              </p>
            </div>
          </div>

          <div className="border mt-3 mb-3" />

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
            <p className="font-semibold flex flex-row items-center text-[#6F42C1]">
              <img src={CoinsIcon} alt="Coins" className="w-4 h-4 mr-2" />
              {formatCentsToCurrency(campaign.price)}
              /pessoa
            </p>

            {JSON.parse(
              localStorage.getItem("pocketbase_auth") as string
            ).model?.id?.includes(campaign.expand?.brand?.id) && (
              <p className="font-semibold flex flex-row items-center ">
                <User className="mr-2" size={16} />
                {campaign.vagasRestantes} vagas abertas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSliderBanner;
