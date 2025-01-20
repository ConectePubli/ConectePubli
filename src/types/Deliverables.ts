import { Brand } from "./Brand";
import { Influencer } from "./Influencer";

export interface Deliverables {
  id: string;
  brand: string;
  influencer: string;
  stories_qty: number;
  feed_qty: number;
  reels_qty: number;
  ugc_qty: number;
  status: "waiting" | "approved" | "completed" | "refused";
  total_price: number;
  description: string;
  paid: boolean;
  expand: {
    influencer: Influencer;
    brand: Brand;
  };
}
