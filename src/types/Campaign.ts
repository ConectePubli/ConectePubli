import { CampaignParticipation } from "./Campaign_Participations";
import { ParticipationStatusFilter } from "@/types/Filters";
import { Niche } from "./Niche";
import { Brand } from "./Brand";

export interface Campaign {
  paid_traffic: boolean | null;
  id: string;
  unique_name: string;
  name: string;
  description?: string;
  price: number;
  paid?: boolean;
  brand: string;
  beginning: Date;
  end: Date;
  max_subscriptions: number;
  open_jobs?: number;
  objective?: "UGC" | "Influencer";
  status: "ready" | "in_progress" | "ended";
  niche: string[];
  cover_img?: string;
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
  expand?: {
    Campaigns_Participations_via_campaign?: CampaignParticipation[];
    niche?: Niche[];
    brand?: Brand;
  };
}
