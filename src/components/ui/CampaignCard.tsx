import React from "react";
import { Campaign } from "@/types/Campaign";
import { Calendar, User, Tag } from "lucide-react";
import { Coins, Image } from "phosphor-react";
import pb from "@/lib/pb";
import SocialNetworks from "@/types/SocialNetworks";
import { ParticipationStatusFilter } from "@/types/Filters";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";
import { Link } from "@tanstack/react-router";
import { getStatusColor } from "@/utils/getColorStatusInfluencer";
import { formatDateUTC } from "@/utils/formatDateUTC";

interface CampaignCardProps {
  campaign: Campaign;
  participationStatus: ParticipationStatusFilter;
  fromMyCampaigns: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  participationStatus,
  fromMyCampaigns,
}) => {
  const beginningDate = formatDateUTC(campaign.beginning);
  const endDate = formatDateUTC(campaign.end);

  const readTextStatus = (type: string) => {
    switch (type) {
      case "waiting":
        return "Proposta Pendente";
      case "approved":
        return "Trabalho em Progresso";
      case "completed":
        return "Trabalho Concluído";
      case "sold_out":
        return "Vagas Esgotadas";
      default:
        return "";
    }
  };

  return (
    <Link
      to="/dashboard/campanhas/$campaignName"
      params={{ campaignName: campaign.unique_name }}
      className="flex flex-col md:flex-row bg-white rounded-lg border-2 h-auto"
    >
      <div className="w-full hidden md:block md:w-[32%] h-auto">
        {campaign.cover_img ? (
          <div
            className="w-full h-full bg-cover bg-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            style={{
              backgroundImage: `url(${pb.getFileUrl(campaign, campaign.cover_img)})`,
            }}
          ></div>
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
            <Image color="#fff" size={40} />
          </div>
        )}
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Tag className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">
              {campaign.objective}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold">{campaign.name}</h3>

        <p
          className="text-gray-700 mb-3"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {campaign.briefing}
        </p>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
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

          {/* Date */}
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              {`${beginningDate} - ${endDate}`}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Coins className="w-5 h-5" />
              {`${formatCentsToCurrency(campaign.price)}`}
              /pessoa
            </div>

            {!fromMyCampaigns &&
              JSON.parse(
                localStorage.getItem("pocketbase_auth") as string
              )?.model?.id?.includes(campaign.expand?.brand?.id) && (
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="w-5 h-5" />
                  {campaign.open_jobs ?? 0} vagas abertas
                </div>
              )}
          </div>

          {participationStatus && (
            <span
              className="font-semibold"
              style={{ color: getStatusColor(participationStatus) }}
            >
              Status: {readTextStatus(participationStatus)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
