import { Campaign } from "./Campaign";

export interface Notification {
  id: string;
  type: "new_campaign";
  from_brand?: string;
  from_influencer?: string;
  to_brand?: string;
  to_influencer?: string;
  description?: string;
  read: boolean;
  created?: string;
  expand?: {
    campaign: Campaign;
  };
}
