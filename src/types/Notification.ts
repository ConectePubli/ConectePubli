import { Brand } from "./Brand";
import { Campaign } from "./Campaign";
import { Influencer } from "./Influencer";

export interface Notification {
  id: string;
  type:
    | "new_campaign"
    | "campaign_participation_confirmation"
    | "campaign_approval_influencer"
    | "campaign_approval_brand"
    | "campaign_completed_influencer"
    | "campaing_ended_brand"
    | "new_campaign_participation";
  from_brand?: string;
  from_influencer?: string;
  to_brand?: string;
  to_influencer?: string;
  description?: string;
  read: boolean;
  created?: string;
  expand?: {
    campaign: Campaign;
    from_influencer?: Influencer;
    from_brand?: Brand;
  };
}
