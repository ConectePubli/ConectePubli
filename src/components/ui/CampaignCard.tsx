import React from "react";
import { Campaign } from "@/types/Campaign";
import { Calendar, User, Tag } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div className="flex bg-white p-4 rounded-lg shadow-md h-[300px]">
      <div className="w-[30%] h-auto">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-[100%] h-[100%] object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 pl-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">
              Publicidade Paga/Influenciador
            </span>
          </div>
        </div>
        <h3 className="text-lg font-bold">{campaign.title}</h3>
        <span className="text-gray-500 text-sm mb-4">{campaign.time}</span>
        <p className="text-gray-700 mb-3">{campaign.description}</p>

        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 mb-3"></div>

          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-5 h-5" />
            {campaign.date}
          </div>
        </div>

        <div className="flex justify-between items-center border-t-2 pt-2">
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Tag className="w-5 h-5" />
              {campaign.price}
            </div>

            <div className="ml-4 flex items-center gap-2 text-gray-500">
              <User className="w-5 h-5" />
              {campaign.vacancies} vagas abertas
            </div>
          </div>

          <span className={`font-semibold ${campaign.statusColor}`}>
            Status: {campaign.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
