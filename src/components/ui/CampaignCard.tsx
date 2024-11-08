import React from "react";
import { Campaign } from "@/types/Campaign";
import { Calendar, User, Tag } from "lucide-react";
import { Coins, Image } from "phosphor-react";
import pb from "@/lib/pb";
import SocialNetworks from "@/types/SocialNetworks";

interface CampaignCardProps {
  campaign: Campaign;
  participationStatus: string;
  fromMyCampaigns: boolean; // esconde algumas informações
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  participationStatus,
  fromMyCampaigns,
}) => {
  const beginningDate = new Date(campaign.beginning);
  const endDate = new Date(campaign.end);

  const readTextStatus = (type: string) => {
    switch (type) {
      case "waiting":
        return "Aguardando";
      case "approved":
        return "Aprovado";
      case "completed":
        return "Concluído";
      case "sold_out":
        return "Vagas esgotadas";
      default:
        return "";
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "completed":
        return "#28A745"; // Concluído
      case "approved":
        return "#2881A7"; // Aprovado
      case "waiting":
        return "#FFC107"; // Aguardando
      case "sold_out":
        return "#DC3545"; // Vagas esgotadas
      default:
        return "#000000"; // Cor padrão (preto)
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg border-2 h-auto">
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
              {campaign.objective === "UGC" ? "UGC" : "Influenciador"}
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
          {campaign.description}
        </p>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          {/* Social Network Icons */}
          <div className="flex flex-wrap gap-2">
            {SocialNetworks.filter((network) => campaign.channels.includes(network.name))
              .map((network) => (
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
              {`${beginningDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Coins className="w-5 h-5" />
              {`R$${campaign.price}`}/pessoa
            </div>

            {!fromMyCampaigns && (
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-5 h-5" />
                {campaign.open_jobs ?? 0} vagas abertas
              </div>
            )}
          </div>

          {/* Only render status if participationStatus is provided */}
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
    </div>
  );
};

export default CampaignCard;
