import React, { useEffect, useState } from "react";
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
import { UserAuth } from "@/types/UserAuth";

interface CampaignCardProps {
  campaignData: Campaign;
  participationStatus: ParticipationStatusFilter;
  fromMyCampaigns: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaignData,
  participationStatus,
  fromMyCampaigns,
}) => {
  const beginningDate = formatDateUTC(campaignData.beginning);
  const endDate = formatDateUTC(campaignData.end);

  const [soldOutState, setSoldOutState] = useState<boolean>(false);

  const getParticipationsCampaign = async () => {
    const records = await pb
      .collection("Campaigns_Participations")
      .getFullList({
        filter: `campaign="${campaignData.id}"`,
      });

    // Contar quantos participantes estão aprovados ou completados
    const approvedOrCompletedCount = records.filter(
      (r) =>
        r.status === ParticipationStatusFilter.Approved ||
        r.status === ParticipationStatusFilter.Completed
    ).length;

    // Verificar se já atingiu ou excedeu o número de vagas (open_jobs)
    // E se o usuário atual está esperando (waiting)
    if (
      participationStatus === ParticipationStatusFilter.Waiting &&
      (campaignData.open_jobs || 0) <= approvedOrCompletedCount
    ) {
      setSoldOutState(true);

      try {
        const user: UserAuth = JSON.parse(
          localStorage.getItem("pocketbase_auth") as string
        );

        const participation = await pb
          .collection("Campaigns_Participations")
          .getFullList({
            filter: `campaign="${campaignData.id}" && influencer="${user.model.id}"`,
          });

        console.log(participation);

        await pb
          .collection("Campaigns_Participations")
          .update(participation[0].id, {
            status: "sold_out",
          });
      } catch (e) {
        console.log(`error update status to sold_out: ${e}`);
      }
    } else {
      if (
        !fromMyCampaigns &&
        (campaignData.open_jobs || 0) <= approvedOrCompletedCount
      ) {
        setSoldOutState(true);
      } else {
        setSoldOutState(false);
      }
    }
  };

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

  useEffect(() => {
    getParticipationsCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link
      to="/dashboard/campanhas/$campaignName"
      params={{ campaignName: campaignData.unique_name }}
      className="flex flex-col md:flex-row bg-white rounded-lg border-2 h-auto"
    >
      <div className="w-full hidden md:block md:w-[32%] h-auto">
        {campaignData.cover_img ? (
          <div
            className="w-full h-full bg-cover bg-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            style={{
              backgroundImage: `url(${pb.getFileUrl(campaignData, campaignData.cover_img)})`,
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
              {`${formatCentsToCurrency(campaignData.price)}`}
              /pessoa
            </div>

            {!fromMyCampaigns &&
              JSON.parse(
                localStorage.getItem("pocketbase_auth") as string
              )?.model?.id?.includes(campaignData.expand?.brand?.id) && (
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="w-5 h-5" />
                  {campaignData.open_jobs ?? 0} vagas abertas
                </div>
              )}
          </div>

          {participationStatus && (
            <span
              className="font-semibold"
              style={{
                color: getStatusColor(
                  soldOutState ? "sold_out" : participationStatus
                ),
              }}
            >
              Status:{" "}
              {readTextStatus(soldOutState ? "sold_out" : participationStatus)}
            </span>
          )}

          {soldOutState && !fromMyCampaigns && (
            <span className="font-semibold text-[#DC3545]">
              Status: Vagas encerradas
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
