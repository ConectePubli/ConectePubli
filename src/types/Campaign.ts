import { CampaignParticipation } from "./Campaign_Participations";
import { ParticipationStatusFilter } from "@/types/Filters";
import { Niche } from "./Niche";
import { Brand } from "./Brand";

export interface Campaign {
  paid_traffic: boolean | null;
  paid_traffic_info: string;
  id: string;
  unique_name: string;
  name: string;
  briefing?: string;
  mandatory_deliverables: string;
  sending_products_or_services: string;
  expected_actions: string;
  avoid_actions: string;
  additional_information: string;
  itinerary_suggestion: string;
  price: number;
  paid?: boolean;
  brand: string;
  beginning: Date;
  end: Date;
  max_subscriptions: number;
  open_jobs?: number;
  objective?: "UGC" | "IGC" | "UGC+IGC";
  status:
    | "draft"
    | "analyzing"
    | "ready"
    | "in_progress"
    | "subscription_ended"
    | "ended"
    | "rejected";
  niche: string[];
  cover_img?: string | File;
  gender?: string;
  min_age?: number;
  max_age?: number;
  min_followers?: number;
  locality: string[];
  min_video_duration?: string;
  max_video_duration?: string;
  channels: string | string[];
  responsible_name: string;
  responsible_email: string;
  responsible_phone: number;
  responsible_cpf: string;
  audio_format?: "Música" | "Narração" | null | undefined;
  product_url: string;
  created: Date;
  updated: Date;
  collectionId: string;
  collectionName: string;
  vagasRestantes?: number;
  participationStatus?: ParticipationStatusFilter;
  address: string;
  spotlightActive: boolean;
  spotlightPurchasedAt: Date;
  subscription_start_date: Date;
  subscription_end_date: Date;
  expand?: {
    Campaigns_Participations_via_campaign?: CampaignParticipation[];
    niche?: Niche[];
    brand?: Brand;
  };
}
