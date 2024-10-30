import React from "react";
import { Campaign } from "@/types/Campaign";
import { Calendar, User, Tag } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  participationStatus: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  participationStatus,
}) => {
  const beginningDate = new Date(campaign.beginning);
  const endDate = new Date(campaign.end);
  const createdDate = new Date(campaign.created);

  return (
    <div className="flex bg-white p-4 rounded-lg shadow-md h-[300px]">
      <div className="w-[30%] h-auto">
        <img
          src="https://via.placeholder.com/300"
          alt={campaign.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 pl-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">
              {campaign.genre}
            </span>
          </div>
        </div>
        <h3 className="text-lg font-bold">{campaign.name}</h3>
        <span className="text-gray-500 text-sm mb-4">
          {createdDate.toLocaleDateString()}
        </span>
        <p className="text-gray-700 mb-3">{campaign.description}</p>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-5 h-5" />
            {`${beginningDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
          </div>
        </div>

        <div className="flex justify-between items-center border-t-2 pt-2">
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <Tag className="w-5 h-5" />
              {`R$${campaign.price}`}
            </div>

            <div className="ml-4 flex items-center gap-2 text-gray-500">
              <User className="w-5 h-5" />
              {campaign.open_jobs ?? 0} vagas abertas
            </div>
          </div>

          <span
            className={`font-semibold ${
              participationStatus === "completed"
                ? "text-green-500"
                : "text-blue-500"
            }`}
          >
            Status: {participationStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
