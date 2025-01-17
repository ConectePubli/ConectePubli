// src/components/ui/CampaignDetails.tsx
import React from "react";
import TagIcon from "@/assets/icons/tag.svg";
import Coins from "@/assets/icons/coins.svg";
import Calendar from "@/assets/icons/calendar.svg";
import SocialNetworks from "@/types/SocialNetworks";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";
import CampaignSubscribeButton from "./CampaignSubscribeButton";
import { timeAgo } from "@/utils/timeAgo";
import useIndividualCampaignStore from "@/store/useIndividualCampaignStore";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const CampaignDetails: React.FC = () => {
  const { t } = useTranslation();
  const { campaign } = useIndividualCampaignStore();

  if (!campaign) return null;

  const hasDetails =
    Boolean(campaign.created) ||
    Boolean(campaign.objective) ||
    (campaign.channels && campaign.channels.length > 0) ||
    Boolean(campaign.subscription_start_date) ||
    Boolean(campaign.subscription_end_date) ||
    Boolean(campaign.beginning) ||
    Boolean(campaign.end) ||
    Boolean(campaign.price) ||
    Boolean(campaign.vagasRestantes);

  if (!hasDetails) return null;

  const returnCampaignStatus = (status: string) => {
    switch (status) {
      case "ready":
        return t("Pronta para começar");
      case "in_progress":
        return t("Em progresso");
      case "subscription_ended":
        return t("Inscrições encerradas");
      case "ended":
        return t("Encerrada");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border">
      <div className="flex flex-col items-start gap-3">
        {/* Data de Postagem */}
        {campaign.created && (
          <p className="text-gray-500 font-bold text-sm">
            {`${t("Postado há")} ${timeAgo(new Date(campaign.created))} ${t("atrás")}`}
          </p>
        )}

        {/* Tipo de Campanha */}
        {campaign.objective && (
          <p className="text-[14px] font-bold flex flex-row items-center text-[#052759]">
            <img src={TagIcon} alt="Tag" className="w-4 h-4 mr-1" />
            {t("Tipo:")} {campaign.objective}
          </p>
        )}

        {/* Canais */}
        {campaign.channels && campaign.channels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {SocialNetworks.filter((network) =>
              campaign.channels.includes(network.name)
            ).map((network) => (
              <img
                key={network.name}
                title={network.name}
                src={network.icon}
                alt={`Icon for ${network.name}`}
                className="w-5 h-5"
              />
            ))}
          </div>
        )}

        {campaign.subscription_start_date && campaign.subscription_end_date && (
          <p className="text-black/75 text-sm font-bold flex flex-row items-center gap-2">
            <img src={Calendar} alt={t("Início")} className="w-4 h-4" />
            {t("Período de inscrições:")}{" "}
            {formatDateUTC(campaign.subscription_start_date)} -{" "}
            {formatDateUTC(campaign.subscription_end_date)}
          </p>
        )}

        {/* Data de Início */}
        {campaign.beginning && (
          <p className="text-black/75 text-sm font-bold flex flex-row items-center gap-2">
            <img src={Calendar} alt={t("Início")} className="w-4 h-4" />
            {t("Início da campanha:")} {formatDateUTC(campaign.beginning)}
          </p>
        )}

        {/* Data de Encerramento */}
        {campaign.end && (
          <p className="text-black/75 text-sm font-bold flex flex-row items-center gap-2">
            <img src={Calendar} alt={t("Encerramento")} className="w-4 h-4" />
            {t("Fim da campanha:")} {formatDateUTC(campaign.end)}
          </p>
        )}

        <div className="mb-2">
          <p className="text-sm text-gray-700">
            {t(
              "Período de Campanha: O prazo máximo estabelecido para que o creator entregue todo o escopo obrigatório da campanha."
            )}
          </p>
        </div>

        {campaign.status && (
          <p className="text-black/75 text-sm font-bold flex flex-row items-center gap-2">
            <Clock className="w-4 h-4" />
            {t("Status:")} {returnCampaignStatus(campaign.status)}
          </p>
        )}

        {/* Preço */}
        {campaign.price !== undefined && campaign.price !== null && (
          <p className="font-semibold flex flex-row items-center text-[#6F42C1]">
            <img src={Coins} alt="Coins" className="w-4 h-4 mr-2" />
            {formatCentsToCurrency(campaign.price)} {t("/pessoa")}
          </p>
        )}

        {/* Botão de Inscrição ou Mensagem de Vagas Esgotadas */}
        <CampaignSubscribeButton />
      </div>
    </div>
  );
};

export default CampaignDetails;
