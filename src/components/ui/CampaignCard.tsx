import React from "react";
import { Campaign } from "@/types/Campaign";
import { Calendar, Tag, User } from "lucide-react";
import { Coins, Image } from "phosphor-react";
import pb from "@/lib/pb";
import SocialNetworks from "@/types/SocialNetworks";
import { ParticipationStatusFilter } from "@/types/Filters";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";
import { Link } from "@tanstack/react-router";
import { getStatusColor } from "@/utils/getColorStatusInfluencer";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { Brand } from "@/types/Brand";
import { t } from "i18next";
import { isEnableSubscription } from "@/utils/campaignSubscription";

interface CampaignCardProps {
  campaignData: Campaign;
  participationStatus: ParticipationStatusFilter;
  fromMyCampaigns: boolean;
  hideStatusSubscription?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaignData,
  participationStatus,
  fromMyCampaigns,
  hideStatusSubscription,
}) => {
  const beginningDate = formatDateUTC(campaignData.beginning);
  const endDate = formatDateUTC(campaignData.end);

  const readTextStatus = (type: string) => {
    switch (type) {
      case "waiting":
        return t("Proposta Pendente");
      case "approved":
        return t("Trabalho em Progresso");
      case "completed":
        return t("Trabalho Concluído");
      case "sold_out":
        return t("Vagas Esgotadas");
      case "analysing":
        return t("Campanha em análise");
      case "canceled":
        return t("Trabalho não Entregue");
      default:
        return "";
    }
  };

  return (
    <Link
      to="/dashboard/campanhas/$campaignName"
      params={{ campaignName: campaignData.unique_name }}
      className={`flex flex-col md:flex-row bg-white rounded-lg border-2 h-auto  ${campaignData.spotlightActive ? "border-blue-500" : "border-gray-200"} `}
    >
      <div className="w-full hidden md:block md:w-[32%] h-auto">
        {campaignData.cover_img ? (
          <div
            className="w-full h-full bg-cover bg-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            style={{
              backgroundImage: `url(${
                typeof campaignData.cover_img === "string"
                  ? pb.getFileUrl(campaignData, campaignData.cover_img)
                  : URL.createObjectURL(campaignData.cover_img)
              })`,
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
              {campaignData.objective}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold">{campaignData.name}</h3>

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
          {campaignData.briefing}
        </p>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {SocialNetworks.filter((network) =>
              campaignData.channels.includes(network.name)
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
          <div className="flex justify-end items-center max-sm:flex-col max-sm:items-end">
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
              {`${formatCentsToCurrency(campaignData.price)}`}
              {t("/pessoa")}
            </div>
          </div>

          {campaignData.subscription_start_date &&
            campaignData.subscription_end_date &&
            !isEnableSubscription(campaignData).status &&
            !hideStatusSubscription && (
              <span
                className="font-semibold"
                style={{
                  color: "red",
                }}
              >
                {isEnableSubscription(campaignData).message === "not_started" &&
                  "Inscrições não iniciadas"}
                {isEnableSubscription(campaignData).message === "time_out" &&
                  t("Status: Inscrições Encerradas")}
              </span>
            )}

          {participationStatus && (
            <span
              className="font-semibold"
              style={{
                color: getStatusColor(participationStatus),
              }}
            >
              Status: {readTextStatus(participationStatus)}
            </span>
          )}

          {!participationStatus &&
            campaignData.status === "subscription_ended" && (
              <span
                className="font-semibold"
                style={{
                  color: "red",
                }}
              >
                {t("Status: Inscrições Encerradas")}
              </span>
            )}

          {!fromMyCampaigns && (
            <div className="flex items-center space-x-2 max-sm:mt-2">
              {campaignData?.expand?.brand?.profile_img ? (
                <img
                  src={pb.files.getUrl(
                    (campaignData.expand?.brand as Brand) || {},
                    campaignData.expand?.brand?.profile_img || ""
                  )}
                  alt="brand logo"
                  className="w-10 h-10 rounded-md object-cover"
                  draggable={false}
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-300">
                  <User className="w-5 h-5" color="#fff" />
                </div>
              )}

              <h3>
                {campaignData.expand?.brand?.name &&
                campaignData?.expand?.brand?.name?.length > 30
                  ? `${campaignData?.expand?.brand?.name.slice(0, 30)}...`
                  : campaignData?.expand?.brand?.name}
              </h3>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
