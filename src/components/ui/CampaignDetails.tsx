// src/components/ui/CampaignDetails.tsx
import React from "react";
import TagIcon from "@/assets/icons/tag.svg";
import Coins from "@/assets/icons/coins.svg";
import UserIcon from "@/assets/icons/user.svg";
import Calendar from "@/assets/icons/calendar.svg";
import { Campaign } from "@/types/Campaign";
import SocialNetworks from "@/types/SocialNetworks";
import Client from "pocketbase";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";

interface CampaignDetailsProps {
  campaign: Campaign;
  vagasRestantes: number | undefined;
  pb: Client;
  timeAgo: (date: Date) => string;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaign,
  vagasRestantes,
  pb,
  timeAgo,
}) => {
  // Verifica se há pelo menos um detalhe para exibir
  const hasDetails =
    Boolean(campaign.created) ||
    Boolean(campaign.objective) ||
    (campaign.channels && campaign.channels.length > 0) ||
    Boolean(campaign.beginning) ||
    Boolean(campaign.end) ||
    Boolean(campaign.price) ||
    Boolean(vagasRestantes);

  if (!hasDetails) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border">
      <div className="flex flex-col items-start gap-3">
        {/* Data de Postagem */}
        {campaign.created && (
          <p className="text-gray-500 font-bold text-sm">
            Postado há {timeAgo(new Date(campaign.created))} atrás
          </p>
        )}

        {/* Tipo de Campanha */}
        {campaign.objective && (
          <p className="text-[14px] font-bold flex flex-row items-center text-[#052759]">
            <img src={TagIcon} alt="Tag" className="w-4 h-4 mr-1" />
            Tipo: {campaign.objective}
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

        {/* Data de Início */}
        {campaign.beginning && (
          <p className="text-black/75 text-sm font-bold flex flex-row items-center gap-2">
            <img src={Calendar} alt="Início" className="w-4 h-4" /> Início:{" "}
            {new Date(campaign.beginning).toLocaleDateString()}
          </p>
        )}

        {/* Data de Encerramento */}
        {campaign.end && (
          <p className="text-black/75 text-sm font-bold flex flex-row items-center gap-2">
            <img src={Calendar} alt="Encerramento" className="w-4 h-4" />
            Encerramento: {new Date(campaign.end).toLocaleDateString()}
          </p>
        )}

        {/* Preço */}
        {campaign.price !== undefined && campaign.price !== null && (
          <p className="font-semibold flex flex-row items-center text-[#6F42C1]">
            <img src={Coins} alt="Coins" className="w-4 h-4 mr-2" />
            {formatCentsToCurrency(campaign.price)}
            /pessoa
          </p>
        )}

        {/* Vagas Restantes */}
        <p className="flex flex-row items-center font-semibold text-black">
          <img src={UserIcon} alt="User" className="w-4 h-4 mr-2" />
          Vagas: {vagasRestantes}
        </p>

        {/* Botão de Inscrição ou Mensagem de Vagas Esgotadas */}
        {campaign.id !== pb.authStore.model?.id &&
          (vagasRestantes === 0 ? (
            <p className="text-red-500 font-semibold">Vagas esgotadas</p>
          ) : (
            <button
              className={`bg-[#10438F] text-white px-4 py-2 rounded-md mt-2 font-bold ${
                pb.authStore.model?.collectionName === "Brands"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#10438F]/90"
              }`}
              disabled={pb.authStore.model?.collectionName === "Brands"}
              onClick={() => {
                if (pb.authStore.model?.collectionName !== "Brands") {
                  // LOGICA DE INSCRIÇÃO
                }
              }}
            >
              Inscrever-se
            </button>
          ))}
      </div>
    </div>
  );
};

export default CampaignDetails;
