// src/components/ui/CampaignSliderBanner.tsx
import React from "react";
import { Calendar, Coins, Tag, User } from "lucide-react";
import InstagramIcon from "@/assets/icons/instagram.svg";
import FacebookIcon from "@/assets/icons/facebook.svg";
import { format } from "date-fns";
import { Campaign } from "@/types/Campaign";

interface CampaignSliderBannerProps {
  campaign: Campaign;
  isFirst: boolean;
  onClick: (id: string) => void;
}

const CampaignSliderBanner: React.FC<CampaignSliderBannerProps> = ({
  campaign,
  isFirst,
  onClick,
}) => {
  return (
    <div
      className={`flex-shrink-0 w-72 h-auto mt-1 mr-4 select-none hover:cursor-pointer bg-white ${
        isFirst ? "ml-4" : ""
      }`}
      onClick={() => onClick(campaign.id)}
    >
      <div className="flex flex-col border border-gray-400 rounded-lg p-4">
        <p className="text-[12px] font-bold flex flex-row items-center text-[#10438F]">
          <Tag className="mr-1" size={16} />
          {campaign.objective}
        </p>
        <h1 className="text-lg font-bold mt-2">{campaign.name}</h1>
        <p className="text-sm mt-2 text-gray-500 font-semibold">
          {campaign.niche.join(", ")}
        </p>
        <p className="mt-2 text-[15px]">{campaign.description}</p>
        <div className="flex flex-row items-center mt-3 gap-2">
          <img
            src={InstagramIcon}
            className="w-5 h-5 cursor-pointer"
            alt="Instagram"
            draggable={false}
          />
          <img
            src={FacebookIcon}
            className="w-5 h-5 cursor-pointer"
            alt="Facebook"
            draggable={false}
          />
        </div>

        <div className="flex flex-row items-center mt-3">
          <Calendar className="w-4 h-4 mr-2" />
          <p className="text-[12px] text-gray-700 font-bold">
            {campaign.beginning
              ? format(new Date(campaign.beginning), "dd/MM/yyyy")
              : "N/A"}{" "}
            -{" "}
            {campaign.end
              ? format(new Date(campaign.end), "dd/MM/yyyy")
              : "N/A"}
          </p>
        </div>

        <div className="border mt-3 mb-3" />

        <p className="font-semibold flex flex-row items-center text-[#6F42C1]">
          <Coins className="mr-2" size={16} />
          {campaign.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          /pessoa
        </p>

        <p className="font-semibold flex flex-row items-center mt-2">
          <User className="mr-2" size={16} />4 vagas abertas
        </p>
      </div>
    </div>
  );
};

export default CampaignSliderBanner;
