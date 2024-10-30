import { Campaign } from "./Campaign";
import { Influencer } from "./Influencer";

export interface CampaignParticipation {
  id: string;
  Campaign: string;
  Influencer: string;
  status: "waiting" | "approved" | "completed" | "sold_out";
  created: Date;
  updated: Date;
  collectionId: string;
  collectionName: string;
  expand: {
    Campaign: Campaign;
    Influencer: Influencer;
  };
}
