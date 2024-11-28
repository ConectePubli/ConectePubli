import { Brand } from "./Brand";
import { Campaign } from "./Campaign";
import { Influencer } from "./Influencer";
import { Message } from "./Message";

export interface Chat {
  id: string;
  brand: string;
  campaign: string;
  influencer: string;
  updated: Date;
  created: Date;

  expand?: {
    campaign?: Campaign;
    influencer?: Influencer;
    brand?: Brand;
    messages_via_chat?: Message[];
  };
}
