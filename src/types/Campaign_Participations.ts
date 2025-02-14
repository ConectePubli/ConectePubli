import { Campaign } from "./Campaign";
import { Influencer } from "./Influencer";
import { ParticipationStatusFilter } from "@/types/Filters";
import { PurchasedPremiumPlan } from "./PurchasedPremiumPlan";

export interface CampaignParticipation {
  id?: string;
  campaign: string;
  influencer: string;
  description: string;
  status: ParticipationStatusFilter;
  created?: Date;
  updated?: Date;
  collectionId?: string;
  collectionName?: string;
  expand?: {
    campaign?: Campaign;
    influencer?: Influencer;
    purchased_influencers_plans: PurchasedPremiumPlan[];
  };
}
